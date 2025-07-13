
import Guest from "../models/Guest.js";

const createGuest = async (guestBody) => {
  return Guest.create(guestBody);
}
const getGuestById = async (id) => {
  return Guest.findById(id)
};

const getAllGuests = async () => {
  return Guest.find()
};  
const updateGuestById = async (guestId, guestBody) => {
  return Guest.findByIdAndUpdate(guestId, guestBody, { new: true })
};
const deleteGuestById = async (guestId) => {
  return Guest.findByIdAndDelete(guestId);
};

const checkInGuest = async (guestId) => {
  const guest = await getGuestById(guestId);
  if (!guest) {
    throw new ApiError(404, "Guest not found");
  }
  guest.status = 'checked-in';
  guest.checkInTime = new Date();
  await guest.save();
  return guest;
}

const checkOutGuest = async (guestId) => {
  const guest = await getGuestById(guestId);
  if (!guest) {
    throw new ApiError(404, "Guest not found");
  }
  guest.status = 'checked-out';
  guest.checkOutTime = new Date();
  const duration = Math.floor((guest.checkOutTime - guest.checkInTime) / (1000 * 60 * 60)); // Duration in hours
  guest.duration = duration;
  await guest.save();
  return guest;
}


export default  {
  createGuest,
  getGuestById,
  getAllGuests,
  updateGuestById,
  deleteGuestById,
  checkInGuest,
  checkOutGuest
};

