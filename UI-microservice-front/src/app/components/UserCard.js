import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { updateCurrentRoom } from '../../redux/slice/currentRoomSlice';
import { updateCurrentChat } from '../../redux/slice/currentChatSlice';

export function UserCard(props){
    const rooms = useSelector(state => state.rooms); 
    const messages = useSelector(state => state.messages); 
    const Dispatch = useDispatch();

    function handleClickUserCard(e) {
        e.preventDefault();
        let newCurrentroom = rooms.filter(function (el){
            return el.id == e.target.parentNode.id;
        });
        props.socket.disconnect();
        Dispatch(updateCurrentRoom(newCurrentroom));

        let tempMessages=messages;
        let index = tempMessages.findIndex(function (el){
            return el.room == newCurrentroom[0].room;
        });

        props.socket.disconnect();
        Dispatch(updateCurrentChat(messages[index].messages));
    };

    return (
            <ListItem style={{allign:'center'}} id={props.index} button onClick={handleClickUserCard} >
                <ListItemIcon>
                    <Avatar id={props.index} alt={props.name} src={props.src} />
                </ListItemIcon>
                <ListItemText id={props.index} style={{color:'#FFFFFF'}} primary={props.name}></ListItemText>
                <ListItemText id={props.index} style={{color:'#FFFFFF'}} secondary="online" align="right"></ListItemText>
            </ListItem>
    )   
  }