import cloudinary from "../lib/cloudinary.js";
import {Message} from "../Models/message.model.js";
import {User} from "../Models/user.model.js";

export const getAllContacts = async (req, res) => {
    try{
        const loggedInUserId = req.user._id;

        const allUsers = await User.find({_id: {$ne: loggedInUserId}}).select("-password");
        res.status(200).json(allUsers);
    }catch(error){
        console.error("Error in getAllContacts:", error);
        res.status(500).json({message: "Internal server error"});   
    }
}

export const getChatPartners = async (req, res) => {
    try{
        const loggedInUserId = req.user._id;

        const message = await Message.find({
            $or: [
                {senderId: loggedInUserId},
                {receiverId: loggedInUserId}
            ]
        }).sort({createdAt: -1});

        const chatPartnerIds = [...new Set(message.map(msg =>
             msg.senderId.toString() === loggedInUserId.toString() ? msg.receiverId.toString() : msg.senderId.toString() 
        ))];

        const chatPartners = await User.find({_id: {$in: chatPartnerIds}}).select("-password");
        res.status(200).json(chatPartners);

    }catch(error){
        console.error("Error in getChatPartners:", error);
        res.status(500).json({message: "Internal server error"});   
    }
}

export const getMessages = async (req, res) => {
    try{
        const {id:chatId} = req.params;
        const loggedInUserId = req.user._id;

        const messages = await Message.find({
            $or: [
                {senderId: loggedInUserId, receiverId: chatId}, 
                {senderId: chatId, receiverId: loggedInUserId}
            ]
        }).sort({createdAt: 1});
        res.status(200).json(messages);
    }catch(error){
        console.error("Error in getMessages:", error);
        res.status(500).json({message: "Internal server error"});   
    }
}

export const sendMessage = async (req, res) => {
    try{
        const {id:receiverId} = req.params;
        const senderId = req.user._id;

        const {text, image} = req.body;

        if(!text && !image){
            return res.status(400).json({message: "Message is required"});
        }

        let imageUrl;
        if(image){
            const uploaredResponse = await cloudinary.uploader.upload(image, { resource_type: "image" });
            imageUrl = uploaredResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl
        });

        await newMessage.save();
        res.status(201).json(newMessage);

    }catch(error){
        console.error("Error in sendMessage:", error);
        res.status(500).json({message: "Internal server error"});   
    } 
}
