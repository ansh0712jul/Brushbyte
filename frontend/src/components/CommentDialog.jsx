import React, { useEffect, useRef, useState } from 'react'
import { Dialog, DialogContent , DialogTrigger } from './ui/dialog'
import { Link } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { MoreHorizontal } from 'lucide-react'
import { Button } from './ui/button'
import { useDispatch, useSelector } from 'react-redux'
import Comments from './Comments'
import axios from "../config/Axios.js"
import { setPosts, setSelectedPost } from '../redux/postSlice'


const CommentDialog = ({open , setOpen}) => {

   const posts = useSelector((state) => state.post.posts)
   const { selectedPost } = useSelector((state) => state.post);
   const[comment , setComment] = useState([])
   const dispatch = useDispatch()
  const [text , setText] = useState("");

  const lastCommentref = useRef(null);

  // Handler for input text change
  const textHandler = (e) => {

    const inputText = e.target.value;
    if(inputText.trim()){
      setText(inputText);
    }
    else setText("");
  }

  useEffect(() =>{
    if (selectedPost && Array.isArray(selectedPost.comments)) {
    setComment(selectedPost.comments);
  }
  },[selectedPost])


  // Handler for submitting the comment

  const submitHandler = async() => {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) return;
      try {
          const res = await axios.post(`/posts/add-comment-on-post/${selectedPost._id}` , {text} , {
              headers: {
                  Authorization: `Bearer ${accessToken}`
              }
          })
          
          if(res.data.success) {
              const updatedComment = [...comment , res.data.data];
              setComment(updatedComment);
              const updatedPost = posts.map( p => p._id === selectedPost._id ? {...p , comments: updatedComment} : p);
              dispatch(setPosts(updatedPost));
              dispatch(setSelectedPost({
                ...selectedPost,
                comments: updatedComment
              }));
              setText("");

              // scroll to last commment after some delay 
              setTimeout(() => {
                lastCommentref?.current?.scrollIntoView({ behavior: "smooth" })
              })
          }
      } catch (error) {
          console.error("Error adding comment:", error);
      }
  }


  return (

      <Dialog open={open}>
      <DialogContent open = {open} onInteractOutside={() => setOpen(false)} className=" min-w-3xl max-w-5xl h-[550px] p-0 flex flex-col">
        <div className='flex flex-1'>
          <div className='w-1/2'>
            <img
              src={selectedPost?.image}
              alt="post_img"
              className='w-full h-full  object-cover max-w-5xl max-h-[550px] rounded-l-lg'
            />
          </div>
          <div className='w-1/2 flex flex-col justify-between'>
            <div className='flex items-center justify-between p-4'>
              <div className='flex gap-3 items-center'>
                <Link>
                  <Avatar>
                    <AvatarImage src={selectedPost?.author?.profileImg} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </Link>
                <div>
                  <Link className='font-semibold text-xs'>{selectedPost?.author?.username}</Link>
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
              
              {
                selectedPost?.comments.map((comment , index) => (
                   <div
                      key={comment._id}
                      ref={index === selectedPost.comments.length - 1 ? lastCommentref : null}
                    >
                      <Comments comment={comment} />
                    </div>
                ))
                
              }
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
