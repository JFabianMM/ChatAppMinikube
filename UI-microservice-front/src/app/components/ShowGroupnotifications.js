import React from 'react'; 
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import { GroupNotificationAvatars } from './GroupNotificationAvatars';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';


export function ShowGroupnotifications(props) {
    const {requesters, setOpen, onClose, selectedValue} = props;
    const userData = useSelector(state => state.userData);
    const groupRequesters = useSelector(state => state.groupRequesters);
    

    const Dispatch = useDispatch();


    const handleClose = () => {
        onClose(selectedValue);
    };

    const handleListItemClick = (value) => {
        onClose(value);
    };

    const handleContact= (item)=> {
        // props.socket.emit('sendContact', item);
    }

    const handleAcceptedListItem = (value)=>{
        let newGroup=[];
        let [email, id, room]=value;
        
        newGroup = groupRequesters.filter(function (el){
            return el.room == room;
        });
        
        let formattedMembers = [];
        newGroup[0].members.forEach(element => {
            let member={
                id:element.id,
                email:element.email,
                firstName:element.firstName,
                lastName:element.lastName
            }
            formattedMembers = formattedMembers.concat(member);
        });     
        
        // createGro(id, email, room, formattedMembers);
        let input=formattedMembers;
        Dispatch({type: 'CREATE_GROUP', id, email, room, input});

    }
    

    const handleRejectedListItem = (value)=>{
        let [email, id, room]=value;
        //deleteGroupNot(id, email, room);
        Dispatch({type: 'DELETE_GROUP_NOTIFICATION', id, email, room});
        
    }

  return (
    <Dialog onClose={handleClose} open={props.selectedValueGroup}>
      <DialogTitle style={{textAlign: 'center'}} >New Gruop Requests</DialogTitle>
      <List sx={{ pt: 0 }}>
        {groupRequesters.map((requester) => (
            <ListItem button key={requester.room}> 
            <ListItemAvatar>
                <GroupNotificationAvatars id={requester.room} group={requester} />
            </ListItemAvatar>
            <ListItemText primary={'Group Name' } />
            <Button style={{marginLeft: '10px'}} onClick={() => handleAcceptedListItem([userData.email,userData._id, requester.room])} variant="contained">Accept</Button>
            <Button style={{marginLeft: '10px'}} onClick={() => handleRejectedListItem([userData.email,userData._id, requester.room])} variant="contained">Reject</Button>
          </ListItem>
        ))}

      </List>
    </Dialog>
  );
}

ShowGroupnotifications.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedValue: PropTypes.string.isRequired,
};