import catchAsync from "../utils/catchAsync.js";
import ApiError from "../utils/ApiError.js";
import httpStatus from "http-status";
import auditServices from "../services/auditServices.js";
import roomServices from "../services/roomServices.js";
import guestServices from "../services/guestServices.js";
import bookingServices from "../services/bookingServices.js";

const createAudit = catchAsync(async (req, res) => {    
    const auditBody = req.body;

    console.log("totalCharges",auditBody)

    if (!auditBody.roomId || !auditBody.guestId || !auditBody.auditType  || !auditBody.items)  {
        throw new ApiError(httpStatus.BAD_REQUEST, "Room ID, GuestID ,auditType and Items are required");
    }
       if (auditBody.auditType !== 'check-in' && auditBody.auditType !== 'check-out' && auditBody.auditType !== 'maintenance') {   
        throw new ApiError(httpStatus.BAD_REQUEST, "Invalid audit type. Must be 'check-in', 'check-out', or 'maintenance'");
    }
    const room= await roomServices.getRoomById(auditBody.roomId);
    if (!room) {    
        throw new ApiError(httpStatus.NOT_FOUND, "Room not found"); 
    }
    if (room.status !== 'occupied') {
        throw new ApiError(httpStatus.BAD_REQUEST, "Room must be occupied to create an audit");
    }
    const guest = await guestServices.getGuestById(auditBody.guestId);
    if (!guest) {
        throw new ApiError(httpStatus.NOT_FOUND, "Guest not found");
    }

    if (!Array.isArray(auditBody.items) || auditBody.items.length === 0) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Audit items must be an array and cannot be empty");
    }
    auditBody.items.forEach(item => {
      
        if (!item.roomProductId || !item.conditionBefore || !item.conditionAfter || !item.quantity) {
            throw new ApiError(httpStatus.BAD_REQUEST, "Each audit item must have productId, conditionBefore, conditionAfter, and quantity");
        }

        // if (item.conditionBefore === item.conditionAfter) {
        //     throw new ApiError(httpStatus.BAD_REQUEST, "Condition before and after cannot be the same");
        // }


    });
    
    auditBody.totalCharges = auditBody.items.reduce((total, item) => {
        if (item.chargeAmount && typeof item.chargeAmount === 'number') {
            return total + item.chargeAmount * (item.quantity || 1);
        }
        return total;
    }, 0);
    auditBody.status =  auditBody.status||"pending"; 
    auditBody.auditDate = new Date(); 
    auditBody.auditedBy = auditBody.auditedBy || "System"; 


    console.log("chargeAmount:before",auditBody)
 
    const newAudit = await auditServices.createAudit(auditBody);

    console.log("newAudit",newAudit)

       if (!newAudit) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Error occurred while creating the new audit");
    }
    
  let bookingBody = {};

if (auditBody?.auditType === "check-in") {
  bookingBody["auditStatus.checkIn"] = {
    required: true,
    completed: true,
    auditId: newAudit?._id,
    completedAt: newAudit?.createdAt || new Date(),
    completedBy: auditBody.auditedBy || "System"
  };
  bookingBody["totalCharges"]=auditBody.totalCharges
  bookingBody["status"]="checked-in"
  bookingBody["checkInTime"]=new Date()
} else if (auditBody?.auditType === "check-out") {


    console.log("auditBody",auditBody,"check-out")
  bookingBody["auditStatus.checkOut"] = {
    required: true,
    completed: true,
    auditId: newAudit?._id,
    completedAt: newAudit?.createdAt || new Date(),
    completedBy: auditBody.auditedBy || "System"
  };
   bookingBody["status"]="checked-out"
   bookingBody["totalCharges"]=auditBody.totalCharges
   bookingBody["checkOutTime"]=new Date()
} else if (auditBody?.auditType === "maintenance") {
  bookingBody["auditStatus.maintenance"] = {
    required: true,
    completed: true,
    auditId: newAudit?._id,
    completedAt: newAudit?.createdAt || new Date(),
    completedBy: auditBody.auditedBy || "System"
  };
   bookingBody["status"]="maintenance"
   bookingBody["totalCharges"]=auditBody.totalCharges

}

  const updatedBookingResponse = await bookingServices.updateAuditById(
    auditBody?.bookingId,
    bookingBody
    );

    if(!updatedBookingResponse){
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Error occurred while updating the booking");
    }

    res.status(httpStatus.CREATED).json(newAudit);
});

const getAuditById = catchAsync(async (req, res) => {
    const auditId = req.params.id;
    const audit = await auditServices.getAuditById(auditId);
    if (!audit) {
        throw new ApiError(httpStatus.NOT_FOUND, "Audit not found");
    }
    res.status(httpStatus.OK).json(audit);
});


const getAllAudits = catchAsync(async (req, res) => {
  const { type } = req.query;

  const audits = type
    ? await auditServices.getAllAuditsByType(type)
    : await auditServices.getAllAudits();

  if (!audits || audits.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, type 
      ? `No audits found for status "${type}"`
      : "No audits found");
  }

console.log("audits",audits)

  res.status(httpStatus.OK).json(audits);
});

const updateAuditById = catchAsync(async (req, res) => {
    const auditId = req.params.id;
    const auditBody = req.body;

    const existingAudit = await auditServices.getAuditById(auditId);
    if (!existingAudit) {
        throw new ApiError(httpStatus.NOT_FOUND, "Audit not found");
    }
    const updatedAudit = await auditServices.updateAuditById(auditId, auditBody);
    if (!updatedAudit) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Failed to update audit");
    }
    res.status(httpStatus.OK).json(updatedAudit);
});
const deleteAuditById = catchAsync(async (req, res) => {
    const auditId = req.params.id;
    const existingAudit = await auditServices.getAuditById(auditId);
    if (!existingAudit) {
        throw new ApiError(httpStatus.NOT_FOUND, "Audit not found");
    }
    await auditServices.deleteAuditById(auditId);
    res.status(httpStatus.OK).json({ message: "Audit deleted successfully" });
});

const getAllAuditsByRoomId = catchAsync(async (req, res) => {
    const roomId = req.params.roomId;
    const audits = await auditServices.getAllAuditsByRoomId(roomId);
    if (!audits || audits.length === 0) {
        throw new ApiError(httpStatus.NOT_FOUND, "No audits found for this room");
    }
    res.status(httpStatus.OK).json(audits);
});


export default {
    createAudit,
    getAuditById,
    getAllAudits,
    updateAuditById,
    deleteAuditById,
    getAllAuditsByRoomId,

};



