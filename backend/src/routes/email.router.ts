import { get } from 'controllers/email.controller';
import { Router } from 'express';

const emailRouter = Router();

emailRouter.get('/:accountId', get);

export default emailRouter;
