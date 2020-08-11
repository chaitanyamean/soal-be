const Category = require('../models/category');
const shortId = require('shortid')



const response = require('../libs/responseLibs');


exports.addCategory = async (req,res) => {

    const {categoryName} = req.body

    const categoryId = shortId.generate()

    const newCateogry = new Category({categoryId, categoryName})

    newCateogry.save((err,result) => {
        if(err){

            let apiResponse = response.generate(true, 'Error in saving category. Try later', 402, null);
            return res.send(apiResponse);
        }
        let apiResponse = response.generate(false, 'Category Added successfully.', 200, {result});
        return res.send(apiResponse);
    })
}

exports.getCategory = async (req,res) => {
    const categories = await Category.find({})
    
        let catResponse = response.generate(false, 'Category details.', 200, {categories});
         return res.send(catResponse);
}

