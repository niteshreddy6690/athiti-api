import mongoose from 'mongoose';
const auditItemSchema = new mongoose.Schema({
 roomProductId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RoomProduct',
    required: true
  },
  conditionBefore: {
    type: String,
    enum: ['good', 'fair', 'damaged', 'broken'],
    default: 'good'
  },
  conditionAfter: {
    type: String,
    enum: ['good', 'fair', 'damaged', 'broken'],
  },
  quantity: {
    type: Number,
    default: 1
  },
  notes: {
    type: String,
    default: ''
  },
  chargeAmount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true  
});

const AuditItem = mongoose.model('AuditItem', auditItemSchema);
export default AuditItem;

