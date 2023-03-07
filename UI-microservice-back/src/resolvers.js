const User = require('./models/user');
const authorization = require('./middleware/authorization');
const jwt = require('jsonwebtoken');
const bcrypt = require ('bcryptjs');
const fetch = require('node-fetch');

const findUser = async function (email) {
    const user = await User.findOne({ email });
    if (!user){
        throw new Error('No available information')
    }
    return user
};
const generateAuthToken = async function (user){
    const token =jwt.sign({_id: user._id.toString() }, 'thisisthechatproject');
    user.tokens = user.tokens.concat({ token });
    await user.save(); 
    return token;
}

const findByCredentials = async function (email, password) {
    const user = await User.findOne({ email });
    if (!user){
        throw new Error('No available information')
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch){
        throw new Error('No available information')
    }
    return user
};

const fetchFunction = async function (formData, uri) {
    const result = await fetch(uri, {
        method: 'post',
        body: JSON.stringify(formData),
        headers: { 
            'Accept':'application/json',
            'Content-Type':'application/json'}
        })
        .then(res => res.json())
        .then(data => {
               return data;  
        });
    return result
};
const fetchFunction2 = async function (uri) {
    const result = await fetch(uri, {
        method: 'get',
        headers: { 
            'Accept':'application/json',
            'Content-Type':'application/json'}
        })
        .then(res => res.json())
        .then(data => {
               return data;  
        });
    return result
};

const resolvers = {
    Query: {
        async createLogin(context, {input}){
            let { email, password} = input; 
            try {
                const user = await findByCredentials(email, password);
                let idnumber= JSON.stringify(user._id);
                const identification = idnumber.replaceAll('"', '');

                const formData={
                    email: email,
                    password: password,
                    identification: identification
                }
                const data= await fetchFunction(formData, 'http://backend:4001/api/users/login');
                const data2= await fetchFunction2('http://backend:4001/api/users/hi');
                // const data= await fetchFunction(formData, 'http://localhost:4001/api/users/login');
                // const data2= await fetchFunction2('http://localhost:4001/api/users/hi');
                console.log('data2', data2);
                const token = await generateAuthToken(user);

                let loginResponse = {
                    user: user,
                    token: token,
                    contact:data.loginResponse.contact,
                    notification: data.loginResponse.notification,
                    groupnotification: data.loginResponse.groupnotification,
                    group: data.loginResponse.group
                }
                return loginResponse;
            } catch (e){
                return e;
            }  
        },
        async user(context, args){ 
            authorization(context.headers.authorization);
            try {
                const user = await findUser(args.email);
                return user;
            } catch (e){
                return e;
            } 
        },
        async contacts(context, args){
            authorization(context.headers.authorization);
            const formData={
                 identification: args.id
            }
            const contact= await fetchFunction(formData, 'http://backend:4001/api/users/contact');
            // const contact= await fetchFunction(formData, 'http://localhost:4001/api/users/contact');
            return contact.contact;
        },
        async notifications(context, args){ 
            authorization(context.headers.authorization);
            const formData={
                identification: args.id
            }
            const notification= await fetchFunction(formData, 'http://backend:4001/api/users/notification');
            // const notification= await fetchFunction(formData, 'http://localhost:4001/api/users/notification');
            return notification.notification;
        },
        async groupnotifications(context,args){
            authorization(context.headers.authorization);
            const formData={
                identification: args.id
            }
            const groupnotification= await fetchFunction(formData, 'http://backend:4001/api/users/groupnotifications');
            //const groupnotification= await fetchFunction(formData, 'http://localhost:4001/api/users/groupnotifications');
            return groupnotification.response           
        },
        async groups(context,args){
            authorization(context.headers.authorization);
            const formData={
                identification: args.id
            }
            const group= await fetchFunction(formData, 'http://backend:4001/api/users/groups');
            //const group= await fetchFunction(formData, 'http://localhost:4001/api/users/groups');
            return group.groups;
        }
    },
    Mutation: {
        async createUser(context, {input}){
            const user = new User(input);
            let idnumber= JSON.stringify(user._id);
            const identification = idnumber.replaceAll('"', '');
            const formData={
                input: input,
                identification: identification
            }
            try {
                await user.save();
                const data2= await fetchFunction2('http://backend:4001/api/users/hi');
                console.log('data2', data2); 
                const userResponse= await fetchFunction(formData, 'http://backend:4001/api/users/register');
                //const userResponse= await fetchFunction(formData, 'http://localhost:4001/api/users/register');
                console.log('userResponse: ', userResponse);
                const token = await generateAuthToken(user);
                
                return user; 
            } catch (e){
                return e;
            }  
        },
        async createNotification(context, {input}){ 
            authorization(context.headers.authorization);
            const formData={
                input: input
            }
            const newnotification= await fetchFunction(formData, 'http://backend:4001/api/users/createnotification');
            //const newnotification= await fetchFunction(formData, 'http://localhost:4001/api/users/createnotification');
            return newnotification.notification;        
        }, 
        async createContact(context, {input}){ 
            authorization(context.headers.authorization);
            const formData={
                input: input
            }
            const newcontact= await fetchFunction(formData, 'http://backend:4001/api/users/createcontact');
            //const newcontact= await fetchFunction(formData, 'http://localhost:4001/api/users/createcontact');
            return newcontact.CreateContactResponse
        },
        async deleteNotification(context, {input}){
            authorization(context.headers.authorization);
            const formData={
                input: input
            }
            const response= await fetchFunction(formData, 'http://backend:4001/api/users/deleteNotification');
            //const response= await fetchFunction(formData, 'http://localhost:4001/api/users/deleteNotification');

            return response.DeleteNotificationResponse;       
        }, 
        async createGroup(context,{input}){
            authorization(context.headers.authorization);  
            const formData={
                input: input
            }
            const response= await fetchFunction(formData, 'http://backend:4001/api/users/creategroup');
            //const response= await fetchFunction(formData, 'http://localhost:4001/api/users/creategroup');
            return response.response
        },
        async deleteGroupNotification(context,{input}){
            authorization(context.headers.authorization);
            const formData={
                input: input
            }
            const response= await fetchFunction(formData, 'http://backend:4001/api/users/deletegroupnotification'); 
            //const response= await fetchFunction(formData, 'http://localhost:4001/api/users/deletegroupnotification'); 
            return response.DeleteNotificationResponse;
        },
        async createGroupAndNotifications(context,{input}){
            authorization(context.headers.authorization);
            const formData={
                input: input
            }
            const response= await fetchFunction(formData, 'http://backend:4001/api/users/creategroupandnotifications');
            //const response= await fetchFunction(formData, 'http://localhost:4001/api/users/creategroupandnotifications');
            return response.response  
        }   
    }
};

module.exports = resolvers;