import { createSlice } from "@reduxjs/toolkit";

export const messagesSlice = createSlice({
    name: 'messages',
    initialState: [],
    reducers: {
        updateMessages: (state, action)=>{
            return action.payload
        },
        addMessage: (state, action)=>{
            const {room, index, message} = action.payload;
            console.log('action.payload', action.payload);
            console.log('payload room:', room);
            console.log('payload message: ', message)
            const foundMessage = state.find(message => message.room === room);
            if (foundMessage){
                foundMessage.messages = message
            }
        },
        addNewContactMessage: (state, action)=>{
            return state.concat(action.payload)
        }
    }
})

export const {updateMessages, addMessage, addNewContactMessage} = messagesSlice.actions
export default messagesSlice.reducer