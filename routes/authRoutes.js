<<<<<<< HEAD
import express from 'express';
import {getBooks,getBookById,createBook,updateBook,deleteBook} from '../controllers/bookController.js';

import { register } from '../controllers/authController.js';
import router from './bookRoutes.js';

router.post('/register', register);

=======
import express from 'express';
import {getBooks,getBookById,createBook,updateBook,deleteBook} from '../controllers/bookController.js';

import { register } from '../controllers/authController.js';
import router from './bookRoutes.js';

router.post('/register', register);

>>>>>>> 4977811d20c85a185fc260bccd217caad4ea6ddf
export default router;