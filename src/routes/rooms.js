module.exports = (router, db) => {

  router.get('/', (req, res) => {
    db.query(`
    SELECT
     *
    from rooms`)
  .then((data) => {
    res.json(data.rows);
  })
  });
  

}