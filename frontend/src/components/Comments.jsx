import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Heart, MoreHorizontal } from "lucide-react"
import { useState } from "react"

const Comments = ({ comment }) => {
  const [isLiked, setIsLiked] = useState(false)

  return (
    <div className="flex gap-3 py-2 group hover:bg-white/50 rounded-lg px-2 -mx-2 transition-all duration-200">
      <Avatar className="w-8 h-8 ring-1 ring-gray-200">
        <AvatarImage src={comment?.author?.profileImg || "/placeholder.svg"} />
        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-xs">
          {comment?.author?.username?.charAt(0)?.toUpperCase() || "U"}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="bg-gray-100 rounded-2xl px-3 py-2 inline-block max-w-full">
              <span className="font-semibold text-sm text-gray-800 mr-2">{comment?.author?.username}</span>
              <span className="text-sm text-gray-700 break-words">{comment?.text}</span>
            </div>
            <div className="flex items-center gap-4 mt-1 ml-3">
              <span className="text-xs text-gray-500">2m</span>
              <button className="text-xs text-gray-500 hover:text-gray-700 font-medium">Reply</button>
            </div>
          </div>

          <div className="flex items-center gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsLiked(!isLiked)}
              className={`p-1 hover:bg-red-50 rounded-full ${
                isLiked ? "text-red-500" : "text-gray-400 hover:text-red-500"
              }`}
            >
              <Heart className={`w-3 h-3 ${isLiked ? "fill-current" : ""}`} />
            </Button>
            <Button variant="ghost" size="sm" className="p-1 hover:bg-gray-100 rounded-full">
              <MoreHorizontal className="w-3 h-3 text-gray-400" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Comments
