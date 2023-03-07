import { createSlice } from "@reduxjs/toolkit";

function counterSlice(state = 0, action) {
    switch (action.type) {
      case 'INCREMENT':
        return state + 1
      case 'INCREMENT_IF_ODD':
        return (state % 2 !== 0) ? state + 1 : state
      case 'DECREMENT':
        return state - 1
      default:
        return state
    }
  }

// export const counterSlice = createSlice({
//     name: 'counter',
//     initialState: 0,
//     reducers: {
//         // increment: (state, action)=>{
//         //   return state + 1
//           console.log('llego aqui');
//           console.log('action.type: ', action.type);
//           switch (action.type) {
//             case 'INCREMENT':
//               return state + 1
//             case 'INCREMENT_IF_ODD':
//               return (state % 2 !== 0) ? state + 1 : state
//             case 'DECREMENT':
//               return state - 1
//             default:
//               return state
//           },
//         //},
//         // decrement: (state, action)=>{
//         //   return state - 1
//         // }
//     }
// })

// export const {increment, decrement} = counterSlice.actions
export default counterSlice