
import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Bookmark, MessageCircle, MoreHorizontal, Send } from 'lucide-react'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog"
import { FaHeart, FaRegHeart } from 'react-icons/fa'
import CommentDialog from './CommentDialog'

const Post = () => {

    const [text , setText] = useState("")


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
  return (
    <div className='my-8 w-full max-w-sm mx-auto'>
        <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
                <Avatar>
                    <AvatarImage src="" alt="User Avatar" />
                    <AvatarFallback >Cn</AvatarFallback> 
                </Avatar>
                <h1>username</h1>
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

                    <Button
                    variant="ghost"
                    className="w-full justify-center text-red-600 font-semibold text-sm hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors rounded-md"
                    >
                    Delete
                    </Button>
                </DialogContent>
            </Dialog>
        </div>
         <img className='rounded-sm my-2 w-full aspect-square object-cover' src="https://images.unsplash.com/photo-1750409221671-d925a6d7126c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0fHx8ZW58MHx8fHx8" alt="" />

        
        <div className='flex items-center justify-between my-2 '>
            <div className='flex items-center gap-3'>
                    <FaRegHeart size={'22px'} className='cursor-pointer'/>
                    <MessageCircle className='cursor-pointer hover:text-gray-600'/>
                    <Send className='cursor-pointer hover:text-gray-600'/>
            </div>
            <Bookmark/>
        </div>
        <span className='font-medium mb-2 block'>1k likes</span>
        <p className=''>
            <span className='font-md mr-2'>username</span>
            caption
        </p>
        <span>view all comments</span>
        <CommentDialog/>
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