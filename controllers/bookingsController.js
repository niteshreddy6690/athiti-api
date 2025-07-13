import httpStatus from "http-status";
import catchAsync from "../utils/catchAsync.js";
import ApiError from "../utils/ApiError.js";
import bookingServices from "../services/bookingServices.js";
import Room from "../models/Room.js";
import RoomServices from "../services/roomServices.js";


const createBooking = catchAsync(async (req, res) => {
    const bookingBody = req.body;
    console.log("bookingBody",bookingBody)
    // Basic validation
    if (!bookingBody.guestId || !bookingBody.roomId || !bookingBody.checkInTime) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Guest ID, Room ID, and Check-In Time are required");
    }
    
      const existingRoom = await RoomServices.getRoomById(bookingBody.roomId);
    if (!existingRoom) {
        throw new ApiError(404, "Room not found");
    }   


    // More advanced validation can be added here, e.g., checking room availability
    const room = await Room.findById(bookingBody.roomId);
    if (!room || room.status !== 'available') {
        throw new ApiError(httpStatus.BAD_REQUEST, "Room is not available for booking");
    }

    const newBooking = await bookingServices.createBooking(bookingBody);

    if (!newBooking) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to create booking");
    }

    if(bookingBody.status==="checked-in"){
 const updatedRoom = await RoomServices.updateRoomById(bookingBody.roomId, {status:"occupied"});
        if (!updatedRoom) {
            throw new ApiError(400, "Failed to update room");
        }

    if(!updatedRoom){
         throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to update room to occupied");
    }
    }
    
    res.status(httpStatus.CREATED).json(newBooking);
});

const getAllBookings = catchAsync(async (req, res) => {
    const bookings = await bookingServices.getAllBookings();

    if (!bookings || bookings.length === 0) {
        throw new ApiError(httpStatus.NOT_FOUND, "No bookings found");
    }

    res.status(httpStatus.OK).json(bookings);
});

const getBookingById = catchAsync(async (req, res) => {
    const bookingId = req.params.id;
    const booking = await bookingServices.getBookingById(bookingId);
    if (!booking) {
        throw new ApiError(httpStatus.NOT_FOUND, "Booking not found");
    }
    res.status(httpStatus.OK).json(booking);
});

const updateBookingById = catchAsync(async (req, res) => {
    const bookingId = req.params.id;
    const bookingBody = req.body;
    const updatedBooking = await bookingServices.updateBookingById(bookingId, bookingBody);
    if (!updatedBooking) {
        throw new ApiError(httpStatus.NOT_FOUND, "Booking not found or failed to update");
    }
    res.status(httpStatus.OK).json(updatedBooking);
});

const deleteBookingById = catchAsync(async (req, res) => {
    const bookingId = req.params.id;
    const deletedBooking = await bookingServices.deleteBookingById(bookingId);
    if (!deletedBooking) {
        throw new ApiError(httpStatus.NOT_FOUND, "Booking not found");
    }
    res.status(httpStatus.OK).json({ message: "Booking deleted successfully" });
});

export default {
    createBooking,
    getAllBookings,
    getBookingById,
    updateBookingById,
    deleteBookingById,
};