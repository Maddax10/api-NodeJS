import express from 'express';
import sqlite3 from 'sqlite3'
import crudRouter from './src/crud.js';

//==============================
// server
//==============================
const app = express();
app.use(express.json());

app.use('/', crudRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running http:\\\\localhost:${PORT}`);
});


