import { Router } from 'express';
import { register, login, setPin } from '../controllers/authController.js';
const r=Router(); r.post('/register',register); r.post('/login',login); r.post('/pin',setPin); export default r;