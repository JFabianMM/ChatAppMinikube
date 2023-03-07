import React, { useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import { UserCard } from './UserCard'
import { GroupCard } from './GroupCard'
import { MessageCard } from './MessageCard';
import { MenuBar } from './MenuBar'
import { InputSearch } from './InputSearch' 
import { InputMessage } from './InputMessage' 
import { AddGroupDialog } from './AddGroupDialog';
import {useSelector} from 'react-redux';
import {useDispatch} from 'react-redux';
import { updateNotifications } from '../../redux/slice/notificationsSlice';
import { updateGroupNotifications } from '../../redux/slice/groupNotificationsSlice';
import { updateRooms } from '../../redux/slice/roomsSlice';
import { updateMessages } from '../../redux/slice/messagesSlice';
import { updateCurrentChat } from '../../redux/slice/currentChatSlice';

export function Chat (props) {
    const userData = useSelector(state => state.userData);
    const contacts = useSelector(state => state.contacts);
    const groups = useSelector(state => state.groups);
    const notifications = useSelector(state => state.notifications);
    const groupNotifications = useSelector(state => state.groupNotifications);
    const rooms = useSelector(state => state.rooms);
    const currentRoom = useSelector(state => state.currentRoom);
    const messages = useSelector(state => state.messages);
    const currentChat = useSelector(state => state.currentChat);
    
    const Dispatch = useDispatch();
     
    const socket = io();
    console.log('Connected');

    function addNewChat(contact,data){
        let room=contact.room;
        let users=[{id:data._id, userName:data.firstName + ' ' +data.lastName, src:'' },{id:contact.id, userName:contact.firstName + ' ' +contact.lastName, src:'' }];
        let messages=[];
        let contactRoom={
            room:room, 
            users:users,
            messages:messages
        }
        return contactRoom;
    }
    
    // Room per user for Notifications
    let username = userData.firstName + ' ' + userData.lastName;
    let room = userData._id;
    
    // Connection for Notifications and Contacts request
    socket.emit('join', {username, room }) 
    
    // Create new room connection for each Contact
    rooms.map((item) =>{
        let room=item.room; 
        socket.emit('join', {username, room })
    })
    
    // Manage the Notifivcation reception
    socket.on('sendNotification', (message)=>{
        socket.disconnect();
        Dispatch(updateNotifications(notifications+1));
        socket.disconnect();
    });

    socket.on('sendGroupnotification', (message)=>{
        socket.disconnect();
        Dispatch(updateGroupNotifications(groupNotifications+1));
        socket.disconnect();
    });

    socket.on('sendMessage', (item)=>{
        let tempMessages=[];
        messages.forEach(element => {
            let message ={
                room: element.room,       
                users: element.users,
                messages: element.messages
            }
                tempMessages.push(message);
        });

        let index = tempMessages.findIndex(function (el){
            return el.room == item.room;
        });
        let date = new Date();
        let current_time = date.getHours()+':'+date.getMinutes();

        let pos='left';
        if (item.id == userData._id){
            pos='right';
        }
        let newMessage={
            id:tempMessages[index].messages.length+1,
            position:pos,
            message:item.message,
            time:current_time
        }
        tempMessages[index].messages= tempMessages[index].messages.concat(newMessage);
        socket.disconnect();
        Dispatch(updateMessages(tempMessages));
        socket.disconnect();

        if (currentRoom.length==0){
            socket.disconnect();
        }

        if (currentRoom.length>0){
            console.log('messages', messages);
            index = messages.findIndex(function (el){
                return el.room == currentRoom[0].room;
            });
            socket.disconnect();
            Dispatch(updateCurrentChat(tempMessages[index].messages));
        }   
    });

    // Manage the new contact reception
    socket.on('sendContact', (item)=>{
        console.log('sendContact item: ', item);
        socket.disconnect();

        let addedRoom={
            id:item.id,
            room:item.room
        }
        console.log('sendContact addedRoom: ', addedRoom);

        socket.disconnect();

        Dispatch(updateRooms(rooms.concat(addedRoom)));
        
        let chat=[];
        chat= chat.concat(addNewChat(item,userData));  
        socket.disconnect();
        Dispatch(updateMessages(messages.concat(chat)));
        socket.disconnect();

        let id = userData._id;
        Dispatch({type: 'QUERY_CONTACT', id});
    })

    return (
        <>
        <Grid container style={{backgroundColor:'#8dc6ff', width: '100%', height: '100 px', padding: ''}}>
            <MenuBar i18n={props.i18n} t={props.t} language={props.language} languageSet={props.languageSet} socket={socket}/>
        </Grid>
        <Grid container component={Paper} style={{width: '100%', height: '100%'}}>
            <Grid item xs={4} style={{backgroundColor:'#34495e', borderRight: '1px solid #e0e0e0'}}>
                <List>
                    <UserCard name={username} src='https://material-ui.com/static/images/avatar/1.jpg'/>
                </List>
                <Divider sx={{ bgcolor: "secondary.light" }}/>
                <Grid item xs={12} style={{padding: '5px'}}>
                    <InputSearch socket={socket} style={{background:'#34495e', color:'#FFFFFF'}} id="outlined-basic-email" fullWidth/>
                </Grid>
                <List style={{height: '80vh', overflowY: 'auto'}}>
                    {
                        contacts.map((element) =>{
                            return (
                                <UserCard socket={socket} key={element.id} name={element.firstName+' '+element.lastName} src={element.src} index={element.id}/>
                            );
                        })
                    }
                    <Divider sx={{ bgcolor: "secondary.light" }}/>
                    <Grid item xs={12} style={{padding: '0px', height: '10vh'}}>
                        <AddGroupDialog socket={socket}/>
                    </Grid>
                    {
                        groups.map((element) =>{
                            return (
                                <GroupCard key={element.room} group={element} socket={socket} index={element._id}/>
                            );
                        })
                    }
                </List>
            </Grid>

            <Grid item xs={8}>
                <List style={{height: '80vh', overflowY: 'auto'}}>
                    {
                        currentChat.map((element) =>{
                            return (
                                <MessageCard key={element.id} position={element.position} message={element.message} time={element.time} index={element.id} />                    
                            );
                        })
                    }
                </List>
                <Grid item xs={12} container style={{backgroundColor:'#f4f7f7', height: '70px'}}>
                    <Grid item xs={12} style={{padding: '10px'}}>
                        <InputMessage socket={socket} style={{background:'#34495e', color:'#FFFFFF'}} id="outlined-basic-email" fullWidth/>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
        </>
    );
}

