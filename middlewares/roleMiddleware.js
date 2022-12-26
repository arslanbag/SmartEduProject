const User = require('../models/User')

module.exports = (roles) => {
    return async (req, res, next) =>{
        const user = await User.findById(req.session.userID)
        if(roles.includes(user.role))
            next()
        else
            return res.status(401).send('YOU CANT DO IT')
    }
}