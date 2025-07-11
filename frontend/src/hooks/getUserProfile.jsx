
import { useEffect } from "react";
import axios from "../config/Axios.js"
import { useDispatch } from "react-redux";
import { setUserProfile } from "../redux/authSlice.js";



const getUserProfile = (userId) =>{

    const dispatch = useDispatch();
    console.log("user id" , userId)
    

    const token = localStorage.getItem('accessToken');
    if (!token)  console.error("No access token found");

    useEffect(() => {
        const getProfile = async () => {
            try {
                const res = await axios.get(`/user/${userId}/get-profile`  , {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })

                if (res.data.success) {
                    dispatch(setUserProfile(res.data.message))
                }
            } catch (error) {
                console.error("Error fetching posts:", error);
            }
        }

        getProfile();
    },[ userId])
}

export default getUserProfile;