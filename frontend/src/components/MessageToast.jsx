import React from 'react'
import toast from 'react-hot-toast'
import { XIcon } from "lucide-react";

export const MessageToast = ({ senderName, senderPic, message }) => {
    toast.custom((t) => (
        <div
        className={`${
            t.visible ? 'animate-enter' : 'animate-leave'
        } max-w-xs sm:max-w-md w-full bg-slate-800 shadow-xl rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5 border border-slate-700`}
        >
        <div className="flex-1 w-0 p-2 sm:p-4">
        <div className="flex items-start">  
          <div className="shrink-0 pt-0.5">
            <img
              className="h-7 w-7 sm:h-8 sm:w-8 rounded-full object-cover border border-cyan-500/50"
              src={senderPic || "/avatar.png"}
              alt=""
            />
            </div>
            <div className="ml-3 flex-1">
                <p className="text-xs sm:text-sm font-medium text-slate-100">{senderName}</p>
                <p className="mt-0 text-xs sm:text-sm text-slate-400 truncate">{message}</p>
            </div>
            </div>
        </div>
        <div className="flex ">
            <button
            onClick={() => toast.dismiss(t.id)}
            className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-cyan-400 hover:text-cyan-300 focus:outline-none"
            >
                <XIcon className="w-4 h-4" />
            </button>
        </div>
        </div>
    ), { duration: 4000 });
}