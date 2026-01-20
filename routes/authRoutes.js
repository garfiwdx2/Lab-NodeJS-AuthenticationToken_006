import express from 'express';
import {getBooks,getBookById,createBook,updateBook,deleteBook} from '../controllers/bookController.js';

import { register } from '../controllers/authController.js';
import router from './bookRoutes.js';

router.post('/register', register);

export default router;