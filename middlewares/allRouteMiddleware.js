const User = require('../models/User')

module.exports = async (req, res, next)=>{
    if(req.session.userID)
        try {
            uA = await User.findById(req.session.userID)
            uB = await uA.populate('courses')
            user = await uB.populate('courses.createdUser','name _id')
            delete uA , uB;
        } catch (error) {}
    userIN = req.session.userID
    next()
}
 