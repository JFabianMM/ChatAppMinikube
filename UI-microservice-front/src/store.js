import { configureStore } from "@reduxjs/toolkit";
import tokenReducer from "./redux/slice/tokenSlice";
import userDataReducer from "./redux/slice/userDataSlice";
import contactsReducer from "./redux/slice/contactsSlice";
import groupsReducer from "./redux/slice/groupsSlice";
import notificationsReducer from "./redux/slice/notificationsSlice";
import groupNotificationsReducer from "./redux/slice/groupNotificationsSlice";
import roomsReducer from "./redux/slice/roomsSlice";
import messagesReducer from "./redux/slice/messagesSlice";
import currentRoomReducer from "./redux/slice/currentRoomSlice";
import currentChatReducer from "./redux/slice/currentChatSlice";
import pageReducer from "./redux/slice/pageSlice";
import counterReducer from "./redux/slice/counterSlice";
import getUserReducer from "./redux/slice/getUserSlice";
import getContactReducer from "./redux/slice/getContactSlice";
import requestersReducer from "./redux/slice/requestersSlice";
import groupRequestersReducer from "./redux/slice/groupRequestersSlice";

import createSagaMiddleware from "redux-saga";
import rootSaga from './redux/sagas/sagas';

const sagaMiddleware = createSagaMiddleware();
const middlewares = [sagaMiddleware];

export const store =configureStore({
     reducer: {
         token: tokenReducer,
         userData: userDataReducer,
         contacts: contactsReducer,
         groups: groupsReducer,
         notifications: notificationsReducer,
         groupNotifications: groupNotificationsReducer,
         rooms: roomsReducer,
         messages: messagesReducer,
         currentRoom: currentRoomReducer,
         currentChat: currentChatReducer,
         page: pageReducer,
         counter: counterReducer,
         getUser: getUserReducer,
         getContact: getContactReducer,
         requesters: requestersReducer,
         groupRequesters: groupRequestersReducer
     },
        middleware: (getDefaultMiddleware) => {
            const middleware = [
                ...getDefaultMiddleware({ thunk: false }),
                ...middlewares,
            ];
        return middleware;
    },
})

sagaMiddleware.run(rootSaga);


