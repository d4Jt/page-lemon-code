const User = require('../user.model');

const findOneOrCreatePassport = async({id,displayName,photos,email,...user}) => new Promise(async (resolve, reject) =>{
    const userModel = await User.findOne({_id: id});
    if(userModel) 
    resolve({
        err: 1,
        msg: "User already exists"
    }) 
    const newUser = new User({_id: id, firstName: displayName, avatar: photos[0].value,email: email})
    await newUser.save();
    resolve(newUser);
}) ;

module.exports = {
    findOneOrCreatePassport,
}