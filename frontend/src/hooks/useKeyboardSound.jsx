import { useMemo } from "react";

export default function useKeyboardSound() {
  // audio setup  Hook එක ඇතුළේ හැමතිස්සෙම මේවා හැදෙන එක නතර කරන්න useMemo පාවිච්චි කරමු
  const keyStrokeSounds = useMemo(() => [
    new Audio("/sounds/keystroke1.mp3"),
    new Audio("/sounds/keystroke2.mp3"),
    new Audio("/sounds/keystroke3.mp3"),
    new Audio("/sounds/keystroke4.mp3"),
  ], []);

  // play random sound
  const playRandomKeyStrokeSound = () => {
    const randomSound = keyStrokeSounds[Math.floor(Math.random() * keyStrokeSounds.length)];
    randomSound.currentTime = 0;
    randomSound.play().catch(err => console.log("Audio play error", err));
  };

  return {playRandomKeyStrokeSound};
}
