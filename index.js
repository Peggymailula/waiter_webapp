/* eslint-disable import/no-extraneous-dependencies */
// eslint-disable-next-line import/no-extraneous-dependencies
const express = require('express');
// eslint-disable-next-line import/no-extraneous-dependencies
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const pg = require('pg');

const Waiters = require('./services/waiters');
// eslint-disable-next-line no-unused-vars
const { Pool } = pg;

let useSSL = false;
const local = process.env.LOCAL || false;
if (process.env.DATABASE_URL && !local) {
  // eslint-disable-next-line no-unused-vars
  useSSL = true;
}
const connectionString = process.env.DATABASE_URL || 'postgresql://codex:pg123@localhost:5432/waiters';

const pool = new Pool({
  // eslint-disable-next-line no-undef
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

const app = express();
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

const waiterAvail = Waiters(pool);
let name = '';

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/', async (req, res) => {
  name = req.body.inputName;
  // eslint-disable-next-line no-unused-expressions
  name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  await waiterAvail.setName(name);
  // eslint-disable-next-line no-console
  res.redirect(`/${name}`);
});

// eslint-disable-next-line comma-spacing
app.get('/:name', (req,res) => {
  req.params.name = name;
  res.render('days', { name });
});

app.post('/:name', async (req, res) => {
  req.params.name = name;
  await waiterAvail.setNameID();
  await waiterAvail.selectShift(req.body.days);
  res.redirect(`/${name}`);
});

app.get('/waiters/admin', (req, res) => {
  res.render('owner');
});

app.post('/waiters/admin', (req, res) => {
  waiterAvail.resetData();
  res.redirect('/waiters/admin');
});

const PORT = process.env.PORT || 3005;

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log('App starting on port', PORT);
});
