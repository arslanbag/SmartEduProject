const Course = require('../models/Course')
const Category = require('../models/Category')
const User = require('../models/User')

exports.createCourse = async (req, res) => {
  try {
    const newCourse = req.body;
    newCourse.createdUser = req.session.userID
    await Course.create(newCourse)
    req.flash('success', `${newCourse.name} has been created successfully`)
  } catch (error) {
    req.flash('error', `Something happened!`)
  }
  res.redirect('/courses')
}

exports.getAllCourse = async (req, res) => {
  try {
    const categorySlug = req.query.categories
    const category = await Category.findOne({ slug: categorySlug })
    const categories = await Category.find()
    const query = req.query.search

    let filter = {};
    filter.name = ""
    filter.category = null

    if (categorySlug) 
      filter = { category: category._id }

    if (query) 
      filter = { name: query }

    const courses = await Course.find({
      $or:[
        {name: {$regex : '.*' + filter.name + '.*', $options : 'i'} },  //regex arama options küçük büyük hard duyarlılık
        {category: filter.category }                                    //regex arama options küçük büyük hard duyarlılık
      ] 
    }).sort('-createdAt')
    .populate("createdUser", "name")

    res.status(200).render('courses', { courses, categories })
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    })
  }
}

exports.getCourse = async (req, res) => {
  try {
    const categories = await Category.find()
    const course = await Course.findOne({ slug: req.params.slug }).populate("createdUser", "name");
    res.status(200).render('course', { course , categories });
  } catch (error) {
    res.status(400).json({
      status: 'fail-courses',
      error,
    })
  }
}


exports.enrollCourse = async (req, res) => {
  try {
    const user = await User.findById({_id: req.session.userID}, '-password')
    await user.courses.push({_id: req.body.course_id})
    await user.save()
    res.status(200).redirect('/users/dashboard');

  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    })
  }
}

exports.relaseCourse = async (req, res) => {
  try {
    const user = await User.findById({_id: req.session.userID})
    await user.courses.pull({_id: req.body.course_id})
    await user.save()
    res.status(200).redirect('/users/dashboard');

  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    })
  }
}


exports.deleteCourse = async (req, res) => {
  try {

    const course = await Course.findOneAndRemove({slug: req.params.slug})
    req.flash('error', `${course.name} has been remove successfully`)
    res.status(200).redirect('/users/dashboard');

  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    })
  }
}

exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findOneAndUpdate({slug:req.params.slug}, req.body)
    await course.save()
    const backUrl = req.header('Referer').replace( req.params.slug,course.slug)
    res.redirect(backUrl)
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    })
  }

}

