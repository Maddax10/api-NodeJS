import Express from 'express'
import sqlite3 from 'sqlite3'
import cors from 'cors'

const GET = ['formations', 'personnels',  'visit'];

const ROUTES_GET = [
  '/api/formations',
  '/api/personnels',
  '/api/visitors',
  '/api/personnels/:id',
  '/api/visitors/registered/:email_visitors',
  '/api/visitors/connected/:email_visitors',
  '/api/visitors/here',
  '/api/visitors/historic',
  '/api/formations/local/:nom_formation',
  '/api/personnels/local/:fullname_personnels'
];

const ROUTES_POST = [
  '/api/formations',
  '/api/visitors',
  '/api/visitors/:email_visitors',
  '/api/personnels'
];

const ROUTES_DELETE = [
  '/api/formations/:id',
  '/api/personnels/:id'
];

//Configuration de l'api
const express = Express();
express.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

//Query à utiliser pour les GET
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

//==============================
// BDD
//==============================

const db = new sqlite3.Database(`API/bdd.db`, (err) => {
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
    ROUTES_GET,
    ROUTES_POST,
    ROUTES_DELETE
  }
  return res.status(200).json(tmpDoc);
})
//------------------------------
//fin doc
//------------------------------

//========================================================================
// Routes GET
//========================================================================
//Select All
GET.forEach(route => {
  query(route);
})

//Select 1 personnel
express.get("/personnels/:id", async (req, res) => {
  const id = req.params.id;
  console.log(id);
  db.all(`SELECT * FROM personnels WHERE id_personnels = ${id}`, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
})

//Select 1 visitor s'il existe une fois en DB, on renvoit qu'il est là
express.get("/visitors/registered/:email_visitors", async (req, res) => {
  const email_visitors = req.params.email_visitors;
  console.log(email_visitors);
  db.all(
    `SELECT * FROM visitors WHERE email_visitors = ?`,
    [email_visitors],
    [],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      if (rows.length > 0) {
        res.json({ registered: true, visitor: rows});
      } else {
        res.json({ registered: false });
      }
    });
})

// Vérifier si un visitor est connecté
express.get('/visitors/connected/:email_visitors', (req, res) => {
  const email_visitors = req.params.email_visitors;
  db.get(
    `SELECT * FROM visitors WHERE email_visitors = ? AND departure_visitors IS NULL ORDER BY arrival_visitors DESC LIMIT 1`,
    [email_visitors],
    (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      if (row) {
        res.json({ connected: true, visitor: row });
      } else {
        res.json({ connected: false });
      }
    }
  );
});

//Sélectionner que les personnes qui ne sont pas encore parti
express.get("/visitors/here", async (req, res) => {
  db.all(`SELECT * FROM visitors WHERE departure_visitors IS NULL`, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
})

//Sélectionner que les personnes qui ne sont pas encore parti
express.get("/visitors/historic", async (req, res) => {
  db.all(`SELECT * FROM visitors WHERE departure_visitors IS NOT NULL`, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
})

//récupérer le local de la formation
express.get("/formations/local/:nom_formation", async (req, res) => {
  const name_formation = req.params.nom_formation;
  db.all(`SELECT local_formation FROM formations WHERE nom_formation = ?`, [name_formation], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
})

//récupérer le local du personnel
express.get("/personnels/local/:fullname_personnels", async (req, res) => {
  const fullname_personnels = req.params.fullname_personnels;
    const [firstname_personnels, name_personnels] = decodeURIComponent(fullname_personnels).split(' ');

  console.log("name_personnels", firstname_personnels);
  console.log("firstname_personnels", name_personnels);
  db.all(`SELECT local_personnels FROM personnels WHERE firstname_personnels=? and name_personnels = ?`, [name_personnels,firstname_personnels], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
})
//========================================================================
// Routes CREATE
//========================================================================

//Ajouter une formation
express.post(`/formations`, (req, res) => {
  // Exemple générique, à adapter selon la structure de chaque table
  const keys = Object.keys(req.body);
  const values = Object.values(req.body);
  db.run(
    `INSERT INTO formations (${keys.join(',')}) VALUES (${keys.map(() => '?').join(',')})`,
    values,
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID, ...req.body });
    }
  );
})
//Ajouter un visitors
express.post(`/visitors`, (req, res) => {

  const keys = Object.keys(req.body);
  const values = Object.values(req.body);
  const arrival_visitors = (new Date()).toLocaleString('fr-FR', { hour12: false });
  
  // On ajoute le champ arrival_visitors à l'objet que j'envoit
  keys.push('arrival_visitors');
  values.push(arrival_visitors);
  
  db.run(
    `INSERT INTO visitors (${keys.join(',')}) VALUES (${keys.map(() => '?').join(',')})`,
    values,
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID, ...req.body });
    }
  );
})

//modifier un visitors
express.post(`/visitors/:email_visitors`, (req, res) => {
  const email_visitors = req.params.email_visitors;
  const departure_visitors = (new Date()).toLocaleString('fr-FR', { hour12: false });
  console.log(departure_visitors.toString());
  db.run(
    `UPDATE visitors 
     SET departure_visitors = ? 
     WHERE email_visitors = ? 
     AND arrival_visitors = (
       SELECT MAX(arrival_visitors) FROM visitors WHERE email_visitors = ?
     )`,
    [departure_visitors, email_visitors, email_visitors],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ email_visitors, departure_visitors });
    }
  );
})

express.post(`/personnels`, (req, res) => {
  // Exemple générique, à adapter selon la structure de chaque table
  const keys = Object.keys(req.body);
  const values = Object.values(req.body);
  db.run(
    `INSERT INTO personnels (${keys.join(',')}) VALUES (${keys.map(() => '?').join(',')})`,
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

express.delete('/formations/:id', (req, res) => {
  const id = req.params.id;
  db.run(
    `DELETE FROM formations WHERE id_formation = ${id}`,
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(200).json({ deleted: this.changes });
    }
  );
});

express.delete('/personnels/:id', (req, res) => {
  const id = req.params.id;
  console.log("id", id);
  db.run(
    `DELETE FROM personnels WHERE id_personnels = ${id}`,
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(200).json({ deleted: this.changes });
    }
  );
});

//---------------------------
// FIN Routes DELETE
//---------------------------

export default express;

