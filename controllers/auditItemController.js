import catchAsync from "../utils/catchAsync.js";
import ApiError from "../utils/ApiError.js";
import httpStatus from "http-status";
import auditItemServices from "../services/auditItemServices.js";
import productServices from "../services/productServices.js";
import roomProductServices from "../services/roomProductServices.js";

const createAuditItem = catchAsync(async (req, res) => {
    const auditItemBody = req.body;
    const newAuditItem = await auditItemServices.createAuditItem(auditItemBody);
    if (!newAuditItem) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Failed to create audit item");
    }


    // const roomProductId= await roomProductServices.getRoomProductById(auditItemBody?.roomProductId)

    // console.log("roomProductId",roomProductId)

    // const updatedProduct= await productServices.updateProductById(roomProductId?.productId,)

    res.status(httpStatus.CREATED).json(newAuditItem);
});


const getAuditItemById = catchAsync(async (req, res) => {
    const auditItemId = req.params.id;
    const auditItem = await auditItemServices.getAuditItemById(auditItemId);
    if (!auditItem) {
        throw new ApiError(httpStatus.NOT_FOUND, "Audit item not found");
    }
    res.status(httpStatus.OK).json(auditItem);
});



const getAllAuditItems = catchAsync(async (req, res) => {
    const auditItems = await auditItemServices.getAllAuditItems();
    if (!auditItems || auditItems.length === 0) {
        throw new ApiError(httpStatus.NOT_FOUND, "No audit items found");
    }
    res.status(httpStatus.OK).json(auditItems);
});

const updateAuditItemById = catchAsync(async (req, res) => {
    const auditItemId = req.params.id;
    const auditItemBody = req.body;
    const updatedAuditItem = await auditItemServices.updateAuditItemById(auditItemId, auditItemBody);
    if (!updatedAuditItem) {
        throw new ApiError(httpStatus.NOT_FOUND, "Audit item not found");
    }
    res.status(httpStatus.OK).json(updatedAuditItem);
});

const deleteAuditItemById = catchAsync(async (req, res) => {
    const auditItemId = req.params.id;
    const deletedAuditItem = await auditItemServices.deleteAuditItemById(auditItemId);
    if (!deletedAuditItem) {
        throw new ApiError(httpStatus.NOT_FOUND, "Audit item not found");
    }
    res.status(httpStatus.OK).json({ message: "Audit item deleted successfully" });
}); 


const getAllAuditItemsByAuditId = catchAsync(async (req, res) => {
    const auditId = req.params.auditId;
    const auditItems = await auditItemServices.getAllAuditItemsByAuditId(auditId);
    if (!auditItems || auditItems.length === 0) {
        throw new ApiError(httpStatus.NOT_FOUND, "No audit items found for this audit");
    }
    res.status(httpStatus.OK).json(auditItems);
});


const createAuditForMultipleItems = catchAsync(async (req, res) => {
    const { items } = req.body;
    if (!items || !Array.isArray(items)) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Invalid request data");
    }   

    // Validate each item in the array
    for (const item of items) {
        if (!item.productId || !item.conditionBefore || !item.conditionAfter) {
            throw new ApiError(httpStatus.BAD_REQUEST, "Each item must have productId, conditionBefore and conditionAfter");
        }
        
        if (["damaged", "broken"].includes(item.conditionAfter) && !item.chargeAmount) {
            const product = await productServices.getProductById(item.productId);
            console.log("Product:", product);
            
            if (!product) {
                throw new ApiError(httpStatus.NOT_FOUND, `Product with ID ${item.productId} not found`);
            }

            if (item.conditionAfter === "damaged") {
                console.log("Repair cost:", product.repairCost);
                item.chargeAmount = product.repairCost || 0; 
            }
            if (item.conditionAfter === "broken") {
                item.chargeAmount = product.brokenCharge || 0; 
            }        
        }
    }

    console.log("Items to be audited:", items);

    const auditItems = await Promise.all(items.map(item => auditItemServices.createAuditItem(item)));

    if (!auditItems || auditItems.length === 0) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Failed to create audit items");
    }
    
    res.status(httpStatus.CREATED).json(auditItems);
});


export default {
    createAuditItem,
    getAuditItemById,
    getAllAuditItems,
    updateAuditItemById,
    deleteAuditItemById,
    getAllAuditItemsByAuditId,
    createAuditForMultipleItems
};
