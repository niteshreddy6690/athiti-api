import Room from "../models/Room.js";

const createRoom = async (roomBody) => {
      console.log("Room Body:", roomBody);
     return Room.create(roomBody);
}

const getRoomById = async (id) => {
    const roomId = id
    return  Room.findById(roomId)
       
  
}; 

const getAllRooms = async () => {
    return Room.find()
}
const updateRoomById = async (roomId,roomBody) => {
return  Room.findByIdAndUpdate(roomId, roomBody, { new: true })
    

}

const deleteRoomById = async (roomId) => {
      return Room.findByIdAndDelete(roomId);
}

const getAvailableRooms = async () => {
    return Room.find({ status: 'available' })
}

const getAllRoomsByStatus = async (status) => {
    if (!status) {
        throw new Error("Status is required to filter rooms");
    }
    return Room.find({ status: status });
}

export default {
    createRoom,
    getRoomById,
    getAllRooms,
    updateRoomById,
    deleteRoomById,
    getAvailableRooms,
    getAllRoomsByStatus
};