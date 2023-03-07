import * as React from 'react';
import { useState } from 'react';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';
import {useSelector} from 'react-redux';

export function InputMessage(props) {
  const [inputmessage, setInputmessage] = useState('');
  const userData = useSelector(state => state.userData);
  const currentRoom = useSelector(state => state.currentRoom);

    const handleChange = (event) => {
        event.preventDefault();
        setInputmessage(event.target.value);
    };

    const handleNewMessage= (event)=> {
      event.preventDefault();
      let room=currentRoom[0].room;
      let message=inputmessage;
      let item={
        room:room,
        id:userData._id,
        message:message
      }
      props.socket.emit('sendMessage', item);
    }

  return (
    <Paper
      component="form"
      sx={{ p: '2px 4px', display: 'flex', alignItems: 'center'}}
    >
      <InputBase sx={{ ml: 1, flex: 1 }} onChange={handleChange} placeholder="Write a message" inputProps={{ 'aria-label': 'search google maps' }}/>
      <IconButton onClick={handleNewMessage} type="button" sx={{ p: '10px' }} aria-label="search">
        <SendIcon />
      </IconButton>
      <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
    </Paper>
  );
}