// const router = require('express').Router();
// // Import our modular routers for /tips and /feedback
// const tipsRouter = require('./tips');
// const feedbackRouter = require('./feedback');
// router.use('/tips', tipsRouter);
// router.use('/feedback', feedbackRouter);
const router = require('express').Router();
const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection(
  {
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'ucd_comp_db'
  },
  console.log(`Connected to database.`)
).promise();

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
