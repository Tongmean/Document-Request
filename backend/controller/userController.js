const dbconnect = require('../Middleware/Dbconnect');
const jwt = require('jsonwebtoken');
const {getAlluserService} = require('../Service/userSevice')
//Get All user
const getAlluserController = async (req, res) =>{
    try {
        const result = await getAlluserService();
        res.status(200).json({
            success: true,
            msg: 'Request No fetched successfully',
            data: result
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
        success: false,
        msg: 'An error occurred while fetching the Request No',
        error: error.message
        });
    }
}

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
    login,
    getAlluserController
}

