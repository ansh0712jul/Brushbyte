import { useEffect } from "react";
import axios from "../config/Axios";
import { useDispatch, useSelector } from "react-redux";
import { setSuggestedUser } from "../redux/authSlice";

const getSuggestedUser = () => {

    const { user } = useSelector((store) => store.auth);

     const token = localStorage.getItem('accessToken');
    if (!token)  console.error("No access token found");

    const dispatch = useDispatch();

    useEffect(() =>{
         const fetchSuggestedUser = async() => {

            try {
                const res = await axios.get("/user/get-suggested-users",{
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                if(res.data.success) {
                    
                    const filteredUser = Array.isArray(res.data.data) && res.data.data.filter((id) => user?._id !== id._id )
                    dispatch(setSuggestedUser(filteredUser));
                }

            } catch (error) {
                console.log(error)
            }

        }
        fetchSuggestedUser();
    },[]) 
}

export default getSuggestedUser;