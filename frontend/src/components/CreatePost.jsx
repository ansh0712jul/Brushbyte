
import { useSelector } from 'react-redux'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Dialog, DialogContent, DialogHeader } from './ui/dialog'
import { Textarea } from './ui/textarea'
import { useRef, useState } from 'react'

const CreatePost = ({ open, setOpen }) => {

    const [caption, setCaption] = useState("")
    const [previewImage, setPreviewImage] = useState(null)
    const imageRef = useRef(null)
     
    const user = useSelector((state) => state.auth.user)


    const imageHandler = (e) => {
        const file = e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setPreviewImage(url);
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
                    className='bg-blue-500 text-white px-4 py-2 rounded'
                    >  Select Post from Gallery
                </button>
            ) : (
                <button 
                    onClick={() => imageRef.current.click()}
                    className='bg-blue-500 text-white px-4 py-2 rounded'
                    >  Add post
                </button>
            )
        }

       
      </DialogContent>
    </Dialog>
  )
}

export default CreatePost