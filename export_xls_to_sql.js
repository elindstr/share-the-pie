const xlsx = require('xlsx');
const mysql = require('mysql2');
require('dotenv').config();

// Create schema
async function create_schema(db) {
    await db.execute(`
        CREATE TABLE ucd_comp (
            id INT AUTO_INCREMENT PRIMARY KEY,
            department_code INT,
            department_description VARCHAR(256),
            employee_name VARCHAR(256),
            hire_date DATE,
            job_code VARCHAR(256),
            job_code_description VARCHAR(256),
            comp_frequency VARCHAR(256),
            comp_rate DECIMAL(10,2),
            normalized_annual DECIMAL(10,2),
            normalized_hourly DECIMAL(10,2)
        );
    `);
}

// Read the Excel file
async function read_xls() {
    const workbook = xlsx.readFile('./db/db.xlsx');
    const sheetNameList = workbook.SheetNames;
    return data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetNameList[0]]);
}
// Convert Excel serial date to JavaScript Date
function excelSerialDateToDate(serial) {
    const utc_days = Math.floor(serial - 25569);
    const utc_value = utc_days * 86400; 
    const date_info = new Date(utc_value * 1000);

    const fractional_day = serial - Math.floor(serial) + 0.0000001;

    let total_seconds = Math.floor(86400 * fractional_day);

    const seconds = total_seconds % 60;
    total_seconds -= seconds;

    const hours = Math.floor(total_seconds / (60 * 60));
    const minutes = Math.floor(total_seconds / 60) % 60;

    return new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate(), hours, minutes, seconds);
}
// Format a JavaScript Date as a MySQL date string
function formatDateForMySQL(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Insert data
async function insert_rows(data, db) {
    for (let row = 0; row < data.length; row++) {
        const row_array = Object.values(data[row]);

        const excelDate = parseFloat(row_array[3]);
        const jsDate = excelSerialDateToDate(excelDate);
        row_array[3] = formatDateForMySQL(jsDate);
        
        await db.query(`INSERT INTO ucd_comp_db.ucd_comp (
            department_code,
            department_description,
            employee_name,
            hire_date,
            job_code,
            job_code_description,
            comp_frequency,
            comp_rate,
            normalized_annual,
            normalized_hourly
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, row_array);
        console.log(`Inserted ${row} of ${data.length}`);
    }
}

async function main() {
    const db = await mysql.createConnection(
        {
            host: 'localhost',
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
        },
        console.log(`Connected to database.`)
    ).promise();
    await db.execute(`DROP DATABASE IF EXISTS ucd_comp_db;`);
    await db.execute(`CREATE DATABASE ucd_comp_db;`);
    await db.changeUser({database: 'ucd_comp_db'});
    await create_schema(db)

    const data = await read_xls()
    await insert_rows(data, db)

    await db.end();
}

main()