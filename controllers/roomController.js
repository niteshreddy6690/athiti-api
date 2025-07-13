
import catchAsync from "../utils/catchAsync.js";
import ApiError from "../utils/ApiError.js";
import RoomServices from "../services/roomServices.js";


const createRoom = catchAsync(async (req, res) => {
    const roomBody = req.body;
    if (!roomBody.roomNumber || !roomBody.roomType || !roomBody.status || !roomBody.capacity) {
        throw new ApiError(400, "Room number, type, capacity and status are required");
    }
    if(!['standard', 'deluxe', 'luxury', 'suite'].includes(roomBody.roomType)) {
        throw new ApiError(400, "Invalid room type");
    }
    if(!['available', 'occupied', 'maintenance', 'cleaning'].includes(roomBody.status)) {
        throw new ApiError(400, "Invalid room status");
    }   
    if (roomBody.capacity < 1) {
        throw new ApiError(400, "Room capacity must be at least 1");
    }
    const newRoom = await RoomServices.createRoom(roomBody);
    res.status(201).json(newRoom);
});

const getRoomById = catchAsync(async (req, res) => {
    const roomId = req.params.id;
    const room = await RoomServices.getRoomById(roomId);
    if (!room) {
        throw new ApiError(404, "Room not found");
    }
    res.status(200).json(room);
}); 
const getAllRooms = catchAsync(async (req, res) => {
    const rooms = await RoomServices.getAllRooms();
    if (!rooms || rooms.length === 0) {
        throw new ApiError(404, "No rooms found");
    }
    res.status(200).json(rooms);
}); 
const updateRoomById = catchAsync(async (req, res) => {
    const roomId = req.params.id;
    const roomBody = req.body;

    const existingRoom = await RoomServices.getRoomById(roomId);
    if (!existingRoom) {
        throw new ApiError(404, "Room not found");
    }   
    const updatedRoom = await RoomServices.updateRoomById(roomId, roomBody);
    if (!updatedRoom) {
        throw new ApiError(400, "Failed to update room");
    }
    res.status(200).json(updatedRoom);
});     

const deleteRoomById = catchAsync(async (req, res) => {
    const roomId = req.params.id;
    const existingRoom = await RoomServices.getRoomById(roomId);
    if (!existingRoom) {
        throw new ApiError(404, "Room not found");
    }
    const deletedRoom = await RoomServices.deleteRoomById(roomId);
    if (!deletedRoom) {
        throw new ApiError(400, "Failed to delete room");
    }
    res.status(200).json({ message: "Room deleted successfully" });
}); 

const getAvailableRooms = catchAsync(async (req, res) => {
    const availableRooms = await RoomServices.getAvailableRooms();
    if (!availableRooms || availableRooms.length === 0) {
        throw new ApiError(404, "No available rooms found");
    }
    res.status(200).json(availableRooms);
});


const getAllRoomsByStatus = catchAsync(async (req, res) => {
    const status = req.query.status;
    if (!status) {
        throw new ApiError(400, "Status query parameter is required");
    }
    const rooms = await RoomServices.getAllRoomsByStatus(status);
    if (!rooms || rooms.length === 0) {
        throw new ApiError(404, `No rooms found with status ${status}`);
    }
    res.status(200).json(rooms);
});

export  default {
    createRoom,
    getRoomById,
    getAllRooms,
    updateRoomById,
    deleteRoomById,
    getAvailableRooms,
    getAllRoomsByStatus

}


