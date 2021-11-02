const flash = require('express-flash');
const session = require('express-session');
const express = require('express');
// eslint-disable-next-line import/no-extraneous-dependencies
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const pg = require('pg');

const Waiters = require('./services/waiters');
const Route = require('./routes/waitersRoutes');
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
const availabilityRoutes = Route(waiterAvail);

// let weekday = [];
app.get('/', availabilityRoutes.home);

app.post('/', availabilityRoutes.getNames);

// eslint-disable-next-line comma-spacing
app.get('/:name',availabilityRoutes.setDays);

app.post('/:name', availabilityRoutes.getDays);

app.post('/waiters/logout', availabilityRoutes.logout);

app.get('/waiters/admin', availabilityRoutes.waitersAvailable);

app.post('/waiters/admin', availabilityRoutes.schedule);

const PORT = process.env.PORT || 3005;

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log('App starting on port', PORT);
});
