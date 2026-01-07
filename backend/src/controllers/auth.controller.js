import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import { sendWelcomeEmail } from "../emails/emailHandler.js";
import { ENV } from "../lib/env.js";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
    const { fullName, email, password } = req.body;

    try {
        if(!fullName || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if(password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        } 

        //check if email is valid
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        //search for user with entered email
        const user = await User.findOne({ email });
        if(user) return res.status(400).json({ message: "Email already exists" });

        //password hash
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword
        });

        if(newUser) {
            const savedUser = await newUser.save();
            generateToken(savedUser._id, res);

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
            });

            //send message using resend
            try {
                await sendWelcomeEmail(savedUser.email, savedUser.fullName, ENV.CLIENT_URL);
            } catch(error) {
                console.error("Failed to send welcome email: ", error);
            }

        } else {
            res.status(400).json({ message: "Invalid user data" });
        }

    } catch(error) {
        console.log("Error in signup controller: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    /*
        {
            "email": "example@gmail.com",
            "password": "123456",
        }
    */

    if(!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    try {
        const user = await User.findOne({ email });
        
        if(!user) return res.status(400).json({ message: "Invalid credentials" });

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if(!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" });

        generateToken(user._id, res);

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
        });
    } catch(error) {
        console.error("Error in login controller", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const logout = async(_, res) => {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "logout succesfully" });
}

export const updateProfile = async(req, res) => {
    try {
        const { profilePic } = req.body;
        if(!profilePic) return res.status(400).json({ message: "Profile pic is required" });

        // check type of file
        if(!profilePic.startsWith("data:image/")) return res.status(400).json({ message: "Invalid file type" });

        // check file size in bytes
        const MAX_SIZE = 5 * 1024 * 1024;
        const base64data = profilePic.split(",")[1];
        const sizeInBytes = Buffer.byteLength(base64data, "base64");

        if(sizeInBytes > MAX_SIZE) return res.status(400).json({ message: "Image too large (max 5MB)" });


        const userID = req.user._id;

        const uploadResponse = await cloudinary.uploader.upload(profilePic);

        const updatedUser = await User.findByIdAndUpdate(userID, { profilePic: uploadResponse.secure_url }, { new: true }).select("-password");

        res.status(200).json(updatedUser);
        
    } catch(error) {
        console.log("Error in update profile: ", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}