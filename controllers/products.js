const AWS = require('aws-sdk');
const Product = require('../models/products');
const bcryptjs = require("bcryptjs");
const mongoose = require("mongoose");

const jwt = require('jsonwebtoken');
// const ProductsModel = mongoose.model("Products");

const shortId = require('shortid');
const response = require('../libs/responseLibs');

const formidable = require('formidable');
// const uuidv4 = require('uuid')
const slugify = require('slugify')
const fs = require('fs');


/**
 *
 * AWS S3 configuration
 */
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
  });
  

exports.addProduct = async (req,res) => {

    let form = new formidable.IncomingForm()
    form.parse(req, (err,fields,files) => {
        if(err) {
            return res.status(400).json({
                error: 'Image could not upload'
            })
        }

        console.table({err,fields,files})
        // const {}
        const productId = shortId.generate();
        const {productName, productDesc, categoryId, price} = fields;
        const {image} = files;

    let newProduct = new Product({productId, productName, productDesc,categoryId, price})
        if(image.size > 2000000) {
            return res.status(400).json({
                error: 'Image should be less tham 2MB'
            })
        }
        const params = {
            Bucket: 'commimage',
            Key: `products/${shortId.generate()}`,
            Body: fs.readFileSync(image.path),
            ACL: 'public-read',
            ContentType: `image/jpg`
        }

        s3.upload(params, (err,data) => {
            if(err) res.status(400).json({error: 'Upload to s3 failed'})
            
                    newProduct.image.url = data.Location;
                    newProduct.image.key = data.Key;
                    newProduct.save((err, result) => {
                        if (err) {
                            let apiResponse = response.generate(true, 'Error in saving product. Try later', 402, null);
                            return res.send(apiResponse);
                        }
                        let apiResponse = response.generate(false, 'Product Added successfully.', 200, null);
                        return res.send(apiResponse); 
                    })
                })
    })

}

exports.getAllProducts = async (req,res) => {

    let productsRes = await Product.find({});
    let apiResponse = response.generate(false, 'Product details', 200, productsRes);
    return res.send(productsRes);
}

exports.getProductsByCategoryId = async (req,res) => {
        const categoryId = req.params.id
        let productsList
        if(categoryId === 'All') {
             productsList = await Product.find({});

        } else {
             productsList = await Product.find({categoryId});
        }
    let apiResponse = response.generate(false, 'Product details', 200, productsList);
    return res.send(apiResponse);
}

// Get seller related products 
exports.getSellerProducts = async(req,res) => {
            const sellerId = req.params.id
    try{
        let sellerProducts = await Product.find({sellerId: sellerId})
        let apiResponse = response.generate(false, 'Product details', 200, sellerProducts);
        return res.send(apiResponse);
    }

    catch{}
}

exports.getSearchTerm = async (req,res) => {
    const searchTer = req.params.searchterm

    try{
            let searchTerm = await Product.findOne({productName:{$regex: `.*${searchTer}.*`}})

           
            let apiResponse = response.generate(false, 'Product details', 200, searchTerm);
            return res.send(apiResponse);
    }
    catch{}
}