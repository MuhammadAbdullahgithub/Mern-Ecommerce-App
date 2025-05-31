import express from 'express';
import { requireSignIn, isAdmin } from '../middlewares/authMiddleware.js'
import {
    braintreePaymentController,
    braintreeTokenController,
    createProductController,
    deleteProductController,
    getProductController,
    productCategoryController,
    productCountController,
    productFiltersController,
    productListController,
    productPhotoController,
    relatedProductController,
    searchProductController,
    singleProductController,
    updateProductController,
}
    from '../controllers/productController.js';
import formidable from 'express-formidable';

const router = express.Router();

//create product
router.post('/create-product', requireSignIn, isAdmin, formidable(), createProductController)

//update product
router.put('/update-product/:pid', requireSignIn, isAdmin, formidable(), updateProductController)

//get all product 
router.get('/get-product', getProductController)

//Single Product 
router.get('/single-product/:slug', singleProductController)


//get photo
router.get('/product-photo/:pid', productPhotoController)

//delete product
router.delete('/delete-product/:pid', deleteProductController)

//Filter product
router.post('/product-filters', productFiltersController)

//product count 
router.get('/product-count', productCountController)

//product per page
router.get('/product-list/:page', productListController)

//search product
router.get('/search/:keyword', searchProductController)

//similar product
router.get('/related-product/:pid/:cid', relatedProductController)

//Category wise product
router.get('/product-category/:slug', productCategoryController)

//Payment Getway 
// token
router.get('/braintree/token', braintreeTokenController)

//payments
router.post('/braintree/payment', requireSignIn, braintreePaymentController)


export default router;