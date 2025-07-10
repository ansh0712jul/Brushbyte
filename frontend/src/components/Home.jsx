import React from 'react'
import Feed from './Feed'
import { Outlet } from 'react-router-dom'
import RightSideBar from './RightSideBar'
import getAllPost from '../hooks/getAllPost'
import getSuggestedUser from '../hooks/getSuggestedUser'

const Home = () => {
  getAllPost()
  getSuggestedUser();
  return (
    <div className='flex ' >
      <div className='flex-grow'>
        <Feed/>
        <Outlet/>
      </div>
      <RightSideBar/>
    </div>
  )
}

export default Home