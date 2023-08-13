import { Schema, model } from "mongoose";

import { handleSaveError, validateAtUpdate } from "./hooks.js";

import { emailCheckVerification } from "../constants/user-constants.js";

import { subscription, subscriptionDefault } from "../constants/user-constants.js";

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Set name for contact'],
    },
    email: {
        type: String,
        match: emailCheckVerification,
        unique: true,
        required: [true, 'Set Email for contact'],
    },
    password: {
        type: String,
        minlenth: 6,
        required: [true, 'Set password for user'],
    },
    subscription: {
      type: String,
      enum: subscription,
      default: subscriptionDefault,
    },
    token: {
        type: String, 
    },
    avatarURL: {
        type: String,
    },

}, { versionKey: false, timestamps: true });

userSchema.pre("findOneAndUpdate", validateAtUpdate);

userSchema.post("save", handleSaveError);
userSchema.post("findOneAndUpdate", handleSaveError);

const User = model("user", userSchema);

export default User;

