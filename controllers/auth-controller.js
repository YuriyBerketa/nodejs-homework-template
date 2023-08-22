import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import dotenv from 'dotenv';
import gravatar from 'gravatar';
import path from 'path';
import fs from 'fs/promises';
import Jimp from "jimp";
import { nanoid } from "nanoid";


import { HttpError, sendMail, createVerifyEmail } from '../helpers/index.js';
import { ctrlWrapper } from '../decorators/index.js';

dotenv.config();

const { JWT_SECRET } = process.env;

const avatarPath = path.resolve('tmp');



const register = async (req, res) => {
const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
        throw HttpError(409, "Email in use");
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const verificationCode = nanoid();

    const avatarURL = gravatar.url(email);

    const newUser = await User.create({ ...req.body, password: hashPassword, avatarURL, verificationCode});
    
    const verifyEmail = createVerifyEmail({email, verificationCode});

    await sendMail(verifyEmail);

    res.status(201).json({
        name: newUser.name,
        email: newUser.email,
    })
}

const verify = async (req, res) => {
    const { verificationCode } = req.params;
    const user = await User.findOne({ verificationCode });
    if (!user) {
        throw HttpError(404, "Email not found");
    }
    await User.findByIdAndUpdate(user._id, { verify: true, verificationCode: "" });
    res.json({
        message: "verify success"
    })
}

const resendVerifyEmail = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
         throw HttpError(404, "Email not found");
    }

    if (user.verify) {
         throw HttpError(400, "Email already verify");
    }
    const verifyEmail = createVerifyEmail({email, verificationCode: user.verificationCode});

    await sendMail(verifyEmail);

    res.json({
        message: "Resend email success"
    })

}

const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        throw HttpError(401, "Email or password invalid");
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
        throw HttpError(401, "Email or password invalid");
    }
    const payload = {
        id: user._id,
    }
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });
    await User.findByIdAndUpdate(user._id, { token });
    res.json({ token });
}

const getCurrent = (req, res) => {
    const { name, email } = req.user;
    res.json({ name, email });
}

const logout = async (req, res) => {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: "" });
    res.json({
        message: "Logout ssucsess"
    })
}

const updateAvatar = async (req, res) => {
    const { _id } = req.user;
    const { path: oldPath, filename } = req.file;
    const newPath = path.join(avatarPath, filename);

    const originalAvatar = await Jimp.read(oldPath);
    originalAvatar.resize(250, 250).write(oldPath);

    await fs.rename(oldPath, newPath);

    const avatarURL = path.join("avatars", filename);


    await User.findByIdAndUpdate(_id, { avatarURL });
   
    res.json({
        avatarURL,
    })
}

export default {
    register: ctrlWrapper(register),
    verify: ctrlWrapper(verify),
    resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
    login: ctrlWrapper(login),
    getCurrent: ctrlWrapper(getCurrent),
    logout: ctrlWrapper(logout),
    updateAvatar: ctrlWrapper(updateAvatar),
}