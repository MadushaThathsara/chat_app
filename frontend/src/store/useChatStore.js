import { create } from "zustand";
import {axiosInstance} from "../lib/axios.js";
import {toast} from "react-hot-toast";
import {useAuthStore} from "./useAuthStore.js";
import {MessageToast} from "../components/MessageToast.jsx"

const notificationSound1 = new Audio("/sounds/notification.mp3");
const notificationSound2 = new Audio("/sounds/notification2.mp3");

export const useChatStore = create((set, get) => ({
    allContacts: [],
    chatContacts: [],
    messages: [],
    activeTab: "chats",
    selectedUser: false,
    isUsersLoading: false,
    isMessagesLoading: false,
    isSoundEnabled: localStorage.getItem("isSoundEnabled") === "true",

    toggleSound: () => {
        const newValue = !get().isSoundEnabled;
        localStorage.setItem("isSoundEnabled", newValue);
        set({isSoundEnabled: newValue});
    },
    
    setActiveTab: (tab) => set({activeTab: tab}),

    setSelectedUser: (user) => set({selectedUser: user}),

    getAllContacts: async () => {
        set({isUsersLoading: true});
        try {
            const res = await axiosInstance.get("/message/contacts");
            set({allContacts: res.data});
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to load contacts");
        } finally {
            set({isUsersLoading: false});
        }
    },

    getChatContacts: async () => {
        set({isUsersLoading: true});
        try {
            const res = await axiosInstance.get("/message/chats");
            set({chatContacts: res.data});
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to load chat contacts");
        } finally {
            set({isUsersLoading: false});
        }
    },

    getMessages: async (userId) => {
        set({isMessagesLoading: true});
        try {
            const res = await axiosInstance.get(`/message/get/${userId}`);
            set({messages: res.data});
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to load messages");
        } finally {
            set({isMessagesLoading: false});
        }
    },

    sendMessage: async (messageData) => {
        const { selectedUser, messages } = get();
        const { authUser } = useAuthStore.getState();

        const tempId = `temp-${Date.now()}`;

        const optimisticMessage = {
            _id: tempId,
            senderId: authUser._id,
            receiverId: selectedUser._id,
            text: messageData.text,
            image: messageData.image,
            createdAt: new Date().toISOString(),
            isOptimistic: true, // flag to identify optimistic messages (optional)
        };
        // immediately update the ui by adding the message
        set({ messages: [...messages, optimisticMessage] });

        try {
            const res = await axiosInstance.post(`/message/send/${selectedUser._id}`, messageData);
            // Replace the optimistic message with the real one using the *latest* state
            set({ 
                messages: get().messages.map(msg => 
                    msg._id === tempId ? res.data : msg
                ) 
            });
        } catch (error) {
            // Remove optimistic message on failure using the *latest* state
            set({ 
                messages: get().messages.filter(msg => msg._id !== tempId)
            });
            toast.error(error.response?.data?.message || "Failed to send message");
        }
    },

    subscribeToMessages: () => {
        const { socket } = useAuthStore.getState();

        socket.off("newMessage");

        socket.on("newMessage", (newMessage) => {
            const { selectedUser, isSoundEnabled, chatContacts, messages, allContacts } = get();

            const isMessageSentFromSelectedUser = selectedUser && newMessage.senderId === selectedUser._id;

            if (isMessageSentFromSelectedUser) {

                const currentMessages = messages;
                set({ messages: [...currentMessages, newMessage] });

                if (isSoundEnabled) {
                    notificationSound1.currentTime = 0; // reset to start
                    notificationSound1.play().catch((e) => console.log("Audio play failed:", e));
                }

            }else{

                const sender = allContacts.find((contact) => contact._id.toString() === newMessage.senderId.toString());

                MessageToast ({
                    senderName: sender?.fullName ?? "Someone",
                    senderPic: sender?.profilePic,
                    message: newMessage.text
                }) 


                if (isSoundEnabled) { 
                    notificationSound2.currentTime = 0; // reset to start
                    notificationSound2.play().catch((e) => console.log("Audio play failed:", e));
                }
                
            } 

            const updatedContacts = chatContacts.map((contact) => {
            if (contact._id === newMessage.senderId) {
                return { ...contact, 
                    lastMessage: newMessage.text, 
                    unreadCount: isMessageSentFromSelectedUser ? 0 : (contact.unreadCount || 0) + 1 };
            }
            return contact;
            });
            set({ chatContacts: updatedContacts });
        });
    },

    unsubscribeFromMessages: () => {
        const { socket } = useAuthStore.getState();
        socket.off("newMessage");
    },
}));
