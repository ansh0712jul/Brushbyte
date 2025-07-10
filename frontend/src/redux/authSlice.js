import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        suggestedUser:[]
    },
    reducers: {
        // Action to set the user in the state
        setUser : (state, action) => {
            state.user = action.payload;
        },
        setSuggestedUser : (state , action) => {
            state.suggestedUser = action.payload;
        }
    }
})

export const { setUser , setSuggestedUser } = authSlice.actions;
export default authSlice.reducer;