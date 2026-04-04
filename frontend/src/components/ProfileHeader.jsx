import { useState, useRef } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { LogOutIcon, VolumeOffIcon, Volume2Icon, Loader } from "lucide-react";

const mouseClickSound = new Audio("/sounds/mouse-click.mp3");

export default function ProfileHeader() {
  const fileInputRef = useRef(null);

  const { authUser, updateProfile, logout, isUpdating } = useAuthStore();
  const { isSoundEnabled, toggleSound } = useChatStore();

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = async () => {
      const base64Image = reader.result;
      await updateProfile({ profilePic: base64Image });
    };
  };

  return (
    <div className="p-4 border-b border-slate-700/50">
      <div className="flex items-center justify-between">
        {/* user info */}
        <div className="flex items-center gap-3">
          {/* user image */}
          <div className="avatar avatar-online">

           <button 
           className='size-12 rounded-full overflow-hidden relative group'
           onClick={() => fileInputRef.current.click()}>
             <img
                src={authUser.profilePic || "/avatar.png"}
                alt="User image"
                className="size-full object-cover"
              />

              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                  
                {isUpdating ? (
                    <Loader className="text-white size-5 animate-spin mx-auto" />
                ) : (
                  <span className="text-white text-xs">change</span>
                )}
              </div>
           </button>

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="hidden"
            />

          </div>

          {/* user name and username */}
          <div className="flex flex-col max-w-[100px] truncate">
            <h2 className="text-slate-200 font-medium text-sm ">{authUser.fullName}</h2>
            <p className="text-slate-400 text-xs">{authUser.email}</p>
          </div>

        </div>

        {/* BUTTONS */}
        <div className="flex gap-4 items-center">

          {/* logout button */}
          <button
            onClick={logout}
            className="text-slate-400 hover:text-slate-200 transition-colors"
          >
            <LogOutIcon className="size-4"/>
          </button>

          {/* SOUND TOGGLE BTN */}
          <button
            className="text-slate-400 hover:text-slate-200 transition-colors"
            onClick={() => {
              // play click sound before toggling
              mouseClickSound.currentTime = 0; // reset to start
              mouseClickSound.play().catch((error) => console.log("Audio play failed:", error));
              toggleSound();
            }}
          >
            {isSoundEnabled ? (
              <Volume2Icon className="size-4" />
            ) : (
              <VolumeOffIcon className="size-4" />
            )}
          </button>
        </div>

      </div>
    </div>
  )       
}
