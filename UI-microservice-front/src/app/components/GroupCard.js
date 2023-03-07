import * as React from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { GroupAvatars } from './GroupAvatars';
import { useSelector } from 'react-redux';
import { updateCurrentRoom } from '../../redux/slice/currentRoomSlice';
import { useDispatch } from 'react-redux';
import { updateCurrentChat } from '../../redux/slice/currentChatSlice';

export function GroupCard(props){
    const rooms = useSelector(state => state.rooms);
    const messages = useSelector(state => state.messages);

    const Dispatch = useDispatch();
    
    function handleClickGroupCard(e) {
        e.preventDefault();
        
        let newCurrentroom = rooms.filter(function (el){
           return el.id == props.group.room;
        });

        Dispatch(updateCurrentRoom(newCurrentroom));

        let index = messages.findIndex(function (el){
            return el.room == newCurrentroom[0].room;
        });

        props.socket.disconnect();
        Dispatch(updateCurrentChat(messages[index].messages));

    };

    return (
            <ListItem style={{allign:'center'}} id={props.index} button onClick={handleClickGroupCard} >
                <ListItemIcon>
                    <GroupAvatars id={props.index} group={props.group} />
                </ListItemIcon>
                <ListItemText id={props.index} style={{color:'#FFFFFF'}} primary={props.name}></ListItemText>
            </ListItem>
    )   
  }