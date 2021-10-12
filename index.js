const express = require('express');
// eslint-disable-next-line import/no-extraneous-dependencies
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const pg = require('pg');

const { Pool } = pg;

let useSSL = false;
const local = process.env.LOCAL || false;
if (process.env.DATABASE_URL && !local) {
  // eslint-disable-next-line no-unused-vars
  useSSL = true;
}

// const pool = new Pool({
//     connectionString,
//     ssl: {
//       rejectUnauthorized: false,
//     },
//   });

  const app = express();
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.get('/', function(req, res){
    res.render('index');
});


let PORT = process.env.PORT || 3005;

app.listen(PORT, function () {
  console.log('App starting on port', PORT);
});