
import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Bookmark, MessageCircle, MoreHorizontal, Send } from 'lucide-react'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog"
import { FaHeart, FaRegHeart } from 'react-icons/fa'
import CommentDialog from './CommentDialog'
import { useDispatch, useSelector } from 'react-redux'
import axios from "../config/Axios.js"
import { toast } from 'sonner'

const Post = ({post}) => {

    const [text , setText] = useState("")
    const[open , setOpen] = useState(false)


    const user = useSelector((state) => state.auth.user)

    // Handler for input text change
    const textHandler = (e) => {
        const inputText = e.target.value;
        if(inputText.trim()){
            setText(inputText);
        }
        else {
            setText("");
        }
    }

    // Handler for deleting the post

    const deletePostHandler = async() => {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) return;

        try {
            const res = await axios.delete(`/posts/delete-post/${post._id}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            console.log("Post deleted successfully");
           if(res.data.success) {
            toast.success("Post deleted successfully");
            setOpen(false);
           }
            
            
        } catch (error) {
            console.error("Error deleting post:", error);
        }
    }
  return (
    <div className='my-8 w-full max-w-sm mx-auto'>
        <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
                <Avatar>
                    <AvatarImage src={post.author.profileImg} alt="User Avatar" />
                    <AvatarFallback >Cn</AvatarFallback> 
                </Avatar>
                <h1>{post.author.username}</h1>
            </div>
            <Dialog>
                <DialogTrigger asChild>
                    <MoreHorizontal className="cursor-pointer hover:text-amber-700 transition duration-200" />
                </DialogTrigger>

                <DialogContent className="flex flex-col items-center gap-2 py-6 px-4 w-[300px] rounded-xl shadow-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700">
                    <Button
                    variant="ghost"
                    className="w-full justify-center text-amber-700 font-semibold text-sm hover:bg-amber-100 dark:hover:bg-amber-900/20 transition-colors rounded-md"
                    >
                    Unfollow
                    </Button>

                    <Button
                    variant="ghost"
                    className="w-full justify-center text-blue-600 font-semibold text-sm hover:bg-blue-100 dark:hover:bg-blue-900/20 transition-colors rounded-md"
                    >
                    Add to Favourites
                    </Button>

                    {
                        user?._id === post.author._id && (
                            <Button
                            onClick = {deletePostHandler}
                            variant="ghost"
                            className="w-full justify-center text-red-600 font-semibold text-sm hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors rounded-md"
                            >
                            Delete
                            </Button>
                        )
                    }
                </DialogContent>
            </Dialog>
        </div>
         <img className='rounded-sm my-2 w-full aspect-square object-cover' src={post.image} />

        
        <div className='flex items-center justify-between my-2 '>
            <div className='flex items-center gap-3'>
                    <FaRegHeart size={'22px'} className='cursor-pointer'/>
                    <MessageCircle 
                     onClick={() => setOpen(true)}
                     className='cursor-pointer hover:text-gray-600'
                     />
                    <Send className='cursor-pointer hover:text-gray-600'/>
            </div>
            <Bookmark/>
        </div>
        <span className='font-medium mb-2 block'>{post.likes.length} likes</span>
        <p className=''>
            <span className='font-md mr-2'>{post.author.username}</span>
            {post.caption}
        </p>
        <span onClick={() => setOpen(true)} className='cursor-pointer text-sm text-gray-400'>View all comments</span>
        <CommentDialog  open={open} setOpen={setOpen}/>
        <div className='flex items-center gap-3 mt-4'>
            <input
                type="text"
                value={text}
                onChange={textHandler}
                placeholder='Add a comment...'
                className='outline-none w-full text-sm'
            />
           {
                text && (
                     <span className='text-blue-600 font-bold'>Post</span>
                )
           }
        </div>
    </div> 
    
  )
}

export default Post
