import express from 'express';

import contactControlles from '../../controllers/contact-controllers.js';

import contactsSchemas from '../../schemas/contacts-schemas.js';
import { validateBody } from '../../decorators/index.js';
// import {isEmptyBody, isValidId} from "../../middlewars/index.js";

import isEmptyBody from "../../middlewars/isEmptyBody.js";
import isValidId from '../../middlewars/isValidId.js';


const contactsRouter = express.Router();

contactsRouter.get('/', contactControlles.getAll);

contactsRouter.get('/:id', isValidId, contactControlles.getById);

contactsRouter.post(
  '/',
  isEmptyBody,
  validateBody(contactsSchemas.contactAddSchema),
  contactControlles.add
);

contactsRouter.delete('/:id', isValidId, contactControlles.deleteById);

contactsRouter.put(
  '/:id',
isValidId,
  isEmptyBody,
  validateBody(contactsSchemas.contactAddSchema),
  contactControlles.updateById
);

contactsRouter.patch(
  '/:id/favorite',
isValidId, isEmptyBody, validateBody(contactsSchemas.contactUpdateFavoriteSchema), contactControlles.updateFavorite
);



export default contactsRouter;