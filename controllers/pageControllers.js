const nodemailer = require('nodemailer')
const Course = require('../models/Course')
const User = require('../models/User')

exports.getIndexPage =  async (req, res) => {
  const lastTwoCourse = await Course.find().sort('-createdAt').limit(2)
  const totalCourses = await Course.find().countDocuments()
  const totalStudents =  await User.find({role:'student'}).countDocuments()
  const totalTeacher = await User.find({role:'teacher'}).countDocuments()
  res.status(200).render('index',{lastTwoCourse, totalCourses, totalStudents, totalTeacher})
};

exports.getAboutPage = (req, res) => {
  res.status(200).render('about')
};

exports.getRegisterPage = (req, res) => {
  res.status(200).render('register')
};

exports.getLoginPage = (req, res) => {
  res.status(200).render('login')
};

exports.getContactPage = (req, res) => {
  res.status(200).render('contact')
};

exports.sendEmail = async (req, res) => {
  try {
    let outputMessage = `
    <h1> Mail Details </h1>
    <ul>
        <li>Name : ${req.body.name}</li>
        <li>Email : ${req.body.email}</li>
    </ul>
    <h1> Message </h1>
    <p> ${req.body.message}</p>
    `;
    let transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: 'gilbert.schiller@ethereal.email', // ethereal acount
        pass: 'd5DdJXKchxzV4dUnux', // ethereal password
      },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"Smart EDU  Contact Form 👻" <gilbert.schiller@ethereal.email>', // sender address
      to: req.body.email, // list of receivers
      subject: 'Smart EDU  Contact Form New Message ✔', // Subject line
      html: outputMessage, // html body
    });

    console.log('Message sent: %s', info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info))
    
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    req.flash('success', 'We Received your message successfully')
  } catch (error) {
    req.flash('error', `Something happened!`)
  }
  res.status(200).redirect('/contact')
}
