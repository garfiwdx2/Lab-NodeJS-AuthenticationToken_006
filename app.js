import express from 'express';
import cors from 'cors';
// const express = require('express');
// const cors = require('cors');
// const bookRoutes = require('./routes/bookRoutes'); // กําหนดการเรียกโมดูล bookRoutes

const app = express();
app.use(cors());
app.use(express.json());

import bookRoutes from './routes/bookRoutes.js';
app.use('/api/books', bookRoutes); // กําหนดการเรียกใช้งาน API ของ books

import authRoutes from './routes/authRoutes.js';
app.use('/api/auth', authRoutes);

// app.use('/api/books', bookRoutes); // กําหนดการเรียกใช้งาน API ของ books
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
 console.log(`Server is running on port ${PORT}`);
});