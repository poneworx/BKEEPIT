import { Router } from 'express';
import { health } from '../controllers/healthController.js';
const r=Router(); r.get('/health', health); export default r;