const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const slugify = require('slugify')

const CourseSchema = new Schema({
    name: {type : String, unique : true, required: true, trim : true},
    description: {type : String, required: true, trim : true},
    createdAt: {type : Date, default: Date.now},
    slug:  {type : String, unique : true},
    category: {type:mongoose.Schema.Types.ObjectId,ref:'Category'},
    createdUser: {type:mongoose.Schema.Types.ObjectId,ref:'User'}    
})

CourseSchema.pre('validate', function(next){
    this.slug = slugify(this.name, {
        lower:true,
        strict:true
    })
    next()
})

const Course = mongoose.model('Course', CourseSchema)
module.exports = Course