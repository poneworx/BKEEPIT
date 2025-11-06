import { Router } from 'express';
import { confirmEmail, requestReset, confirmReset } from '../controllers/emailController.js';
const r=Router(); r.post('/confirm',confirmEmail); r.post('/reset',requestReset); r.post('/confirm-reset',confirmReset); export default r;