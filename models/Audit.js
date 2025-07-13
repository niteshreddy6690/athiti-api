import mongoose from 'mongoose';

const auditSchema = new mongoose.Schema({
  bookingId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },
  guestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Guest',
    required: true
  },
  auditType: {
    type: String,
    enum: ['check-in', 'check-out', 'maintenance'],
    required: true
  },
  auditDate: {
    type: Date,
    default: Date.now
  },
  auditedBy: {
    type: String,
    default: 'System' 
  },
  items: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AuditItem',
      required: true
    }
  ],
  totalCharges: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'disputed'],
    default: 'pending'
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

const Audit = mongoose.model('Audit', auditSchema);
export default Audit;