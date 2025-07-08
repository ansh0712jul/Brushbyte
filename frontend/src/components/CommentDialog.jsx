import React, { useState } from 'react'
import { Dialog, DialogContent , DialogTrigger } from './ui/dialog'
import { Link } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { MoreHorizontal } from 'lucide-react'
import { Button } from './ui/button'

const CommentDialog = ({open , setOpen}) => {

  const [text , setText] = useState("");

  // Handler for input text change
  const textHandler = (e) => {

    const inputText = e.target.value;
    if(inputText.trim()){
      setText(inputText);

    }
    else setText("");
  }


  // Handler for submitting the comment

  const submitHandler = () =>{
    console.log("Comment submitted: ", text);
    setText("");
  }


  return (

      <Dialog open={open}>
      <DialogContent open = {open} onInteractOutside={() => setOpen(false)} className=" min-w-3xl max-w-5xl h-[550px] p-0 flex flex-col">
        <div className='flex flex-1'>
          <div className='w-1/2'>
            <img
              src="https://images.unsplash.com/photo-1750409221671-d925a6d7126c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0fHx8ZW58MHx8fHx8"
              alt="post_img"
              className='w-full h-full object-cover rounded-l-lg'
            />
          </div>
          <div className='w-1/2 flex flex-col justify-between'>
            <div className='flex items-center justify-between p-4'>
              <div className='flex gap-3 items-center'>
                <Link>
                  <Avatar>
                    <AvatarImage src="" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </Link>
                <div>
                  <Link className='font-semibold text-xs'>Author</Link>
                  {/* <span className='text-gray-600 text-sm'>Bio here...</span> */}
                </div>
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <MoreHorizontal className='cursor-pointer' />
                </DialogTrigger>
                <DialogContent className="flex flex-col items-center text-sm text-center">
                  <div className='cursor-pointer w-full text-[#ED4956] font-bold'>
                    Unfollow
                  </div>
                  <div className='cursor-pointer w-full'>
                    Add to favorites
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <hr className='border-gray-400 ' />
            <div className='flex-1 overflow-y-auto max-h-96 p-4'>
              
              {/* {
                comment.map((comment) => <Comment key={comment._id} comment={comment} />)
                
              } */}
            </div>
            <div className='p-4'>
              <div className='flex items-center gap-2'>
                <input type="text" 
                  value={text}
                  onChange={textHandler}
                  placeholder='Add a comment...'
                  className='w-full outline-none border text-sm border-gray-300 p-2 rounded'
                />

                <Button 
                disabled = { text.trim() === ""}
                onClick = { submitHandler }  
                variant = "outline"
                className="outline-none text-sm text-blue-500 hover:bg-white  disabled:opacity-50 disabled:cursor-not-allowed"
                >Send</Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>

    
  )
}

export default CommentDialog
