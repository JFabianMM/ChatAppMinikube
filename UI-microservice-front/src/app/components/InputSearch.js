import * as React from 'react';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import { useState } from 'react';
import { ContactRequest } from './ContactRequest'; 

export function InputSearch(props) {
    const [searchmessage, setSearchmessage] = useState('');

    const handleChange = (event) => {
        event.preventDefault();
        setSearchmessage(event.target.value);
    };

  return (
      <Paper component="form" sx={{ p: '2px 4px', display: 'flex', alignItems: 'center'}}>
          <InputBase sx={{ ml: 1, flex: 1 }} placeholder="Search new contacts" inputProps={{ 'aria-label': 'search google maps' }}
            onChange={handleChange}/>
          <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
              <ContactRequest socket={props.socket} searchmessage={searchmessage}/>
          </IconButton>
          <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
      </Paper>
  );
}