import express from 'express';
import sqlite3 from 'sqlite3'
import crudRouter from './API/crud.js';

//==============================
// server
//==============================
const app = express();
app.use(express.json());

app.use('/api', crudRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}/api`);
});


