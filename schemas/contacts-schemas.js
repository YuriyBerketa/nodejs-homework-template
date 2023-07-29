import Joi from 'joi';

import { phoneCheck, emailCheck } from "../constants/constans.js";


const contactAddSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().pattern(emailCheck).required(),
  phone: Joi.string().pattern(phoneCheck).required(),
  favorite: Joi.boolean(),
});

const contactUpdateFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required()
})

export default { contactAddSchema, contactUpdateFavoriteSchema };