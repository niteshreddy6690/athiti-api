import mongoose from 'mongoose';    


const guestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
numberOfPeople: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

const Guest = mongoose.model('Guest', guestSchema);
export default Guest;