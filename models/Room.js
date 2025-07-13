import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  roomNumber: {
    type: String,
    required: true,
    unique: true
  },
  roomType: {
    type: String,
    required: true,
    enum: ['standard', 'deluxe', 'luxury', 'suite']
  },
  status: {
    type: String,
    enum: ['available', 'occupied', 'maintenance', 'cleaning'],
    default: 'available'
  },
  capacity: {
    type: Number,
    required: true,
    min: 1
  },
   currentGuestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Guest',
    default: null
  }
}, {
  timestamps: true
});

const Room = mongoose.model('Room', roomSchema);
export default Room;