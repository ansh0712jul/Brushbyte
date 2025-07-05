import Conversation from "../models/conversation.model";
import Message from "../models/message.model";
import asyncHandler from "../utils/asyncHandler";


const sendMessage = asyncHandler( async(req , res)=> {
    const senderId = req.user?._id;
    const receiverId = req.params.id

    const { message } = req.body;

    if(!message) {
        throw new apiError(400 , "message is required");
    }

    let conversation = await Conversation.findOne({
        participants:{
            $all : [senderId , receiverId]
        }
    })

    // establish a conversation between the two users if not started yet

    if(!conversation) {
        conversation = await Conversation.create({
            participants : [senderId , receiverId]
        })
    }

    const newMessage = await Message.create({
        senderId,
        receiverId,
        message
    })
    if(newMessage) {
        conversation.messages.push(newMessage._id);
    }

    await Promise.all(
        [
            conversation.save(),
            newMessage.save()
        ]
    )

    // implement socket.io for real time data transfer



    return res
    .status(200)
    .json(
        new apiResponse(200 , {} ,  newMessage)
    )
})


// endpoint to get all messages between two users

const getAllMessages = asyncHandler( async(req , res) => {

    const senderId = req.user?._id;
    const receiverId = req.params.id;

    if(!senderId) {
        throw new apiError(401 , "unauthorized access");
    }

    if(!receiverId) {
        throw new apiError(400 , "receiver id is required");
    }

    const conversation = await Conversation.findOne({
        participants : {
            $all : [senderId , receiverId]
        }
    })
    .populate("messages");

    if(!conversation) {
        throw new apiError(404 , "conversation not found");
    }

    return res
    .status(200)
    .json(
        new apiResponse(200 , "messages fetched successfully between two users" , conversation.messages)
    )
})