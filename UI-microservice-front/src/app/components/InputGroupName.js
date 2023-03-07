import React, { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

export function InputGroupName() {
    const [inputgroupname, setInputgroupname] = useState('');
    const handleChange = (event) => {
        event.preventDefault();
        setInputgroupname(event.target.value);
    };

  return (
    <Box component="form" sx={{'& > :not(style)': { m: 1, width: '25ch' },}} noValidate autoComplete="off">
      <TextField onChange={handleChange} id="standard-basic" label="Add group name" variant="standard" />
    </Box>
  );
}