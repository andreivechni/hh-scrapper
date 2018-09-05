const express = require('express');
const app = express();

const db = require('./models/index');
const refresh = require('./routes/index');

app.set('views', './views');
app.set('view engine', 'pug');

app.use('/', refresh);

app.listen(3000, () => console.log('http://localhost:3000/index/0'));
