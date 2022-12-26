const express = require('express')
const mongoose = require('mongoose')
const session = require('express-session')
const MongoStore = require('connect-mongo')
var flash = require('connect-flash')
var methodOverride = require('method-override')
const pageRoute = require('./routes/pageRoute')
const courseRoute = require('./routes/courseRoute')
const categoryRoute = require('./routes/categoryRoute')
const userRoute = require('./routes/userRoute')
const allRouteMiddleware = require('./middlewares/allRouteMiddleware')
const app = express()
const port = 4000;

//Db Connect
const connectString = 'mongodb://127.0.0.1:27017/smartEdu-test-db'
mongoose.set('strictQuery', true)
mongoose.connect(connectString).then(() => {console.log('Db baglantisi basarili')})

//Template Engine
app.set('view engine', 'ejs')

//Global Variable
global.userIn = null

//Middlewares
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method', {methods:['POST', 'GET']}))
app.use(session({
  secret: 'my_keyboard_cat',
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({ mongoUrl: connectString})
}))
app.use(flash())
app.use((req,res, next)=> {
  res.locals.flashMessages = req.flash()
  next()
})


//Routes
app.use('*', allRouteMiddleware)
app.use('/', pageRoute)
app.use('/courses', courseRoute)
app.use('/categories', categoryRoute)
app.use('/users', userRoute)



//Listen Port
app.listen(port, () => {
    console.log(`Server ${port} Numarali ile baslatildi`)
  });