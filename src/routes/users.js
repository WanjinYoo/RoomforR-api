const { query } = require("express");

module.exports = (router, db) => {

  router.get('/', (req, res) => {
    db.query(`
    SELECT
     *
    FROM users`)
  .then((data) => {
    res.json(data.rows);
  })
  });

  router.get('/:id', (req, res) => {
    db.query(`
    SELECT mylist.id as id,address,price,description 
    FROM users 
    JOIN mylist on users.id = mylist.user_id 
    JOIN rooms on room_id = rooms.id
    WHERE users.id = ${req.params.id}`)
  .then((data) => {
    res.json(data.rows);
  })


  });
  router.post('/login/', (req, res) => {
    const logInInfo = req.body;
    queryParams = [
      logInInfo.Email,
      logInInfo.password
    ]
    db.query(`
    SELECT
     *
    FROM users
    WHERE email = $1 AND password = $2;`,queryParams)
    .then((data) => {
      if(!data.rows.length) {
        res.status(403).send('invalid information');
      }
      else {
        res.json(data.rows);
      }
    })
    .catch(()=> {
      res.status(403).send('invalid information');
    })
  })
  router.post('/mylist',(req,res) => {
    const saveInfo = req.body;
    queryParams = [
      saveInfo.userid,
      saveInfo.roomid
    ]
    db.query(`
    SELECT
     *
    FROM mylist
    WHERE user_id = $1 AND room_id = $2`, queryParams)
    .then((data) => {
      if(!data.rows.length) {
        db.query(`INSERT INTO mylist (user_id,room_id)
        VALUES ($1,$2);`,queryParams)
        res.send('Successful')
      }
      else {
        res.status(403).send('Already in the list');
      }
    })
  })


  router.post('/signup/', (req,res) => {
    const userData = req.body;
    queryParams = [
      userData.Email,
      userData.phoneNumber,
      userData.name,
      userData.password,
    ]

    //Check if the email exists in the database.
    db.query(`
    SELECT
     *
    FROM users
    WHERE email = $1`,[userData.Email])
    .then((data) => {

      if(!data.rows.length) {
        db.query(`INSERT INTO users (name,phoneNumber,email,password)
        VALUES ($3,$2,$1,$4);`,queryParams)
        res.send('Successful')
      }
      else {
        res.status(403).send('Invalid Email');
      }
    })
  })

  router.delete('/list/:id', (req,res) => {
    
    db.query(`
    DELETE FROM mylist WHERE id = $1`,[req.params.id])
  })

}