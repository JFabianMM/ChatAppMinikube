import React, {useEffect} from 'react'; 
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {LanguageButton} from './LanguageButton';
import { t } from 'i18next';
import {gql} from '@apollo/client';
import { useLazyQuery } from '@apollo/client';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { updateToken } from '../../redux/slice/tokenSlice';
import { updateUserData } from '../../redux/slice/userDataSlice';
import { updateContacts } from '../../redux/slice/contactsSlice';
import { updateGroups } from '../../redux/slice/groupsSlice';
import { updateNotifications } from '../../redux/slice/notificationsSlice';
import { updateGroupNotifications } from '../../redux/slice/groupNotificationsSlice';
import { updateRooms } from '../../redux/slice/roomsSlice';
import { updateMessages } from '../../redux/slice/messagesSlice';
import { updatePage } from '../../redux/slice/pageSlice';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        ChatProject
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const theme = createTheme();

export function SignIn(props) {

    const Dispatch = useDispatch();            
    
    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const formData={
            email: data.get('email'),
            password: data.get('password')
        }

        // Falta validar el password y confirm password
        let email=formData.email;
        let password=formData.password;

        Dispatch({type: 'QUERY_LOGIN', email, password});
    };  

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <LanguageButton i18n={props.i18n} t={props.t} language={props.language} languageSet={props.languageSet}/>
                <Box sx={{marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        {props.t('signin.signin')}
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField margin="normal" required fullWidth id="email" label={props.t('signin.email')} name="email" autoComplete="email" autoFocus />
                        <TextField margin="normal" required fullWidth name="password" label={props.t('signin.password')} type="password" id="password" autoComplete="current-password"/>
                        <FormControlLabel control={<Checkbox value="remember" color="primary" />} label={props.t('signin.rememberme')}/>
                        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                            {props.t('signin.signin.button')}
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link href="#" variant="body2">
                                    {props.t('signin.forgot.password')}
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link onClick={() => Dispatch(updatePage('signUp'))} href="#" variant="body2">
                                    {props.t('signin.dont.have.account')}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
                <Copyright sx={{ mt: 8, mb: 4 }} />
            </Container>
        </ThemeProvider>
    );
}