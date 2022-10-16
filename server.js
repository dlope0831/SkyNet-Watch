const express = require('express');
// const routes = require('./routes');
const sequelize = require('./config/connection');
const exphbs = require('express-handlebars');
const path = require('path');

const hbs = exphbs.create({});

const app = express();
const PORT = process.env.PORT || 3001;

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(require('./controllers'));

// app.use(routes);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});