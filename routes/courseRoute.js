const express = require('express')
const courseControllers = require('../controllers/courseControllers')
const roleMiddleware = require('../middlewares/roleMiddleware')
const router = express.Router()

router.route('/').post(roleMiddleware(["teacher", "admin"]),courseControllers.createCourse)
router.route('/').get(courseControllers.getAllCourse)
router.route('/:slug').get(courseControllers.getCourse)
router.route('/:slug').delete(courseControllers.deleteCourse)
router.route('/:slug').put(courseControllers.updateCourse)
router.route('/enroll').post(courseControllers.enrollCourse)
router.route('/relase').post(courseControllers.relaseCourse)

module.exports = router