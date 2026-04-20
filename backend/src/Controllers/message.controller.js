import cloudinary from "../lib/cloudinary.js";
import {Message} from "../Models/message.model.js";
import {User} from "../Models/user.model.js";
import mongoose from "mongoose";
import { getReceiverSocketId } from "../lib/socket.js";
import { io } from "../lib/socket.js";

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

// export const getChatPartners = async (req, res) => {
//     try{
//         const loggedInUserId = req.user._id;

//         const message = await Message.find({
//             $or: [
//                 {senderId: loggedInUserId},
//                 {receiverId: loggedInUserId}
//             ]
//         }).sort({createdAt: -1});

//         const seen = new Set();
//         const chatPartnerIds = [];
//         for (const msg of message) {
//             const partnerId = msg.senderId.toString() === loggedInUserId.toString() 
//                 ? msg.receiverId.toString() 
//                 : msg.senderId.toString();
//             if (!seen.has(partnerId)) {
//                 seen.add(partnerId);
//                 chatPartnerIds.push(partnerId);
//             }
//         }

//         const chatPartners = await User.find({_id: {$in: chatPartnerIds}}).select("-password");
//         res.status(200).json(chatPartners);

//     }catch(error){
//         console.error("Error in getChatPartners:", error);
//         res.status(500).json({message: "Internal server error"});   
//     }
// }

export const getChatPartners = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;

        const chatPartners = await Message.aggregate([
            {
                $match: {
                    $or: [
                        { senderId: loggedInUserId },
                        { receiverId: loggedInUserId }
                    ]
                }
            },

            { $sort: { createdAt: -1 } },

            {
                $addFields: {
                    partnerId: {
                        $cond: [
                            { $eq: ["$senderId", loggedInUserId] },
                            "$receiverId",
                            "$senderId"
                        ]
                    }
                }
            },

            {
                $group: {
                    _id: "$partnerId",
                    lastMessage: { $first: "$text" },
                    lastMessageTime: { $first: "$createdAt" },

                    unreadCount: {
                        $sum: {
                            $cond: [
                                { 
                                    $and: [
                                        { $eq: ["$receiverId", loggedInUserId] },
                                        { $eq: ["$isRead", false] }
                                    ] 
                                },
                                1, 0
                            ]
                        }
                    }
                }
            },

            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "userInfo"
                }
            },

            { $unwind: "$userInfo" },
   
            {
                $project: {
                    _id: 1,
                    fullName: "$userInfo.fullName",
                    profilePic: "$userInfo.profilePic",
                    lastMessage: 1,
                    unreadCount: 1,
                    lastMessageTime: 1
                }
            },

            { $sort: { lastMessageTime: -1 } }
        ]);

        res.status(200).json(chatPartners);
    } catch (error) {
        console.error("Error in getChatPartners:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

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

        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }
        res.status(201).json(newMessage);

    }catch(error){
        console.error("Error in sendMessage:", error);
        res.status(500).json({message: "Internal server error"});   
    } 
}

export const markMessagesAsRead = async (req, res) => {
    try {
        const { id: senderId } = req.params;
        const loggedInUserId = req.user._id;

        await Message.updateMany(
            { senderId: senderId, receiverId: loggedInUserId, isRead: false },
            { $set: { isRead: true } }
        );

        res.status(200).json({ message: "Messages marked as read" });
    } catch (error) {
        console.error("Error in markMessagesAsRead:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};