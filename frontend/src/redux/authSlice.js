import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        suggestedUser:[],
        userProfile: null
    },
    reducers: {
        // Action to set the user in the state
        setUser : (state, action) => {
            state.user = action.payload;
        },
        setSuggestedUser : (state , action) => {
            state.suggestedUser = action.payload;
        },
        setUserProfile : (state , action) => {
            state.userProfile = action.payload
        }
    }
})

export const { setUser , setSuggestedUser , setUserProfile } = authSlice.actions;
export default authSlice.reducer;