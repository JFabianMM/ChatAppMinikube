import { createSlice } from "@reduxjs/toolkit";

export const tokenSlice = createSlice({
    name: 'token',
    initialState: '',
    reducers: {
        updateToken: (state, action)=>{
            localStorage.setItem('token', action.payload);
            return action.payload
        }
    }
})

export const {updateToken} = tokenSlice.actions
export default tokenSlice.reducer