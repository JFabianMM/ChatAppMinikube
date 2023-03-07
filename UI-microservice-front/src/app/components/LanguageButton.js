import * as React from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Box from '@mui/material/Box';

export function LanguageButton(props) {

    const onChangeLanguageES = () =>{
        props.languageSet('es');
        props.i18n.changeLanguage(props.language);
    }
    const onChangeLanguageEN = () =>{
        props.languageSet('en');
        props.i18n.changeLanguage(props.language);
    }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        '& > *': {
          m: 1,
        },
      }}
    >
      <ButtonGroup style={{backgroundColor:'white'}} variant="text" aria-label="text button group">
        <Button onClick={onChangeLanguageES}>ES</Button>
        <Button onClick={onChangeLanguageEN}>EN</Button>
      </ButtonGroup>
    </Box>
  );
}