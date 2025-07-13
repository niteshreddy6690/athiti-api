import mongoose from 'mongoose';
const roomProductSchema = new mongoose.Schema({
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    default: 1
  },
  conditionBefore: {
    type: String,
    enum: ['good', 'fair', 'damaged', 'broken'],
    default: 'good'
  },

  conditionAfter: {
    type: String,
    enum: ['good', 'fair', 'damaged', 'broken'],
    default: 'good'
  },
  notes: {
    type: String,
    default: ''
  },
    lastAuditDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});
const RoomProduct = mongoose.model('RoomProduct', roomProductSchema);
export default RoomProduct;