import { createSlice } from "@reduxjs/toolkit";

export const contactsSlice = createSlice({
    name: 'contacts',
    initialState: [],
    reducers: {
        updateContacts: (state, action)=>{
            console.log('contacts action.payload: ', action.payload);
            return action.payload
        }
    }
})

export const {updateContacts} = contactsSlice.actions
export default contactsSlice.reducer