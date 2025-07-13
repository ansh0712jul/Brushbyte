import { useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import axios from "../config/Axios.js"
import { Loader2, Camera, User, FileText } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Textarea } from "./ui/textarea"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { setUser } from "../redux/authSlice.js"
import { useNavigate } from "react-router-dom"

const Editprofile = () => {
  const { user } = useSelector((store) => store.auth)
  const [username, setUsername] = useState(user?.username || "")
  const [bio, setBio] = useState(user?.bio || "")
  const [profileImg, setProfileImg] = useState(user?.profileImg)
  const [loading, setLoading] = useState(false)
  const [previewImg, setPreviewImg] = useState(user?.profileImg)
  const imageRef = useRef()
  const dispatch = useDispatch();
  const navigate = useNavigate()
  

  const fileChangeHandler = (e) => {
      const file = e.target.files[0]
      if (file) {
        setProfileImg(file)
        const reader = new FileReader();
        reader.onloadend = () => setPreviewImg(reader.result);
        reader.readAsDataURL(file);
      }
  }

  const editProfileHandler = async () => {
      const formData = new FormData()
      formData.append("bio", bio)
      formData.append("username", username)

      if (profileImg instanceof File) {
        formData.append("profileImg", profileImg)
      }

      try {
        setLoading(true)
        const accessToken = localStorage.getItem("accessToken")
        if (!accessToken) return

        const res = await axios.patch("/user/update-profile", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${accessToken}`,
          },
        })
        console.log("Response:", res.data)
        if(res.data.success) {
          const updatedProfile = {
            ...user,
            bio : res.data.message.bio,
            profileImg : res.data.message.profileImg,
            username : res.data.message.username
          }
          dispatch(setUser(updatedProfile))
          navigate(`/profile/${user?._id}`)
        }
      } catch (error) {
        console.log("Error:", error)
      }
      finally{
        setLoading(false)
      }
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Profile</h1>
          <p className="text-gray-600">Update your profile information and make it shine</p>
        </div>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-6">
            <CardTitle className="text-xl text-gray-800">Profile Settings</CardTitle>
            <CardDescription>Customize how others see you on the platform</CardDescription>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Profile Photo Section */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative group">
                <Avatar className="w-24 h-24 ring-4 ring-white shadow-lg">
                  <AvatarImage src={previewImg  ? previewImg :  "/placeholder.svg"} alt="Profile" className="object-cover" />
                  <AvatarFallback className="text-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                    {username?.charAt(0)?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                  <Camera className="w-6 h-6 text-white" />
                </div>
              </div>

              <input ref={imageRef} onChange={fileChangeHandler} type="file"  className="hidden" />

              <Button
                onClick={() => imageRef?.current.click()}
                variant="outline"
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 hover:from-blue-600 hover:to-purple-700 shadow-md"
              >
                <Camera className="w-4 h-4 mr-2" />
                Change Photo
              </Button>
            </div>

            {/* Username Field */}
            <div className="space-y-3">
              <Label htmlFor="username" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <User className="w-4 h-4" />
                Username
              </Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="h-12 border-2 border-gray-200 focus:border-blue-500 transition-colors duration-200 bg-white/50"
              />
              <p className="text-xs text-gray-500">This is how others will find and mention you</p>
            </div>

            {/* Bio Field */}
            <div className="space-y-3">
              <Label htmlFor="bio" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Bio
              </Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about yourself..."
                className="min-h-[120px] border-2 border-gray-200 focus:border-blue-500 transition-colors duration-200 bg-white/50 resize-none"
                maxLength={150}
              />
              <div className="flex justify-between items-center">
                <p className="text-xs text-gray-500">Share a little about yourself with the community</p>
                <span className="text-xs text-gray-400">{bio.length}/150</span>
              </div>
            </div>

            {/* Current Info Display */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-100">
              <h3 className="font-semibold text-gray-800 mb-3">Current Profile</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Username:</span>
                  <span className="font-medium text-gray-800">{username}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Bio:</span>
                  <span className="font-medium text-gray-800 max-w-xs truncate">{bio|| "No bio set"}</span>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                onClick={editProfileHandler}
                disabled={loading}
                className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Updating Profile...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Editprofile
