import Product from "../models/Product.js";

const createProduct = async (productBody) => {
    return Product.create(productBody);
    }

const getProductById = async (id) => {
    return Product.findById(id);
}

const getAllProducts = async () => {
    return Product.find();
};

const updateProductById = async (productId, productBody) => {
    return Product.findByIdAndUpdate(productId, productBody, { new: true });
}   

const deleteProductById = async (productId) => {
    return Product.findByIdAndDelete(productId);
}

const getAllProductsByCategoryId = async (categoryId) => {
    return Product.find({ categoryId });
}

const createMultipleProducts = async (productsBody) => {
    return Product.insertMany(productsBody);
}   
export default {
    createProduct,
    getProductById,
    getAllProducts,
    updateProductById,
    deleteProductById,
    getAllProductsByCategoryId,
    createMultipleProducts
};