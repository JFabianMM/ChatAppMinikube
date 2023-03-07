const express = require('express');
const router = express.Router();
const Notification = require('../models/notification');
const Groupnotification = require('../models/groupnotification');
const Contact = require('../models/contact');
const Group = require('../models/group');

const findGroup = async function (identification) {
    const group = await Group.findOne({ identification });
    if (!group){
        throw new Error('No available information')
    }
    return group
};

const findContact = async function (identification) {
    const contact = await Contact.findOne({ identification });
    if (!contact){
        throw new Error('No available information')
    }
    return contact
};

const findNotification = async function (identification) {
    const notification = await Notification.findOne({ identification });
    if (!notification){
        throw new Error('No available information')
    }
    return notification
};

const findGroupnotification = async function (identification) {
    const groupnotification = await Groupnotification.findOne({ identification });
    if (!groupnotification){
        throw new Error('No available information')
    }
    return groupnotification
};

router.post('/register', async (req, res)=>{ 
    const identification= req.body.identification;

    let { email, password, firstName, lastName} = req.body.input;
    const notification = new Notification({identification,email});
    const contact = new Contact({identification,email});
    const group = new Group({identification,email});
    const groupnotification = new Groupnotification({identification,email});
    
    try {
        await notification.save();
        await contact.save(); 
        await group.save();
        await groupnotification.save();  
        res.send({notification, contact, group, groupnotification});
    } catch (e){
        res.status(400).send(e)
    }  
});

router.get('/hi', async (req, res)=>{ 
    console.log('hello')
    try {
        let hello={
            hi:'hijhkj2'
        }  
        res.send({hello});
    } catch (e){
        res.send({e});
    }
});

router.post('/login', async (req, res)=>{   
    const identification = req.body.identification;
    try {
        const contact = await findContact(identification);
        const notification = await findNotification(identification);
        const groupnotification = await findGroupnotification(identification);
        const group = await findGroup(identification);
        let loginResponse = {
            contact:contact,
            notification: notification,
            groupnotification: groupnotification.groupnotifications,
            group: group.groups
        }
        res.send({loginResponse});
    } catch (e){
        res.status(400).send(e);
    }
});

router.post('/notification', async (req, res)=>{ 
    try{
        const notification = await findNotification(req.body.identification);
        if (notification){res.send({notification})}else{res.send()} 
    }catch(e){
        res.status(400).send(e)
    }    
});

router.post('/groupnotifications', async (req, res)=>{ 
    try{
        const groupnotification = await findGroupnotification(req.body.identification);
        let response=groupnotification.groupnotifications;
            res.send({response})
    }catch(e){
        res.status(400).send(e)
    }    
});

router.post('/groups', async (req, res)=>{  
    try{
        const group = await findGroup(req.body.identification);
        res.send({group})
    }catch(e){
        res.status(400).send(e)
    }    
});

router.post('/createnotification', async (req, res)=>{ 
    let input=req.body.input;
    const notification = await findNotification(input.identification);
    const newNotification ={id:input.id, email: input.useremail, firstName:input.firstName,lastName:input.lastName };

    // Before concat, I must to review duplicates, if there is a duplicate, only return the 
    // already created. 
    notification.notifications = notification.notifications.concat(newNotification);
    await notification.save(); 
    res.send({notification});
});

router.post('/deletenotification', async (req, res)=>{
    let input = req.body.input;
    try{
        const notification = await findNotification(input.userid);
        let identification=input.contactid;
        notification.notifications = notification.notifications.filter((el) => {
            return el.id !== identification;
        });

        await notification.save();

        let DeleteNotificationResponse ={
            number: notification.notifications.length
        }
        res.send({DeleteNotificationResponse});
    }catch(e){
        res.status(400).send(e)
    }
});

router.post('/contact', async (req, res)=>{
    try {
        const contact = await findContact(req.body.identification);
        res.send({contact});
    } catch (e){
        res.status(400).send(e)
    }
});

router.post('/createcontact', async (req, res)=>{
    let input = req.body.input;
    try{
        const contact = await findContact(input.contactid);
        const contact2 = await findContact(input.userid);

        let room=input.userid+input.contactid;
        const newContact ={id:input.userid, room:room , email: input.useremail, firstName:input.userfirstName,lastName:input.userlastName };
        const newContact2 ={id:input.contactid, room:room , email: input.contactemail, firstName:input.contactfirstName,lastName:input.contactlastName };
        
        // Before concat, I must to review duplicates, if there is a duplicate, only return the 
        // already created. 
        contact.contacts = contact.contacts.concat(newContact);
        contact2.contacts = contact2.contacts.concat(newContact2);
        
        await contact.save(); 
        await contact2.save(); 

        // // The notification part
        const notification = await findNotification(input.userid);
            
        let identification=input.contactid;
        notification.notifications = notification.notifications.filter((el) => {
                return el.id !== identification;
        });
        await notification.save();
            
        let CreateContactResponse = {
            user: contact2,
            contact: contact,
            number: notification.notifications.length
        }
        res.send({CreateContactResponse});
    }catch(e){
        res.status(400).send(e)
    }
});


router.post('/creategroup', async (req, res)=>{
    let input = req.body.input;
    try {  
        const group = await findGroup(input.id);
        let members=[];
        input.group.members.forEach(element => {
            let member={
                id:element.id,
                email:element.email,
                firstName:element.firstName,
                lastName:element.lastName
            }
            members=members.concat(member);
        });
        let newgroup={
            room:input.group.room,
            members:members
        }
        group.groups = group.groups.concat(newgroup);
        await group.save(); 

        // Delete group notification
        let groupnotification = await findGroupnotification(input.id);
        groupnotification.groupnotifications = groupnotification.groupnotifications.filter((el) => {
            return el.room !== input.group.room;
        });
        await groupnotification.save();
        let response=group.groups; 
        res.send({response});
    } catch (e){
        res.status(400).send(e)
    }
});

router.post('/deletegroupnotification', async (req, res)=>{
    let input = req.body.input;
    try {  
        let groupnotification = await findGroupnotification(input.id);
        groupnotification.groupnotifications = groupnotification.groupnotifications.filter((el) => {
            return el.room !== input.room;
        });
        await groupnotification.save();
        let DeleteNotificationResponse ={
            number: groupnotification.groupnotifications.length
        }       
        res.send({DeleteNotificationResponse});
    } catch (e){
        res.status(400).send(e)
    }
});

router.post('/creategroupandnotifications', async (req, res)=>{
    let input = req.body.input;
    try {  
        const group = await findGroup(input.id);    
        let members=input.group.members;
        let newGroup={room:'', members:members};
        group.groups = group.groups.concat(newGroup);
        let len= group.groups.length;
        room = JSON.stringify(group.groups[len-1]._id);
        room = room.replaceAll('"', '');
        group.groups[len-1].room=room;
        await group.save(); 
        
        function saveNotifications(members, room) {
            let result = new Array();
            members.forEach(function(member) {
                let identification=member.id;
                Groupnotification.findOne({ identification }).lean().exec(function (err, groupnotification) {
                    let newGroupnotification={room:room, members:members};
                    let gr=groupnotification.groupnotifications.concat(newGroupnotification);
        
                    if (identification!=input.id){
                        result.push(groupnotification);
                        Groupnotification.updateOne({ identification: identification }, { groupnotifications: gr }, function(
                            err,
                            result
                          ) {
                            if (err) {
                                res.send(err);
                            } 
                          });
                    }
                });
            });
        }
        saveNotifications(members,room)
        let response=group.groups
        res.send({response});
    } catch (e){
        res.status(400).send(e)
    }
});

module.exports=router;