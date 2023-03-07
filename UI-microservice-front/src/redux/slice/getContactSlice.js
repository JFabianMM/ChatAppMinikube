import { createSlice } from "@reduxjs/toolkit";

function getContactSlice(state = '', action) {
    switch (action.type) {
      case 'GET_USER_UPDATE':
        console.log('action.data.user: ', action.data.user);
        return action.data.user
      default:
        return state
    }
  }

// export const {increment, decrement} = counterSlice.actions
export default getContactSlice