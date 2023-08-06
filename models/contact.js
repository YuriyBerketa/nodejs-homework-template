import { Schema, model } from "mongoose";

import { phoneCheck, emailCheck } from "../constants/constans.js";

import {handleSaveError, validateAtUpdate} from "./hooks.js";



const contactSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Set name for contact'],
    },
    email: {
        type: String,
        required: [true, 'Set email for contact'],
        match: emailCheck,
    },
    phone: {
        type: String,
        required: [true, 'Set phone for contact'],
        match: phoneCheck,
    },
    favorite: {
        type: Boolean,
        default: false,
    },
    avatarURL: {
        type: String,
        required: true,
    },
    owner: {
        type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    }
}, { versionKey: false, timestamps: true });


contactSchema.pre("findOneAndUpdate", validateAtUpdate);

contactSchema.post("save", handleSaveError);
contactSchema.post("findOneAndUpdate", handleSaveError);

const Contact = model("contact", contactSchema);

export default Contact;