const flash = require('express-flash');
const session = require('express-session');
const express = require('express');
// eslint-disable-next-line import/no-extraneous-dependencies
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const pg = require('pg');

const Waiters = require('./services/waiters');
// const waiters = require('./services/waiters');
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
app.use(session({
  secret: 'Message to clear database',
  cookie: {
    maxAge: 2000,
  },
  resave: false,
  saveUninitialized: true,
}));

// initialise the flash middleware
app.use(flash());
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

const waiterAvail = Waiters(pool);
let name = '';

// let weekday = [];
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

app.get('/waiters/admin', async (req, res) => {
  const waitering = await waiterAvail.getWaiters();
  // week = await waitersService.daysColor();

  const Monday = [];
  const Tuesday = [];
  const Wednesday = [];
  const Thursday = [];
  const Friday = [];
  const Saturday = [];
  const Sunday = [];

  // eslint-disable-next-line max-len
  // const myClass = [{ Class: 'Sun' }, { Class: 'Mon' }, { Class: 'Tue' }, { Class: 'Wed' }, { Class: 'Thu' }, { Class: 'Fri' }, { Class: 'Sat' }];

  for (const x of waitering) {
    if (x.daysweek === 'Monday') {
      Monday.push(x.names);
    }
    if (x.daysweek === 'Tuesdays') {
      Tuesday.push(x.names);
    }
    if (x.daysweek === 'Wednesday') {
      Wednesday.push(x.names);
    }
    if (x.daysweek === 'Thursday') {
      Thursday.push(x.names);
    }
    if (x.daysweek === 'Friday') {
      Friday.push(x.names);
    }
    if (x.daysweek === 'Saturday') {
      Saturday.push(x.names);
    }
    if (x.daysweek === 'Sunday') {
      Sunday.push(x.names);
    }
  }

  res.render('owner', {
    Monday,
    Tuesday,
    Wednesday,
    Thursday,
    Friday,
    Saturday,
    Sunday,

  });
});

app.post('/waiters/admin', (req, res) => {
  req.flash('reset', 'There are currently no waiters available to work for the week.');
  waiterAvail.resetData();
  res.redirect('/waiters/admin');
});

const PORT = process.env.PORT || 3005;

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log('App starting on port', PORT);
});
