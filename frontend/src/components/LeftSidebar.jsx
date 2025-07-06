import React from 'react'
import { Heart, Home, LogOut, MessageCircle, PlusSquare, Search, TrendingUp,   } from 'lucide-react'; 
import { Avatar, AvatarFallback, AvatarImage   } from './ui/avatar';
import axios from '../config/Axios'
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

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
        text : "Create "
    },
    {
        icon : (
            <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
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

const LeftSidebar = () => {

    const Navigate = useNavigate()

    // function to handle logout 
    const logOutHandler = async() =>{
        try {
            const res = await axios.post('/logout')

            if(res.success) {
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
    }


  return (
    <div className='fixed top-0 left-0  z-10 h-screen w-[16%] bg-white shadow-lg p-5 overflow-y-auto  border-r border-gray-300'>
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
    </div>
  )
}

export default LeftSidebar