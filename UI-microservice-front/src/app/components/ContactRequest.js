import React, {useEffect} from 'react'; 
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import SearchIcon from '@mui/icons-material/Search';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import {gql, useLazyQuery, useMutation} from '@apollo/client';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

function BootstrapDialogTitle(props) {
  const { children, onClose, ...other } = props;
  

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

export function ContactRequest(props) {

  const Dispatch = useDispatch();

  const [open, setOpen] = React.useState(false);
  const [userinf, setUserInf] = React.useState('');

  const userData = useSelector(state => state.userData);
  const getUser = useSelector(state => state.getUser);


  const handleNotification= (message)=> {
    props.socket.emit('sendNotification', message);
  }

  const handleClickOpen = () => {
        let email=props.searchmessage;
        Dispatch({type: 'QUERY_USER', email});
        setOpen(true);
  };
  const handleClose = () => {
      setOpen(false);
  };

  const handleRequestAndClose = (ident, em) => {
      let identification= ident;
      let email= em;
      let id= userData._id;
      let useremail= userData.email;
      let firstName= userData.firstName;
      let lastName= userData.lastName;
      Dispatch({type: 'MUTATION_CREATE_NOTIFICATION', identification, email, id, useremail, firstName, lastName });
      handleNotification(identification);
      setOpen(false);
  };

  return (
      <div>
          <SearchIcon variant="outlined" onClick={handleClickOpen}/> 
          <BootstrapDialog onClose={handleClose} open={open} aria-labelledby="customized-dialog-title" allign="center">
              <BootstrapDialogTitle onClose={handleClose} id="customized-dialog-title" >
                  {`${getUser.firstName} `}{`${getUser.lastName }`}
              </BootstrapDialogTitle>
              <DialogContent allign='center' dividers>
                  <Grid style={{borderRight: '1px solid #e0e0e0'}}>
                      <Grid item xs={12} style={{padding: '10px'}}>
                          <Avatar alt="Fabian mendoza" src='https://material-ui.com/static/images/avatar/1.jpg'/>
                      </Grid>
                      <Grid item xs={12} style={{padding: '10px'}}>
                          <Typography gutterBottom>
                              Email:  {`${getUser.email}`}
                          </Typography>
                      </Grid>
                  </Grid>
              </DialogContent>
              <DialogActions>
                  <Button onClick={()=> handleRequestAndClose(getUser._id, getUser.email)} autoFocus>
                      Contact Request
                  </Button>
              </DialogActions>
          </BootstrapDialog>
      </div>
  );
}