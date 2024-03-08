// const router = require('express').Router();
// // Import our modular routers for /tips and /feedback
// const tipsRouter = require('./tips');
// const feedbackRouter = require('./feedback');
// router.use('/tips', tipsRouter);
// router.use('/feedback', feedbackRouter);
const router = require('express').Router();
const mysql = require('mysql2');
const url = require('url');
require('dotenv').config();

let dbConfig;
if (process.env.JAWSDB_MARIA_URL) {
  const connectionUrl = new url.URL(process.env.JAWSDB_MARIA_URL);
  
  dbConfig = {
    host: connectionUrl.hostname,
    user: connectionUrl.username,
    password: connectionUrl.password,
    database: connectionUrl.pathname
  };
} else {
  dbConfig = {
    host: 'localhost',
    user: 'yourLocalUsername',
    password: 'yourLocalPassword',
    database: 'yourLocalDBName',
  };
}
const db = mysql.createConnection(dbConfig).promise();


router.get('/by_name', async (req, res) => {
    console.info(`${req.method} request at ${req.url}`);
    const { first_name, last_name } = req.query;
    const query = `SELECT * FROM ucd_comp WHERE employee_name LIKE CONCAT(?, '%')`;
     
    try {
        const [result] = await db.execute(query, [`${last_name},${first_name}`]);
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

module.exports = router;
