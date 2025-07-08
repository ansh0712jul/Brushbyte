
import { useDispatch, useSelector } from 'react-redux'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Dialog, DialogContent, DialogHeader } from './ui/dialog'
import { Textarea } from './ui/textarea'
import { useRef, useState } from 'react'
import axios from "../config/Axios.js"
import { Loader2 } from 'lucide-react'
import { toast } from "sonner"
import { setPosts } from '../redux/postSlice.js'
 
const CreatePost = ({ open, setOpen }) => {

    const dispatch = useDispatch();
    const posts = useSelector((state) => state.post.posts)

    const [caption, setCaption] = useState("")
    const [selectedFile, setSelectedFile] = useState(null)
    const [previewImage, setPreviewImage] = useState(null)
    const[loading , setLoading] = useState(false)
    const imageRef = useRef(null)
     
    const user = useSelector((state) => state.auth.user)
   

    const imageHandler = (e) => {
        const file = e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setPreviewImage(url);
            setSelectedFile(file);
        }
    }

    const token = localStorage.getItem('accessToken');
    if (!token) {
        console.error("No access token found");
    }
    const createPostHandler = async() => {
      const formData = new FormData();
      formData.append('caption' , caption);
      if( previewImage) formData.append('image', selectedFile);

      try {
        setLoading(true);
        const res = await axios.post('/posts/add-new-post' , formData , {
          headers : {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        })
        
        // console.log(res.data.data);
        if(res.data.success ){
          dispatch(setPosts([res.data.data , ...posts ]));
          setOpen(false);
          setCaption("");
          setSelectedFile(null);
          setPreviewImage(null);
          toast.success(res.data.message);

        }
        

      } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.message )
      } finally{
        setLoading(false);
      }
    }

 return (
    <Dialog open={open}>
      <DialogContent onInteractOutside={() => setOpen(false)}>
        <DialogHeader className='text-center font-semibold'>Create New Post</DialogHeader>
        <div className='flex gap-3 items-center'>
          <Avatar>
            <AvatarImage src={user?.profileImg} alt="img" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <h1 className='font-semibold text-xs'>{user?.username}</h1>
            <span className='text-gray-600 text-xs'>Bio here...</span>
          </div>
        </div>
        <Textarea value={caption} onChange={(e) => setCaption(e.target.value)} className="focus-visible:ring-transparent border-none" placeholder="Write a caption..." />
 
         {previewImage && (
        <div className="   flex items-center justify-center">
          
          <img
            src={previewImage}
            alt="Preview"
            className='w-full h-64 object-contain rounded-lg mt-4'
            
          />
        </div>
      )}
        <input 
            type='file' 
            ref={imageRef}
           className='hidden'
           onChange={imageHandler} 
        />
        {
  !previewImage ? (
    <button 
      onClick={() => imageRef.current.click()}
      className='bg-blue-500 text-white px-4 py-2 rounded min-w-[160px] h-10'
    >
      Select Post from Gallery
    </button>
  ) : (
    loading ? (
      <button
        className='bg-blue-500 text-white px-4 py-2 rounded flex items-center justify-center gap-2 min-w-[160px] h-10'
        disabled
      >
        <Loader2 className='h-4 w-4 animate-spin' />
        Please wait
      </button>
    ) : (
      <button 
        onClick={createPostHandler}
        className='bg-blue-500 text-white px-4 py-2 rounded min-w-[160px] h-10'
      >  
        Add Post
      </button>
    )
  )
}


       
      </DialogContent>
    </Dialog>
  )
}

export default CreatePost