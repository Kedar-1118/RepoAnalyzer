require('dotenv').config();
const pool = require('./src/config/database');

async function downgradeUser() {
    const username = process.argv[2];
    if (!username) {
        console.error("Please provide a username, e.g. node make-user.js <username>");
        process.exit(1);
    }
    
    try {
        const { rowCount } = await pool.query("UPDATE users SET role = 'user' WHERE github_username = $1", [username]);
        if (rowCount > 0) {
            console.log(`Successfully reverted ${username} back to a standard user (developer) role.`);
        } else {
            console.log(`User ${username} not found in database.`);
        }
    } catch(err) {
        console.error(err);
    } finally {
        pool.end();
    }
}
downgradeUser();
