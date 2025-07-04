import express from 'express'
import authRoutes from './authRoutes.js'
import adminRoutes from './adminRoutes.js'
import fileRoutes from './fileRoutes.js'
import auth from '../Middlewares/authMiddleware.js'
import notificationRoutes from './notificationRoutes.js'
import aiRoutes from './AiRoutes.js'

const mainRouters = express.Router();

mainRouters.use('/auth', authRoutes);
mainRouters.use('/admin', auth, adminRoutes);
mainRouters.use('/files', auth, fileRoutes);
mainRouters.use('/notification', auth, notificationRoutes);
mainRouters.use('/ai', auth, aiRoutes);

export default mainRouters;
