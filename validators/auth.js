const { check } = require('express-validator');


exports.userRegisterValidator = [
    check('name')
        .not()
        .isEmpty()
        .withMessage('Name is required'),
    check('email')
        .isEmail()
        .withMessage('Not a valid email'),
    check('password')
        .isLength({min:6})
        .withMessage('Password must be 6 charaters')
    

];



// check('userType')
//         .not()
//         .isEmpty()
//         .withMessage('Type is important')