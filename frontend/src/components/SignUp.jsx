import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from "./ui/input";
import { Link, useNavigate } from 'react-router-dom';
import axios from "../config/Axios";

const SignUp = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profileImg, setProfileImg] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const submitHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);
    if (profileImg) {
      formData.append("profileImg", profileImg);
    }

    try {
      const response = await axios.post("/sign-up", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log("User signed up successfully:", response.data);
      navigate("/home");
    } catch (error) {
      console.error("Error signing up:", error);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center px-4">
      <div className="bg-white shadow-xl rounded-xl w-full max-w-md p-8">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-blue-500 mb-2">Sign Up</h1>
          <p className="text-gray-600 text-sm">Create your account to join the community.</p>
        </div>

        <form onSubmit={submitHandler} className="space-y-5">
          {/* Profile Image Upload */}
          <div className="text-center">
            <input
              type="file"
              id="profileImg"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={(e) => {
                const file = e.target.files[0];
                setProfileImg(file);
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => setPreviewImage(reader.result);
                  reader.readAsDataURL(file);
                }
              }}
            />

            <label htmlFor="profileImg" className="cursor-pointer inline-block transition duration-300 hover:scale-105">
              <div className="w-28 h-28 mx-auto rounded-full overflow-hidden border-4 border-blue-100 shadow-md">
                {previewImage ? (
                  <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <img
                    src="https://www.w3schools.com/howto/img_avatar.png"
                    alt="Default avatar"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <p className="text-xs mt-2 text-gray-500">Click to upload profile picture</p>
            </label>
          </div>

          {/* Input Fields */}
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">Username</label>
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              required
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              required
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 transition-colors text-white py-2 rounded-lg"
          >
            Sign Up
          </Button>

          <div className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-500 hover:underline">
              Log In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
