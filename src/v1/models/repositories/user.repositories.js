const User = require('../user.model');

const findOneOrCreatePassport = async (user) => {
   const foundUser = await findOneUser(user.emails[0]?.value);
   if (!foundUser) {
      const newUser = await createNewUser({
         firstName: user.name?.givenName ? user.name.givenName : '',
         lastName: user.name?.familyName
            ? user.name.familyName
            : user.displayName,
         avatar: user.photos[0]?.value,
         email: user.emails[0]?.value,
         msisdn: '',
      });
      return newUser;
   }
   return foundUser;
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
