import express from 'express';

import contactControlles from '../../controllers/contact-controllers.js';

import contactsSchemas from '../../schemas/contacts-schemas.js';
import { validateBody } from '../../decorators/index.js';


import isEmptyBody from "../../middlewars/isEmptyBody.js";
import isValidId from '../../middlewars/isValidId.js';
import authenticate from "../../middlewars/authenticate.js";
import upload from '../../middlewars/upload.js';


const contactsRouter = express.Router();

contactsRouter.use(authenticate);

contactsRouter.get('/', contactControlles.getAll);

contactsRouter.get('/:id', isValidId, contactControlles.getById);

contactsRouter.post(
  '/',
  upload.single("avatar"),
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
isValidId, isEmptyBody, validateBody(contactsSchemas.contactUpdateFavoriteSchema), contactControlles.updateStatusContact
);



export default contactsRouter;