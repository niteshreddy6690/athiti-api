import RoomProduct from "../models/RoomProduct.js";
const createRoomProduct = async (roomProductBody) => {
    return RoomProduct.create(roomProductBody);
}

const getRoomProductById = async (id) => {
    return RoomProduct.findById(id).populate("productId");
}  
 
const getAllRoomProducts = async () => {
    return RoomProduct.find().populate("productId")
};

const updateRoomProductById = async (roomProductId, roomProductBody) => {
    return RoomProduct.findByIdAndUpdate(roomProductId, roomProductBody, { new: true })
}   

const deleteRoomProductById = async (roomProductId) => {
    return RoomProduct.findByIdAndDelete(roomProductId);
}
const getAllRoomProductsByRoomId = async (roomId) => {
    return RoomProduct.find({ roomId }).populate(['productId','roomId'])
}
const getRoomProductByRoomAndProductId = async (roomId, productId) => {
    return RoomProduct.findOne({ room: roomId, product: productId })
}   

export default {
    createRoomProduct,
    getRoomProductById,
    getAllRoomProducts,
    updateRoomProductById,
    deleteRoomProductById,
    getAllRoomProductsByRoomId,
    getRoomProductByRoomAndProductId
};