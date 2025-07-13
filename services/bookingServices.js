import Booking from "../models/Booking.js";


const createBooking = async (bookingBody) => {
  return Booking.create(bookingBody);
}
const getAllBookings=async ()=>{
    return Booking.find().populate(['guestId',"roomId"])
}


const updateAuditById=async (bookingId,updatedBody)=>{
  return Booking.findByIdAndUpdate(bookingId, { $set: updatedBody },
    { new: true })
}

export default {
    createBooking,
    getAllBookings,
    updateAuditById
}

