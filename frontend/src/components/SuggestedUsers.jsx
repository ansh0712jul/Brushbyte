import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

const SuggestedUsers = () => {
  const { suggestedUser } = useSelector((store) => store.auth)

  return (
    <div className='my-12 p-4 bg-white rounded-lg shadow-sm w-80 '>
      <div className='flex items-center justify-between text-sm mb-4'>
        <h1 className='font-semibold text-gray-700'>Suggested for you</h1>
        <span className='font-medium text-[#3BADF8] cursor-pointer hover:text-[#3495d6]'>See All</span>
      </div>

      {Array.isArray(suggestedUser) && suggestedUser.map((user) => (
        <div
          key={user._id}
          className='flex items-center justify-between py-3 border-b border-gray-100 last:border-none'
        >
          <div className='flex items-center gap-3'>
            <Link to={`/profile/${user?._id}`}>
              <Avatar className='w-10 h-10'>
                <AvatarImage src={user?.profileImg} alt='profile_image' />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </Link>

            <div className='max-w-[140px]'>
              <h1 className='font-semibold text-sm text-gray-800 truncate block'>
                <Link to={`/profile/${user?._id}`}>{user?.username}</Link>
              </h1>
              <span className='text-gray-500 text-xs truncate block'>
                {user?.bio || 'Full Stack Developer Expert in backend development'}
              </span>
            </div>
          </div>

          <span className='text-[#3BADF8] text-xs font-bold cursor-pointer hover:text-[#3495d6]'>
            Follow
          </span>
        </div>
      ))}
    </div>
  )
}

export default SuggestedUsers
