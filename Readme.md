# Brushbyte

Brushbyte is a full-featured social media platform that allows users to share posts, engage with content through likes and comments, follow other users, and interact via real-time messaging. Built with the MERN stack, it offers a scalable and responsive experience for social media interactions.

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Data Mosel](#data-model)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)

## Overview
Brushbyte replicates key features of modern social media platforms, enabling users to create an account, post images with captions, like and comment on posts, follow other users, and communicate via direct messages. The backend is optimized for performance, utilizing MongoDB for efficient data storage and Cloudinary for image hosting.

## Features
- **User Authentication**: Secure authentication using JWT.
- **Post Creation**: Upload images with captions and share them with followers.
- **Like & Comment System**: Engage with posts by liking and commenting.
- **Follow System**: Follow other users to see their posts in your feed.
- **Real-time Messaging**: Send and receive messages instantly.
- **Profile Management**: Edit user profile with bio, profile picture, and personal details.
- **Bookmarking**: Save favorite posts for later viewing.
- **Optimized Backend**: Efficient API design using Express.js.

## Tech Stack
- **Frontend**: React.js, Tailwind CSS, ShadCN UI
- **Backend**: Node.js, Express.js
- **State Management**: Redux Toolkit
- **Database**: MongoDB
- **Authentication**: JWT
- **File Storage**: Cloudinary
- **Real-time Messaging**: Socket.io

## Data Model

![Data Model](https://i.postimg.cc/SKqR9cDL/data-Model2.png)


### Workflow:
1. User registers/logs in using JWT authentication.
2. Posts are created and images are uploaded to Cloudinary.
3. Users can like, comment, and bookmark posts.
4. Follower relationships determine the personalized feed.
5. Real-time messaging is powered by Socket.io.

## Installation
### Prerequisites:
- Node.js >= 18.x
- MongoDB
- Cloudinary account for image storage

### Steps to Install:
Clone the repository:
```bash
git clone https://github.com/ansh0712jul/Brushbyte.git
cd Brushbyte
```

Install dependencies:
```bash
npm ci
```

Set up your environment variables by creating a `.env` file:
```bash
cp .env.example .env
```
Update the `.env` file with your MongoDB connection string, JWT secret, Cloudinary credentials, and other configurations.

Start the development server:
```bash
npm run dev
```

## Usage
- **Create an Account**: Register or log in to the platform.
- **Post Content**: Upload images with captions.
- **Engage**: Like, comment, and bookmark posts.
- **Follow Users**: Build your network and personalize your feed.
- **Chat**: Send messages in real-time with other users.

## Contributing
We welcome contributions to Brushbyte! To contribute, please follow these steps:
1. Fork the repository.
2. Create a new branch with a descriptive name.
3. Make your changes and commit them with clear messages.
4. Push your changes to your fork.
5. Open a pull request with a detailed description of the changes.


