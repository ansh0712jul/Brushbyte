import React, { useState } from 'react'
import { Heart, Home, LogOut, MessageCircle, PlusSquare, Search, TrendingUp,   } from 'lucide-react'; 
import { Avatar, AvatarFallback, AvatarImage   } from './ui/avatar';
import axios from '../config/Axios'
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../redux/authSlice';
import CreatePost from './CreatePost';


const LeftSidebar = () => {

    const Navigate = useNavigate()
    const dispatch = useDispatch();

    const [open, setOpen] = useState(false);


    // get user from the redux store
    const { user } = useSelector((state) => state.auth)

    // function to handle logout 
    const logOutHandler = async() =>{
        try {
            const accessToken = localStorage.getItem('accessToken')
            // console.log(accessToken)

            const res = await axios.post('/logout', {}, {
                headers: {
                    'Authorization' : `Bearer ${accessToken}`,   
                },
                
            })

            // remove token from the local storage on successful logout
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');

            // console.log(res)

            if(res.data.success) {
                dispatch(setUser(null))
                Navigate('/login')
                toast.success("Logged out successfully")
            }
        } catch (error) {
               toast.error(error.response.data.message)
        }
    }

    // function to handle sidebar item click
    const sideBarHandler = (item) =>{
        if(item.text === "Logout") {
            logOutHandler()
        }

        if(item.text === "Create") {
            console.log("Create Post clicked");
            console.log("open state going to be set to true");
            setOpen(true);
            console.log("open state is now: ", open);
        }
    }





    const sideBarItems = [
    {
        icon : <Home/>,
        text : "Home"
    },
    {
        icon : <Search/>,
        text : "Search"
    },
    {
        icon : <TrendingUp/>,
        text : "Explore"
    },
    {
        icon : <MessageCircle/>,
        text : "Messages"
    },
    {
        icon : <Heart/>,
        text : "Notitications"
    },
    {
        icon : <PlusSquare/>,
        text : "Create"
    },
    {
        icon : (
            <Avatar>
                <AvatarImage src={user?.profileImg} />
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>
        ),
        text : "Profile"
    },
    {
        icon : <LogOut/>,
        text : "Logout"
    }
]



  return (
    <div className='fixed top-0 left-0  z-10 h-screen w-[17%] bg-white shadow-lg p-5 overflow-y-auto  border-r border-gray-300'>
        <div className='flex flex-col'>
            <h1>LOGO</h1>
            
        {
            sideBarItems.map((item , index) =>{
                return (
                    <div onClick={()=>sideBarHandler(item)} key={index} className='flex items-center gap-3 relative hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-3'>
                        {item.icon}
                        <span className='text-base font-semibold'>
                            {item.text}
                        </span>
                    </div>

                )
            })
        }
        </div>
        <CreatePost open={open} setOpen={setOpen} />
    </div>
  )
}

export default LeftSidebar