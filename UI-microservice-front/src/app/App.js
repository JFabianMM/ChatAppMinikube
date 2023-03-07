import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SignIn } from "./components/SignIn";
import { SignUp } from "./components/SignUp";
import { Chat } from "./components/Chat";
import {useSelector} from 'react-redux';

export function App() {
    const { t, i18n } = useTranslation();
    const page = useSelector(state => state.page);
    const [language, setLanguage] = useState('es');
    
    const languageSet = (val) => {
        setLanguage(val);
    };

    if (page=='signIn'){
        return (
            <div>
                <SignIn i18n={i18n} t={t} language={language} languageSet={languageSet}/>
            </div>
        );
        
    }
    if (page=='signUp'){
        return (
            <div>
                <SignUp i18n={i18n} t={t} language={language} languageSet={languageSet}/> 
            </div>
        )       
    }
    if (page=='chat'){
        return (
            <div>
                <Chat i18n={i18n} t={t} language={language} languageSet={languageSet}/>
            </div>
        )       
    }
}

export default App;