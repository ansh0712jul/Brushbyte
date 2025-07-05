import React, { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Link, useNavigate } from 'react-router-dom'
import axios from '../config/Axios'

const Login = () => {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const submitHandler = async (e) => {
    e.preventDefault()

    try {
      const response = await axios.post('/sign-in', {
        email,
        password
      })

      console.log('User logged in successfully:', response.data)
      navigate('/home')
    } catch (error) {
      console.error('Error logging in:', error)
      
    }
  }

  return (
    <div className='bg-gray-100 flex items-center justify-center h-screen'>
      <div className='bg-white rounded-lg shadow-lg p-8 w-96'>
        <div className='mb-6 text-center'>
          {/* <h1 className='text-3xl font-bold'>LOGO</h1> */}
          <p className='text-sm text-gray-600'>Login to your account</p>
        </div>

        <form onSubmit={submitHandler}>
          <div className='mb-4'>
            <label htmlFor='email' className='block text-gray-700 text-sm font-bold mb-2'>
              Email
            </label>
            <Input
              type='email'
              id='email'
              value={email}
              placeholder='Email'
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className='mb-4'>
            <label htmlFor='password' className='block text-gray-700 text-sm font-bold mb-2'>
              Password
            </label>
            <Input
              type='password'
              id='password'
              value={password}
              placeholder='Password'
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className='mt-6'>
            <Button
              type='submit'
              className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg w-full'
            >
              Login
            </Button>
          </div>

          <div className='mt-4 text-center'>
            <span className='text-gray-600'>
              Don't have an account?{' '}
              <Link to='/register' className='text-blue-600 hover:underline'>
                Sign up
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login
