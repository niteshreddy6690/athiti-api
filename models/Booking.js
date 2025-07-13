import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  guestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Guest',
    required: true
  },
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },
  checkInTime: { type: Date, required: true },
  checkOutTime: { type: Date, default: null },
  status: { 
    type: String, 
    enum: ['confirmed', 'checked-in', 'checked-out', 'cancelled'], 
    default: 'confirmed' 
  },
  auditStatus: {
    checkIn: {
      required: { type: Boolean, default: true },
      completed: { type: Boolean, default: false },
      auditId: { type: mongoose.Schema.Types.ObjectId, ref: 'Audit' },
      completedAt: { type: Date },
      completedBy: { type: String }
    },
    checkOut: {
      required: { type: Boolean, default: true },
      completed: { type: Boolean, default: false },
      auditId: { type: mongoose.Schema.Types.ObjectId, ref: 'Audit' },
      completedAt: { type: Date },
      completedBy: { type: String }
    }
  },
  duration: { type: Number, default: 0 }, 
  totalCharges: { type: Number, default: 0 }
}, { timestamps: true });

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking