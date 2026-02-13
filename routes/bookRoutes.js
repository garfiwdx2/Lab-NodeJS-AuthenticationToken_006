import express from 'express';
const router = express.Router();

import {getBooks,getBookById,createBook,updateBook,deleteBook} from '../controllers/bookController.js';
import authenticateToken from '../middlewares/auth.js';


router.get('/', authenticateToken, getBooks);
router.get('/:id', authenticateToken, getBookById);
router.post('/', authenticateToken, createBook);
router.put('/:id', authenticateToken,updateBook);
router.delete('/:id', authenticateToken, deleteBook);

export default router;