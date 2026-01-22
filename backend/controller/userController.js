const dbconnect = require('../Middleware/Dbconnect');
const jwt = require('jsonwebtoken');
//Get All user
const getUsers = async (req, res) => {
    try {
        dbconnect.query('SELECT * FROM "User" ORDER BY -id ASC ', (err, result) => {
            if (err) {
                res.status(500).json({
                    success: false,
                    msg: "ดึงข้อมูลผู้ใช้งานไม่สำเร็จ",
                    data: err
                });
            } else {
                res.status(200).json({
                    success: true, // Changed from false to true to indicate success
                    msg: "ดึงข้อมูลผู้ใช้งานได้สำเร็จ",
                    data: result.rows // PostgreSQL query result has a 'rows' property
                });
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "มีปัญาเกิดขึ้นระว่างการดึงข้อมูล",
            data: error
        });
    }
};

//login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Login attempt:', email, password);
        // Validate input
        if (!email || !password) {
            return res.status(401).json({ msg: 'Email and password are required' });
        }

        // const sql = 'SELECT * FROM "User" WHERE "email" = $1';
        const sql = `
            SELECT 
                u.user_id,
                u.email,
                u.username,
                u.password,
                u.position,
                ro.role_option_name
            FROM "User" u
            LEFT JOIN "Role_Item" ri
                ON u.user_id = ri.user_id
            LEFT JOIN "Role_Option" ro
                ON ri.role_item = ro.role_option_id
            WHERE "email" = $1
        
        `
        dbconnect.query(sql, [email], (err, result) => {
            if (err) {
                console.error('Query error:', err);
                return res.status(500).json({ msg: 'Database query error' });
            }

            // Check if user exists
            if (result.rows.length === 0) {
                console.log(result.rows);
                return res.status(401).json({ msg: 'Invalid email or password' });
            }

            // Get user from database
            const user = result.rows[0];
            const users = result.rows;
            console.log('User found:', user);

            // Compare passwords (assuming no hashing, raw password comparison)
            if (password !== user.password) {
                return res.status(401).json({ msg: 'Invalid email or password' });
            }

            // Generate JWT token (Include id, email in object)
            const token = jwt.sign({ id: user.id, email: user.email }, process.env.SECRET, { expiresIn: '10h' });

            // Respond with the token
            res.status(200).json({ token: token, data: users });
            // console.log('token', token);
            // console.log('user', user);
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ msg: 'Error logging in' });
    }
};

module.exports ={
    getUsers,
    login,
}