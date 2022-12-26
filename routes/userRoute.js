const express = require('express')
const authControllers = require('../controllers/authController')
const authMiddleware = require('../middlewares/authMiddleware')
const registerValidations = require('../validate/registerValidations')
const router = express.Router()

router.route('/signup').post(registerValidations,authControllers.createUser)
router.route('/login').post(authControllers.loginUser)
router.route('/logout').get(authControllers.logoutUser)
router.route('/dashboard').get(authMiddleware, authControllers.getDashboardPage)
router.route('/:id').delete(authControllers.deleteUser)

module.exports = router