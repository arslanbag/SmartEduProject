const User = require('../models/User')
const Category = require('../models/Category')
const Course = require('../models/Course')
const bcrypt = require('bcrypt')
const { validationResult } = require('express-validator')

exports.createUser= async (req, res) => {
  try {
    await User.create(req.body)
    res.redirect('/login')
  } catch (error) {
    
    const errors = validationResult(req)
    const flashArray = [];
    for (let index = 0; index < errors.array().length; index++) 
        flashArray.push({msg : errors.array()[index].msg , validate : errors.array()[index].param})
    req.flash('error', flashArray)

    res.status(400).redirect('/register')

  }
};

exports.loginUser= async (req, res) => {
  try {
    const {email, password}  = req.body
    await User.findOne({email:email}, (err, user) => {
      if(user){
        bcrypt.compare(password, user.password, (err, same) => {
          if(same){
            req.session.userID = user.id
            res.status(200).redirect('/users/dashboard')
          }else{
            req.flash('error', {msg : 'Your password is not correct!' , validate : 'password'})
            res.status(400).redirect('/login')
          }
        })
      }else{
        req.flash('error', {msg : 'User is not exist!' , validate : 'email'})
        res.status(400).redirect('/login')
      }
    }).clone()
   } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    })
  }
}

exports.logoutUser= async (req, res) => {
  req.session.destroy(()=>{
    res.redirect('/')
  })
}

exports.getDashboardPage = async (req, res) =>
{
    res.status(200).render('dashboard',{
      categories: await Category.find(),
      courses : await Course.find({createdUser : req.session.userID}).populate("createdUser", "name"),
      users : (user.role == 'admin') ? await User.find() : {},
    })
}

exports.deleteUser = async (req, res) =>
{
    try {
      await User.findByIdAndRemove(req.params.id)
      await Course.deleteMany({user: req.params.id})
      res.status(200).redirect('/users/dashboard')
    } catch (error) {
      res.status(400).json({
        status: 'fail',
        error,
      })
    }
}


