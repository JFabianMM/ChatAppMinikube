import * as React from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Grid from '@mui/material/Grid';

export function MessageCard(props){
    return (
        <ListItem>
            <Grid container>
                <Grid item xs={12}>
                    <ListItemText align={props.position} primary={props.message}></ListItemText>
                </Grid>
                <Grid item xs={12}>
                    <ListItemText align={props.position} secondary={props.time}></ListItemText>
                </Grid>
            </Grid>
        </ListItem>
    )   
  }