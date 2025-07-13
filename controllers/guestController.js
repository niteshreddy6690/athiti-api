
// import Guest from "../models/Guest.js";
import catchAsync from "../utils/catchAsync.js";
import ApiError from "../utils/ApiError.js";
import GuestServices from "../services/guestServices.js";
import httpStatus  from "http-status"
import Room from "../models/Room.js";
import Guest from "../models/Guest.js";
import Audit from "../models/Audit.js";
import roomServices from "../services/roomServices.js";

const createGuest = catchAsync(async (req, res) => {
    const guestBody = req.body;
    console.log("Guest Body:", guestBody);
    
    // Basic validation
    if (!guestBody.name || !guestBody.email || !guestBody.phone || !guestBody.numberOfPeople) {
        throw new ApiError(400, "Name, email, phone, rooms and numberOfPeople are required");
    }

    // // Get all selected rooms and their capacities
    // const rooms = await Room.find({ _id: { $in: guestBody.rooms } });
    
    // // Check if all rooms exist
    // if (rooms.length !== guestBody.rooms.length) {
    //     throw new ApiError(400, "One or more rooms not found");
    // }

    // // Calculate total capacity
    // const totalCapacity = rooms.reduce((sum, room) => sum + room.capacity, 0);
    
    // // Validate capacity
    // if (totalCapacity < guestBody.numberOfPeople) {
    //     throw new ApiError(400, `Total room capacity (${totalCapacity}) is less than number of people (${guestBody.numberOfPeople})`);
    // }

    // // Check if all rooms are available (optional)
    // const unavailableRooms = rooms.filter(room => room.status !== 'available');
    // if (unavailableRooms.length > 0) {
    //     throw new ApiError(400, `Some rooms are not available: ${unavailableRooms.map(r => r.roomNumber).join(', ')}`);
    // }

    const newGuest = await GuestServices.createGuest(guestBody);
    console.log("newGuest",newGuest)
    if (!newGuest) {
        throw new ApiError(400, "Failed to create guest");
    }

    

    // await Room.updateMany(
    //     { _id: { $in: guestBody.rooms } },
    //     { $set: { status: 'occupied' } }
    // );

    res.status(httpStatus.CREATED).json(newGuest);
});


const getGuestById = catchAsync(async (req, res) => {
    const guestId = req.params.id;
    const guest = await GuestServices.getGuestById(guestId);
    if (!guest) {
        throw new ApiError(httpStatus.NOT_FOUND, "Guest not found");
    }
    res.status(200).json(guest);
});

const getAllGuests = catchAsync(async (req,res) => {
    const guests = await GuestServices.getAllGuests();
    if (!guests || guests.length === 0) {
        throw new ApiError(httpStatus.NOT_FOUND, "No guests found");
    }
    // Populate rooms for each guest
    for (let guest of guests) {
        guest.rooms = await Room.find({ _id: { $in: guest.rooms } });
    }
    // Return the guests with populated rooms
    if (!guests || guests.length === 0) {
        throw new ApiError(httpStatus.NOT_FOUND, "No guests found");
    }
    // Return the guests with populated rooms   
    res.status(200).json(guests );
});
const updateGuestById = catchAsync(async (req, res) => {
    const guestId = req.params.id;
    const guestBody = req.body;
    if (!guestBody.name || !guestBody.email || !guestBody.phone || !guestBody.roomNumber || !guestBody.room) {
        throw new ApiError(400, "Name, email, phone, room are required");
    }
    const existingGuest = await GuestServices.getGuestById(guestId);
    if (!existingGuest) {
        throw new ApiError(404, "Guest not found");
    }
 
    const updatedGuest = await GuestServices.updateGuestById(guestId, guestBody);
    if (!updatedGuest) {
        throw new ApiError(404, "Guest not found");
    }
    res.status(200).json(updatedGuest);
});
const deleteGuestById = catchAsync(async (req, res) => {
    const guestId = req.params.id;
    const deletedGuest = await GuestServices.deleteGuestById(guestId);
    if (!deletedGuest) {
        throw new ApiError(404, "Guest not found");
    }
    res.status(200).json({ message: "Guest deleted successfully" });
}); 


