import { useEffect, useRef, useState } from "react"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Link } from "react-router-dom"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MoreHorizontal, Send, Heart, MessageCircle, Share, Bookmark, Smile, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useDispatch, useSelector } from "react-redux"
import Comments from "./Comments"
import axios from "../config/Axios.js"
import { setPosts, setSelectedPost } from "../redux/postSlice"

const CommentDialog = ({ open, setOpen }) => {
  const posts = useSelector((state) => state.post.posts)
  const { selectedPost } = useSelector((state) => state.post)
  const [comment, setComment] = useState([])
  const dispatch = useDispatch()
  const [text, setText] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const lastCommentref = useRef(null)
  const inputRef = useRef(null)

  const textHandler = (e) => {
    setText(e.target.value)
  }

  useEffect(() => {
    if (selectedPost && Array.isArray(selectedPost.comments)) {
      setComment(selectedPost.comments)
    }
  }, [selectedPost])

  const submitHandler = async () => {
    if (!text.trim()) return

    const accessToken = localStorage.getItem("accessToken")
    if (!accessToken) return

    setIsSubmitting(true)
    try {
      const res = await axios.post(
        `/posts/add-comment-on-post/${selectedPost._id}`,
        { text: text.trim() },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )

      if (res.data.success) {
        const updatedComment = [...comment, res.data.data]
        setComment(updatedComment)
        const updatedPost = posts.map((p) =>
          p._id === selectedPost._id ? { ...p, comments: updatedComment } : p
        )
        dispatch(setPosts(updatedPost))
        dispatch(setSelectedPost({ ...selectedPost, comments: updatedComment }))
        setText("")
        setTimeout(() => {
          lastCommentref?.current?.scrollIntoView({ behavior: "smooth" })
        }, 100)
      }
    } catch (error) {
      console.error("Error adding comment:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      submitHandler()
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen} >
      <DialogContent
        className="min-w-3xl max-w-5xl h-[550px]  p-0 bg-white border-0 shadow-2xl rounded-3xl overflow-hidden flex"
        onInteractOutside={() => setOpen(false)}
      >
        {/* Close Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setOpen(false)}
          className="absolute top-4 right-4 z-10 bg-black/20 hover:bg-black/30 text-white rounded-full w-10 h-10 p-0 backdrop-blur-sm"
        >
          <X className="w-5 h-5" />
        </Button>

        <div className="flex flex-1 ">
          {/* Image Section */}
          <div className="w-1/2 bg-gradient-to-br from-gray-900 to-black flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10" />
            <img
              src={selectedPost?.image || "/placeholder.svg"}
              alt="Post"
              className="w-full h-full  object-cover max-w-5xl max-h-[550px] rounded-l-lg relative z-10"
            />
            <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-transparent rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-pink-500/20 to-transparent rounded-full blur-3xl" />
          </div>

          {/* Comments Section */}
          <div className="w-1/2 flex flex-col h-full bg-gradient-to-b from-white to-gray-50/50">
            {/* Header */}
            <div className="relative bg-gradient-to-r from-white via-purple-50/30 to-pink-50/30 border-b border-gray-100/80 backdrop-blur-sm">
              <div className="flex items-center justify-between p-5">
                <div className="flex gap-3 items-center">
                  <Link>
                    <Avatar className="ring-2 ring-purple-200/50 hover:ring-purple-300 transition-all duration-300 shadow-lg">
                      <AvatarImage src={selectedPost?.author?.profileImg || "/placeholder.svg"} />
                      <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white font-semibold">
                        {selectedPost?.author?.username?.charAt(0)?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Link>
                  <div>
                    <Link className="font-bold text-gray-800 hover:text-purple-600 transition-colors duration-200 text-sm">
                      {selectedPost?.author?.username}
                    </Link>
                    <p className="text-xs text-gray-500 mt-0.5">2 hours ago • Public</p>
                  </div>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:bg-purple-50 rounded-full p-2 transition-all duration-200 hover:scale-105"
                    >
                      <MoreHorizontal className="w-5 h-5 text-gray-600" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="w-72 p-0 bg-white/95 backdrop-blur-xl border-0 shadow-2xl rounded-2xl overflow-hidden">
                    <div className="py-2">
                      <div className="cursor-pointer px-5 py-4 text-red-500 font-semibold hover:bg-red-50 transition-all duration-200 flex items-center gap-3">
                        <Heart className="w-4 h-4" />
                        Unfollow
                      </div>
                      <div className="cursor-pointer px-5 py-4 text-gray-700 hover:bg-gray-50 transition-all duration-200 flex items-center gap-3">
                        <Bookmark className="w-4 h-4" />
                        Add to favorites
                      </div>
                      <div className="cursor-pointer px-5 py-4 text-gray-700 hover:bg-gray-50 transition-all duration-200 flex items-center gap-3">
                        <Share className="w-4 h-4" />
                        Share post
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Post Caption */}
            {selectedPost?.caption && (
              <div className="p-5 border-b border-gray-100/80 bg-gradient-to-r from-purple-50/20 to-pink-50/20">
                <div className="flex gap-3">
                  <Avatar className="w-9 h-9 ring-1 ring-purple-200/50">
                    <AvatarImage src={selectedPost?.author?.profileImg || "/placeholder.svg"} />
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-sm">
                      {selectedPost?.author?.username?.charAt(0)?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 bg-white/60 backdrop-blur-sm rounded-2xl p-3 shadow-sm">
                    <span className="font-semibold text-gray-800 mr-2">{selectedPost?.author?.username}</span>
                    <span className="text-gray-700">{selectedPost?.caption}</span>
                  </div>
                </div>
              </div>
            )}

            

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-gradient-to-b from-transparent to-gray-50/30">
              {selectedPost?.comments?.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mb-4">
                    <MessageCircle className="w-10 h-10 text-purple-400" />
                  </div>
                  <p className="text-lg font-semibold text-gray-600 mb-1">No comments yet</p>
                  <p className="text-sm text-gray-400">Start the conversation!</p>
                </div>
              ) : (
                selectedPost?.comments?.map((comment, index) => (
                  <div
                    key={comment._id}
                    ref={index === selectedPost.comments.length - 1 ? lastCommentref : null}
                    className="animate-in slide-in-from-bottom-2 duration-500"
                  >
                    <Comments comment={comment} />
                  </div>
                ))
              )}
            </div>

            {/* Comment Input */}
            <div className="p-5 border-t border-gray-100/80 bg-gradient-to-r from-white via-purple-50/20 to-pink-50/20 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="flex-1 relative min-w-0">
                  <input
                    ref={inputRef}
                    type="text"
                    value={text}
                    onChange={textHandler}
                    onKeyPress={handleKeyPress}
                    placeholder="Add a comment..."
                    className="w-full bg-white/80 backdrop-blur-sm border-2 border-gray-200/50 rounded-full px-5 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 shadow-sm hover:shadow-md"
                    disabled={isSubmitting}
                  />
                  <Button
                    variant="ghost"
                    // size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-purple-50 rounded-full p-2 transition-all duration-200"
                  >
    
                  </Button>
                </div>
                <Button
                  onClick={submitHandler}
                  disabled={!text.trim() || isSubmitting}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full px-6 py-3 font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CommentDialog
