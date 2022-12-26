const { body } = require('express-validator')
const User = require('../models/User')

module.exports = [
    body('name').not().isEmpty().withMessage('Please Enter Your Name'),
    body('email').isEmail().withMessage('Please Enter Valid Email').custom((userEmail) => {
        return User.findOne({email:userEmail}).then(user => {
            if(user)
                return Promise.reject('Email is already exists !')
        })
    }),
    body('password').not().isEmpty().withMessage('Please Enter A Password')
]



