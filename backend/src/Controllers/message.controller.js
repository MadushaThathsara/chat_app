import cloudinary from "../lib/cloudinary.js";
import {Message} from "../Models/message.model.js";
import {User} from "../Models/user.model.js";
import mongoose from "mongoose";

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

        const seen = new Set();
        const chatPartnerIds = [];
        for (const msg of message) {
            const partnerId = msg.senderId.toString() === loggedInUserId.toString() 
                ? msg.receiverId.toString() 
                : msg.senderId.toString();
            if (!seen.has(partnerId)) {
                seen.add(partnerId);
                chatPartnerIds.push(partnerId);
            }
        }

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

        if (!mongoose.Types.ObjectId.isValid(receiverId)) {
            return res.status(400).json({message: "Invalid receiver ID"});
        }
        
        const receiverExist = await User.findById(receiverId);
        if (!receiverExist) {
            return res.status(404).json({message: "Receiver not found"});
        }
        
        if(senderId.equals(receiverId)){
            return res.status(400).json({message: "You cannot send message to yourself"});
        }

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
