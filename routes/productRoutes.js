
import { Router } from 'express';
import productController from '../controllers/productController.js';

const router = Router();

router.post('/', productController.createProduct);
router.get('/:id', productController.getProductById);
router.get('/', productController.getAllProducts);
router.put('/:id', productController.updateProductById);
router.delete('/:id', productController.deleteProductById);
router.post('/bulk', productController.createMultipleProducts);



export default router;
