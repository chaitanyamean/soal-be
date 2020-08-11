const AWS = require('aws-sdk');
const User = require('../models/user');
const bcryptjs = require("bcryptjs");
const expressJwt = require('express-jwt');

const jwt = require('jsonwebtoken');

const shortId = require('shortid');
const response = require('../libs/responseLibs');

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

const ses = new AWS.SES({
    apiVersion: '2010-12-01'
});

exports.register = async (req, res) => {
    let {
        name,
        email,
        password,
        role
    } = req.body;

    const hashed_password = await bcryptjs.hash(password, 10)

    try {
        const registrationDetails = await User.findOne({
            email: email
        })


        if (registrationDetails) {
            let apiResponse = response.generate(true, 'User already exists', 400, null);
            return res.send(apiResponse);
        }
        const username = shortId.generate();

        // register new user
        const newUser = new User({ username,name, email, password: hashed_password, role });
        newUser.save((err, result) => {

            if (err) {
                let apiResponse = response.generate(true, 'Error saving user in database. Try later', 402, null);
                return res.send(apiResponse);
            }

            let apiResponse = response.generate(false, 'Registration success. Please login.', 200, null);
            return res.send(apiResponse);
        });

    }
    catch { }

    // })
};


exports.login = async (req, res) => {
    // Generate Token
    const { email, password } = req.body;

    try {

        const userDetails = await User.findOne({
            email
        })


        if (!userDetails) {
            let apiResponse = response.generate(true, 'Login unsuccesful', 400, null);
            return res.send(apiResponse);
        }

        if (userDetails) {
            try {
                let comparePassowrd = await bcryptjs.compare(password, userDetails.password)

                if (!comparePassowrd) {
                    let apiResponse = response.generate(true, 'Password is wrong', 400, null);
                    return res.send(apiResponse);
                }

                const token = await jwt.sign({ email, password },
                    process.env.JWT_SECRET);

                if(token) {
                    // return res.send({token})
                    let resData = {
                        token,
                        userDetails
                    }
                    let apiResponse = response.generate(true, 'Login succes', 200, resData);
                    return res.send(apiResponse);
                }


            }
            catch(err) {
                    console.log('err', err)
            }


        }
    } catch (err) {
        console.log('catch', err)
    }
}


exports.requireSignin = expressJwt({ secret: process.env.JWT_SECRET }); // req.user


exports.authMiddleware = (req, res, next) => {
    const authUserId = req.params.id;

    User.findOne({ username: authUserId }).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'User not found'
            });
        }
        req.profile = user;
        next();
    });
};


exports.sellerMiddleware = (req, res, next) => {
    const sellerUserId = req.params.id;
    User.findOne({ username: sellerUserId }).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'User not found'
            });
        }
        if (user.role !== 'seller') {
            return res.status(400).json({
                error: 'Seller resource. Access denied'
            });
        }

        req.profile = user;
        next();
    });
};