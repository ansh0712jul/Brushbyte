import React from 'react'
import { Link } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { useSelector } from 'react-redux'
import SuggestedUsers from './SuggestedUsers'

const RightSideBar = () => {

  const { user } = useSelector((store) => store.auth)
  
    return (
    <div className='w-64 my-10 mr-28 '>
      <div className='flex items-center gap-3 mb-6'>
        <Link to={`/profile/${user?._id}`}>
          <Avatar>
            <AvatarImage src={user?.profileImg} alt='post_image' />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </Link>
        <div>
          <h1 className='font-semibold text-sm'>
            <Link to={`/profile/${user?._id}`}>{user?.username}</Link>
          </h1>
          <span className='text-gray-600 text-sm block max-w-[200px] truncate'>
            {user?.bio || 'Ansh Agrawal Full stack developer'}
          </span>
        </div>
      </div>
      <SuggestedUsers />
    </div>
  )
  
}

export default RightSideBar