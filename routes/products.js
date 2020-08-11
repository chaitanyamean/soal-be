const express = require('express');
const router = express.Router();

// import validators
const { userRegisterValidator, re } = require('../validators/auth');
const { runValidation } = require('../validators'); 

const { requireSignin, sellerMiddleware } = require('../controllers/auth');

// import from controllers
const { addProduct, getAllProducts, getSellerProducts, getProductsByCategoryId, getSearchTerm } = require('../controllers/products');

// router.post('/products', userRegisterValidator, runValidation, register);
// router.post('/login',  login);

router.post('/seller/addProduct', addProduct);
router.get('/getAllProducts', getAllProducts);
router.get('/getProductsByCategoryId/:id', getProductsByCategoryId);
router.get('/search/:searchterm', getSearchTerm);

// router.post('/editProduct', addProduct);
// router.post('/removeProduct', addProduct);
// router.post('/allProducts', addProduct);

// Get seller uploaded products  
router.get('/seller/getProducts/:id', requireSignin, sellerMiddleware, getSellerProducts)

module.exports = router;
