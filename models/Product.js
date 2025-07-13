import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  productId: {
    type: String,
    required: true,
    unique: true
  },
  condition:{
    type:String,
    required: true,
    enum: ['good', 'fair', 'damaged', 'broken'],
    default:'good'
  },
  category: {
    type: String,
    required: true,
      enum: ['furniture', 'electronics', 'bathroom', 'bedding', 'decoration', 'appliance']
  },
  cost: {
    type: Number,
    required: true
  },
  brokenCost: {
    type: Number,
    required: true
  },
  repairCost: {
    type: Number,
    required: true
  },
  roomTypes: [{
    type: String,
    enum: ['standard', 'deluxe', 'luxury', 'suite']
  }],
  description: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

const Product = mongoose.model('Product', productSchema);
export default Product;




