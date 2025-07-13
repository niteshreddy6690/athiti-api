import ProductServices from "../services/productServices.js";
import catchAsync from "../utils/catchAsync.js";
import ApiError from "../utils/ApiError.js";
import httpStatus from "http-status";

const createProduct = catchAsync(async (req, res) => {
    const productBody = req.body;
    const newProduct = await ProductServices.createProduct(productBody);
    if (!newProduct) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Failed to create product");
    }
    res.status(httpStatus.CREATED).json(newProduct);
});

const getProductById = catchAsync(async (req, res) => {
    const productId = req.params.id;
    const product = await ProductServices.getProductById(productId);
    if (!product) {
        throw new ApiError(httpStatus.NOT_FOUND, "Product not found");
    }
    res.status(httpStatus.OK).json(product);
});

const getAllProducts = catchAsync(async (req, res) => {
    const products = await ProductServices.getAllProducts();
    if (!products || products.length === 0) {
        throw new ApiError(httpStatus.NOT_FOUND, "No products found");
    }
    res.status(httpStatus.OK).json(products);
});

const updateProductById = catchAsync(async (req, res) => {
    const productId = req.params.id;
    const productBody = req.body;
    const updatedProduct = await ProductServices.updateProductById(productId, productBody);
    if (!updatedProduct) {
        throw new ApiError(httpStatus.NOT_FOUND, "Product not found");
    }
    res.status(httpStatus.OK).json(updatedProduct);
});

const deleteProductById = catchAsync(async (req, res) => {
    const productId = req.params.id;
    const deletedProduct = await ProductServices.deleteProductById(productId);
    if (!deletedProduct) {
        throw new ApiError(httpStatus.NOT_FOUND, "Product not found");
    }
    res.status(httpStatus.NO_CONTENT).send();
});


const createMultipleProducts = catchAsync(async (req, res) => {
    const productsBody = req.body;
    if (!Array.isArray(productsBody) || productsBody.length === 0) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Invalid product data");
    }
    const newProducts = await ProductServices.createMultipleProducts(productsBody);
    res.status(httpStatus.CREATED).json(newProducts);
}); 


export default {
    createProduct,
    getProductById,
    getAllProducts,
    updateProductById,
    deleteProductById,
    createMultipleProducts
};