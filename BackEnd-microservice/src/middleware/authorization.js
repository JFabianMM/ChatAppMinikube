// const jwt = require('jsonwebtoken');
// const User = require('../models/user');

// const authorization = async (req) => {
//     try {
//         console.log('Autorization here')
//         const token = req.replace('Bearer ','');
//         const decoded = jwt.verify(token, 'thisisthechatproject');
//         console.log(decoded._id);
//         const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });
        
//         if (!user){
//             throw new Error()
//         }
//         console.log('Authenticated');

//     } catch (e){
//         throw new Error('Please authenticate');  
//     }
// }

// module.exports = authorization