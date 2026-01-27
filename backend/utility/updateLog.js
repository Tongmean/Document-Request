// logging.js
const dbconnect = require('../Middleware/Dbconnect'); 
async function logUpdate(table, column, record_id, oldValue, newValue, action, action_by) {
    const query = `
        INSERT INTO "newDrawingrequest".update_log(table_name, column_name, record_id, old_value, new_value, acion, action_by)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
    `;
    const values = [table, column, record_id, oldValue, newValue, action, action_by];
    
    try {
        // Ensure the query is properly awaited
        await dbconnect.query(query, values);
        // Optionally log success
        // console.log("History Log successfully inserted");
    } catch (err) {
        console.error('Error logging update:', err); // Log the error if something goes wrong
    }
}

module.exports = {
    logUpdate
};

