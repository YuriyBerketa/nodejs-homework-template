import Joi from "joi";

import { emailCheckVerification } from "../constants/user-constants.js";

const userRegisterSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().pattern(emailCheckVerification).required(),
    password: Joi.string().required(),
});

const userLoginSchema = Joi.object({
    email: Joi.string().pattern(emailCheckVerification).required(),
    password: Joi.string().required(),
});

export default {
    userRegisterSchema,
    userLoginSchema,
}