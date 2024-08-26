import cookieSession from 'cookie-session';
import Express from 'express';
import { isAuthenticated } from 'middlewares/authentication.middleware';
import error from 'middlewares/error.middleware';
import logger from 'middlewares/logger.middleware';
import authRouter from 'routes/auth.router';
import userRouter from 'routes/user.router';
import cors from 'cors';
import getEnvVar from 'env/index';
import webhookRouter from 'routes/webhook.router';

const expressApp = Express();

expressApp.use(logger);
expressApp.use(Express.json());
expressApp.use(cors({ credentials: true, origin: '*' }));
expressApp.use(cookieSession({ secure: false, httpOnly: true, secret: getEnvVar('COOKIE_SECRET'), signed: true, name: 'benodiwal' }));
expressApp.use(error());

expressApp.get('/health', (_, res) => {
  return res.sendStatus(200);
});

expressApp.get('/', (_, res) => {
  return res.sendStatus(200);
});

expressApp.use('/auth', authRouter);
expressApp.use('/webhook', webhookRouter);
expressApp.use('/user', isAuthenticated(), userRouter);

export default expressApp;
