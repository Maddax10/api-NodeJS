import Express from 'express'
import sqlite3 from 'sqlite3'
import cors from 'cors'

const express = Express();
express.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
const GET = POST = PUT = ['formations', 'formateurs', 'locals', 'user', 'visits'];

//==============================
// BDD
//==============================

const db = new sqlite3.Database(`C:\\Users\\maxim\\Desktop\\Qui est là - projet\\3. BDD\\bdd.db`, (err) => {
  if (err)
    console.error('Erreur de connexion à la BDD');
  else
    console.log('Connecté à la BDD');
});

//-------------------------------
//fin BDD
//-------------------------------

//========================================================================
// Documentation API
//========================================================================

express.get(`/`, (req, res) => {
  const tmpDoc = {
    GET,
    POST,
    PUT
  }
  return res.status(200).json(tmpDoc);
})
//------------------------------
//fin doc
//------------------------------

//========================================================================
// Routes GET
//========================================================================
GET.forEach(route => {
  query(route);
})
//========================================================================
// Routes CREATE
//========================================================================
express.post(`/user`, (req, res) => {
  // Exemple générique, à adapter selon la structure de chaque table
  const keys = Object.keys(req.body);
  const values = Object.values(req.body);
  db.run(
    `INSERT INTO user (${keys.join(',')}) VALUES (${keys.map(() => '?').join(',')})`,
    values,
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID, ...req.body });
    }
  );
})

//========================================================================
// Routes DELETE
//========================================================================

// express.delete('/items/:id', (req, res) => {
//   const idx = items.findIndex(i => i.id === parseInt(req.params.id));
//   if (idx === -1) return res.status(404).json({ error: 'Not found' });
//   const deleted = items.splice(idx, 1);
//   res.json(deleted[0]);
// });

//---------------------------
// FIN Routes DELETE
//---------------------------

export default express;

const query = (route) => {
  express.get(`/${route}`, (req, res) => {
    db.all(`SELECT * FROM ${route}`, [], (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(rows);
    });
  })
}