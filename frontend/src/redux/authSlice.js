import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
    },
    reducers: {
        // Action to set the user in the state
        setUser : (state, action) => {
            state.user = action.payload;
        }
    }
})

export const { setUser } = authSlice.actions;
export default authSlice.reducer;