import { useDispatch, useSelector } from "react-redux"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useRef, useState } from "react"
import axios from "axios"
import { Loader2, ImagePlus, X, Camera, Sparkles } from "lucide-react"
import { toast } from "sonner"
import { setPosts } from "../redux/postSlice.js"

const CreatePost = ({ open, setOpen }) => {
  const dispatch = useDispatch()
  const posts = useSelector((state) => state.post.posts)
  const [caption, setCaption] = useState("")
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewImage, setPreviewImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const imageRef = useRef(null)

  const user = useSelector((state) => state.auth.user)

  const imageHandler = (e) => {
    const file = e.target.files[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setPreviewImage(url)
      setSelectedFile(file)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file)
      setPreviewImage(url)
      setSelectedFile(file)
    }
  }

  const removeImage = () => {
    setPreviewImage(null)
    setSelectedFile(null)
  }

  const token = localStorage.getItem("accessToken")
  if (!token) {
    console.error("No access token found")
  }

  const createPostHandler = async () => {
    const formData = new FormData()
    formData.append("caption", caption)
    if (previewImage) formData.append("image", selectedFile)

    try {
      setLoading(true)
      const res = await axios.post("/posts/add-new-post", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      })

      if (res.data.success) {
        dispatch(setPosts([res.data.data, ...posts]))
        setOpen(false)
        setCaption("")
        setSelectedFile(null)
        setPreviewImage(null)
        toast.success(res.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.message)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setCaption("")
    setSelectedFile(null)
    setPreviewImage(null)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="max-w-lg mx-auto bg-white border-0 shadow-2xl rounded-2xl overflow-hidden"
        onInteractOutside={() => setOpen(false)}
      >
        {/* Header */}
        <DialogHeader className="relative bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white p-6 -m-6 mb-6">
          <div className="absolute inset-0 bg-black/10"></div>
          <DialogTitle className="relative text-xl font-bold text-center flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5" />
            Create New Post
            <Sparkles className="w-5 h-5" />
          </DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={resetForm}
            className="absolute top-2 right-2 text-white hover:bg-white/20 rounded-full w-8 h-8 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </DialogHeader>

        <div className="space-y-6 p-1">
          {/* User Info */}
          <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
            <Avatar className="ring-2 ring-purple-200">
              <AvatarImage src={user?.profileImg || "/placeholder.svg"} alt="Profile" />
              <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                {user?.username?.charAt(0)?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="font-semibold text-gray-800">{user?.username}</h1>
              <span className="text-gray-500 text-sm">{user?.bio || "Share your moment..."}</span>
            </div>
          </div>

          {/* Caption Input */}
          <div className="space-y-2">
            <Textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="min-h-[100px] border-2 border-gray-200 focus:border-purple-400 rounded-xl resize-none bg-gray-50/50 focus:bg-white transition-all duration-200"
              placeholder="What's on your mind? Share your story..."
              maxLength={500}
            />
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span>Express yourself freely</span>
              <span>{caption.length}/500</span>
            </div>
          </div>

          {/* Image Upload/Preview Area */}
          {!previewImage ? (
            <div
              className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer ${
                isDragOver
                  ? "border-purple-400 bg-purple-50"
                  : "border-gray-300 hover:border-purple-400 hover:bg-gray-50"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => imageRef.current?.click()}
            >
              <div className="space-y-4">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <ImagePlus className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-700">Add a photo</p>
                  <p className="text-sm text-gray-500 mt-1">Drag and drop or click to select</p>
                </div>
              </div>
              <input type="file" ref={imageRef} className="hidden" accept="image/*" onChange={imageHandler} />
            </div>
          ) : (
            <div className="relative rounded-xl overflow-hidden bg-gray-100">
              <img src={previewImage || "/placeholder.svg"} alt="Preview" className="w-full h-64 object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              <Button
                variant="secondary"
                size="sm"
                onClick={removeImage}
                className="absolute top-3 right-3 bg-white/90 hover:bg-white text-gray-700 rounded-full w-8 h-8 p-0 shadow-lg"
              >
                <X className="w-4 h-4" />
              </Button>
              <div className="absolute bottom-3 left-3 right-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => imageRef.current?.click()}
                  className="bg-white/90 hover:bg-white text-gray-700 border-0 rounded-lg"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Change Photo
                </Button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={resetForm}
              className="flex-1 border-2 border-gray-200 hover:border-gray-300 text-gray-600 hover:text-gray-700 bg-transparent"
            >
              Cancel
            </Button>
            <Button
              onClick={createPostHandler}
              disabled={loading || (!caption.trim() && !previewImage)}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Posting...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Share Post
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CreatePost
