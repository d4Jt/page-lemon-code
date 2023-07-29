const User = require('../user.model');
const {createToken} = require('../../utils');

const findOneOrCreatePassport = async (user) => {
   const foundUser = await findOneUser(user.emails[0]?.value);
   if (!foundUser) {
      let newUser = null;
      if(user.provider === 'google'){
          newUser = await createNewUser({
            firstName: user.name?.givenName ? user.name.givenName : '',
            lastName: user.name?.familyName
               ? user.name.familyName
               : user.displayName,
            avatar: user.photos[0]?.value,
            email: user.emails[0]?.value,
            msisdn: '',
         });
      }
      if(user.provider === 'github'){
         newUser = await createNewUser({
            firstName: user.username ? user.username : '',
            lastName: " ",
            avatar: user.photos[0]?.value,
            email: user.emails[0]?.value,
            msisdn: '',
         });
      }

      
      const accessToken = createToken(newUser, '5s');
      const refreshToken = createToken(newUser, '120s');

      if(refreshToken){
         await User.updateOne({email: newUser.email }, {refreshToken})
      }

      return {
         err: 0,
         message: 'Registered is successful',
         newUser,
         'access_token': `Bearer ${accessToken}`,
         'refresh_token': `Bearer ${refreshToken}`, 
      };
   }

   const accessToken = createToken(foundUser, '5s');
   const refreshToken = createToken(foundUser, '120s');

      if(refreshToken){
         await User.updateOne({email: foundUser.email }, {refreshToken})
      }
   return {
      err: 0,
      message: 'Login is successful',
      foundUser,
      'access_token': `Bearer ${accessToken}`,
      'refresh_token': `Bearer ${refreshToken}`, 
   };
};

const findOneUser = async (email) => await User.findOne({ email }).lean();

const createNewUser = async ({ firstName, lastName, image, email, msisdn }) =>
   await User.create({
      firstName,
      lastName,
      avatar: image,
      email,
      msisdn,
   });

module.exports = {
   createNewUser,
   findOneOrCreatePassport,
   findOneUser,
};
