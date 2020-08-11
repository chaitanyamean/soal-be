const express = require('express');
const router = express.Router();

// import validators

// import from controllers
const { addCategory, getCategory } = require('../controllers/category');

router.post('/addCategory', addCategory);
router.get('/getCategory', getCategory);




module.exports = router;