const checkInGuest = catchAsync(async (req, res) => {
    const guestId = req.params.id;
    const checkedInGuest = await GuestServices.checkInGuest(guestId);
    if (!checkedInGuest) {
        throw new ApiError(404, "Guest not found");
    }
    res.status(200).json(checkedInGuest);
}); 

const checkOutGuest = catchAsync(async (req, res) => {
  const guestId = req.params.id;
  const checkoutBody = req.body;

  const checkedOutGuest = await GuestServices.checkOutGuest(guestId);
  if (!checkedOutGuest) {
    throw new ApiError(404, "Guest not found");
  }

  const updateRoom = await roomServices.updateRoomById(checkoutBody?.roomId, {
    status: "available"
  });

  if (!updateRoom) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to update room status");
  }

    // const updatedBookingResponse = await bookingServices.updateAuditById(
    // auditBody?.bookingId,
    // bookingBody
    // );

    // if(!updatedBookingResponse){
    //     throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Error occurred while updating the booking");
    // }


    // if(auditBody?.auditType === "maintenance"){
    //     const updatedRoom = await roomServices.updateRoomById(auditBody.roomId, {status:"maintenance"});
    //     if (!updatedRoom) {
    //         throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Error occurred while updating the room");
    //     }
    // }

    // if(auditBody.auditType==="check-out"){
    //     const updatedRoom = await roomServices.updateRoomById(auditBody.roomId, {status:"available",currentGuestId:null});
    //     if (!updatedRoom) {
    //         throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Error occurred while updating the room");
    //     }
    // }


  res.status(200).json(checkedOutGuest);
});



export const getGuestsRoomsAuditStatus = async (req, res) => {
  try {
   
    const guests = await Guest.find()
     


    const audits = await Audit.find().lean();


    const response = {};

    guests.forEach(guest => {
      
      const guestAudits = audits.filter(audit => 
        audit.guestId.toString() === guest._id.toString()
      );

  
      response[guest._id] = {
        guestDetails: {
          id: guest._id,
          name: guest.name,
          email: guest.email,
          phone: guest.phone,
          numberOfPeople: guest.numberOfPeople,
          checkInTime: guest.checkInTime,
          checkOutTime: guest.checkOutTime,
          status: guest.status,
          duration: guest.duration
        },
        rooms: {}
      };

      // Process each room for this guest
      guest.rooms.forEach(room => {
        // Find audits for this specific room
        const roomAudits = guestAudits.filter(audit => 
          audit.roomId.toString() === room._id.toString()
        );

        // Check if audit is done (has completed audit)
        const auditDone = roomAudits.some(audit => audit.status === 'completed');

        response[guest._id].rooms[room._id] = {
          roomDetails: {
            id: room._id,
            roomNumber: room.roomNumber,
            roomType: room.roomType,
            price: room.price,
            capacity: room.capacity,
            amenities: room.amenities
          },
          auditStatus: {
            auditDone: auditDone,
            totalAudits: roomAudits.length,
            pendingAudits: roomAudits.filter(audit => audit.status === 'pending').length,
            completedAudits: roomAudits.filter(audit => audit.status === 'completed').length,
            lastAuditDate: roomAudits.length > 0 
              ? roomAudits.sort((a, b) => new Date(b.auditDate) - new Date(a.auditDate))[0].auditDate
              : null
          }
        };
      });
    });

    res.status(200).json({
      success: true,
      totalGuests: Object.keys(response).length,
      data: response
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching guest room audit status',
      error: error.message
    });
  }
};



export default {
    createGuest,
    getGuestById,
    getAllGuests,       
    updateGuestById,
    deleteGuestById,
    checkInGuest,
    checkOutGuest,getGuestsRoomsAuditStatus
};


