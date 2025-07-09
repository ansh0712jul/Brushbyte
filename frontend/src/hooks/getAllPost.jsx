import { useEffect } from "react";
import axios from "../config/Axios.js"
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "../redux/postSlice.js";



const getAllPost = () =>{

    const dispatch = useDispatch();
    const post = useSelector((state) => state.post.posts);

    const token = localStorage.getItem('accessToken');
    if (!token)  console.error("No access token found");

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await axios.get('/posts/get-all-posts'  , {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })

                if (res.data.success) {
                    dispatch(setPosts(res.data.data));
                }
            } catch (error) {
                console.error("Error fetching posts:", error);
            }
        }

        fetchPosts();
    },[post , dispatch])
}

export default getAllPost;