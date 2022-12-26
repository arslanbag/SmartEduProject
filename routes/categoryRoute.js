const express = require('express')
const categoryControllers = require('../controllers/categoryControllers')
const router = express.Router()

router.route('/').post(categoryControllers.createCategory)
router.route('/:id').delete(categoryControllers.deleteCategory)

module.exports = router