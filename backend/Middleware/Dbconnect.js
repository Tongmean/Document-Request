const { Pool } = require('pg');
require('dotenv').config();

// Create a new pool with connection details
const dbconnect = new Pool({
  user: 'postgres',       // Your PostgreSQL username
  host: '192.168.4.239',            // Database host (e.g., localhost)
  database: 'Document_Drawing',    // Your PostgreSQL database name
  password: '230604',    // Your PostgreSQL password
  port: 5432, 

});
dbconnect.connect((err, client, release) => {
  if (err) {
    console.error('Error acquiring client', err.stack);
  } else {
    console.log('Connection to PostgreSQL successful!');
    release();  // Release the client back to the pool
  }
});


module.exports = dbconnect;