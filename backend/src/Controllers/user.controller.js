const User = require("../Models/user.model")
const sendVerificationEmail = require("../Email/emailHandlers");

const login = async (req, res) => {
  const {email, password} = req.body;

  try{
    if(!email || !password){
      return res.status(400).json({message: "All fields are required"});
    }
    
    const user = await User.findByCredentials(email, password);
    await user.generateAuthToken(res);
    res.status(200).json({_id: user._id, fullName: user.fullName, email: user.email, profilePic: user.profilePic});
  }catch(error){
    console.error("Error in login:", error);
    res.status(500).json({message: "Internal server error"});   
  }
}

const logout = (req, res) => {
    res.clearCookie("jwt");
    res.status(200).json({message: "Logout successfully"});
}

const signup = async (req, res) => {
    const {fullName, email, password} = req.body;
    
    try{
        if(!fullName || !email || !password){
            return res.status(400).json({message: "All fields are required"});
        }
        if(password.length < 6){
            return res.status(400).json({message: "Password must be at least 6 characters long"});
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)){
            return res.status(400).json({message: "Invalid email address"});
        }

        const user = await User.findOne({email});
        if(user){
            return res.status(400).json({message: "User already exists"});
        } 
        
        const newUser = new User({fullName, email, password})
        const saveUser = await newUser.save();
        await newUser.generateAuthToken(res);
        res.status(201).json({_id: newUser._id, fullName: newUser.fullName, email: newUser.email, profilePic: newUser.profilePic});

        try{
            await sendVerificationEmail(saveUser.email, saveUser.fullName);
        }catch(error){
            console.error("Error sending verification email:", error);
        }

    }catch(error){
        console.error("Error in signup:", error);
        res.status(500).json({message: "Internal server error"});   
    }
}

const updateProfile = async (req, res) => {
try{
    const {profilePic} = req.body;
    if(!profilePic){
        return res.status(400).json({message: "Profile picture is required"});
    }

    const uploaredResponse = await cloudinary.uploader.upload(profilePic);

    const updatedUser = await User.findByIdAndUpdate(req.user._id, {profilePic: uploaredResponse.secure_url}, {new: true});

    res.status(200).json(updatedUser);
}catch(error){
    console.error("Error in updateProfile:", error);
    res.status(500).json({message: "Internal server error"});   
}
}

module.exports = { login, logout, signup, updateProfile };