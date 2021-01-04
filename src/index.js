const PORT  = 3001;
const express = require('express');
const app = express();
const cors = require('cors')
const bodyParser = require('body-parser');
const userRoutes = require('./routes/users');
const roomRoutes = require('./routes/rooms');
//PG database client set up
const { Pool }  = require('pg');
const dbParams = require('./lib/db.js');
const db = new Pool(dbParams);
db.connect(() => {
  console.log('database connected');
});
// APP Configuration
app.use(cors())
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());



const usersRouter = express.Router();
const roomsRouter = express.Router();
userRoutes(usersRouter, db);
roomRoutes(roomsRouter,db)
app.use('/api/users', usersRouter);
app.use('/api/rooms', roomsRouter);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
});