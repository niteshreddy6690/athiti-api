import roomProductServices from "../services/roomProductServices.js";
import catchAsync from "../utils/catchAsync.js";
import ApiError from "../utils/ApiError.js";
import httpStatus from "http-status";

const createRoomProduct = catchAsync(async (req, res) => {
    const roomProductBody = req.body;
    if (!roomProductBody.roomId || !roomProductBody.productId || !roomProductBody.quantity) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Room ID, Product ID and Quantity are required");
    }
    if (roomProductBody.quantity < 1) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Quantity must be at least 1");
    }
    const existingRoomProduct = await roomProductServices.getRoomProductByRoomAndProductId(roomProductBody.roomId, roomProductBody.productId);
    if (existingRoomProduct) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Room product already exists for this room and product");
    }
    const newRoomProduct = await roomProductServices.createRoomProduct(roomProductBody);
    if (!newRoomProduct) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Failed to create room product");
    }
    res.status(httpStatus.CREATED).json(newRoomProduct);
}
);
const getRoomProductById = catchAsync(async (req, res) => {
    const roomProductId = req.params.id;
    const roomProduct = await roomProductServices.getRoomProductById(roomProductId);
    if (!roomProduct) {
        throw new ApiError(httpStatus.NOT_FOUND, "Room product not found");
    }
    res.status(httpStatus.OK).json(roomProduct);
}
);
const getAllRoomProducts = catchAsync(async (req, res) => {
    const roomProducts = await roomProductServices.getAllRoomProducts();
    if (!roomProducts || roomProducts.length === 0) {
        throw new ApiError(httpStatus.NOT_FOUND, "No room products found");
    }
    res.status(httpStatus.OK).json(roomProducts);
}
);
const updateRoomProductById = catchAsync(async (req, res) => {
    const roomProductId = req.params.id;
    const roomProductBody = req.body;
    const updatedRoomProduct = await roomProductServices.updateRoomProductById(roomProductId, roomProductBody);
    if (!updatedRoomProduct) {
        throw new ApiError(httpStatus.NOT_FOUND, "Room product not found");
    }
    res.status(httpStatus.OK).json(updatedRoomProduct);
}
);
const getAllRoomProductsByRoomId = catchAsync(async (req, res) => {
    const roomId = req.params.roomId;
    const roomProducts = await roomProductServices.getAllRoomProductsByRoomId(roomId);
    if (!roomProducts || roomProducts.length === 0) {
        throw new ApiError(httpStatus.NOT_FOUND, "No room products found for this room");
    }
    res.status(httpStatus.OK).json(roomProducts);
}
);
const deleteRoomProductById = catchAsync(async (req, res) => {
    const roomProductId = req.params.id;
    const deletedRoomProduct = await roomProductServices.deleteRoomProductById(roomProductId);
    if (!deletedRoomProduct) {
        throw new ApiError(httpStatus.NOT_FOUND, "Room product not found");
    }
    res.status(httpStatus.NO_CONTENT).send();
}
);  

export default {
    createRoomProduct,
    getRoomProductById,
    getAllRoomProducts,
    updateRoomProductById,
    deleteRoomProductById,
    getAllRoomProductsByRoomId
};