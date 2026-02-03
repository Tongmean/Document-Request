const dbconnect = require('../Middleware/Dbconnect');
const jwt = require('jsonwebtoken');
const {getAlluserService, postUserservice, getSingleuserService , updatedUserservice} = require('../Service/userSevice')
const {deleteRoleitemsService, getUserroleItemsService, postRoleitemsService, getRoleoptionService, getSingleroleitemService, updatedRoleitemsService} = require('../Service/roleItemsservice')
//Get All user
const getAlluserController = async (req, res) =>{
    const payload = req.body
    try {
        const result = await getAlluserService(payload);
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
const getUserroleItemsController = async (req, res) =>{
    try {
        const result = await  getRoleoptionService();
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

const postUser = async (req, res) =>{
    const payload = req.body
    const {user_id, email, position} = req.user[0];
    // console.log('payload', payload)
    // console.log('req.user[0]',req.user[0])
     try {
        await dbconnect.query('BEGIN');
        //01 post user
        const postUserresult = await postUserservice(payload, req.user[0].user_id);
        // console.log('postUserresult', postUserresult)
        const user_id = postUserresult[0].user_id;

        //02 post role Items
        const insertRoleitems = []
        for (const item of payload.roleItems){
            const roleItem = {
                user_id: user_id,
                role_item: item.role_id
            }
            result = await postRoleitemsService(roleItem)
            insertRoleitems.push(result[0])
        }

        await dbconnect.query('COMMIT');
        res.status(200).json({
            success: true,
            msg: `คุณได้ลงทะเบียน  ${payload.email} สำเร็จแล้ว ครับบบบ`,
            data: {
                postUserresult: postUserresult,
                insertRoleitems: insertRoleitems
            }
        });
    } catch (error) {
        await dbconnect.query('ROLLBACK');
        console.error(error);
        res.status(500).json({
        success: false,
        msg: `คุณได้ลงทะเบียน  ${payload.email} ไม่สำเร็จแล้ว ครับบบบ`,
        error: error.message
        });
    }
}

const getRoleOptioncontroller = async (req, res) =>{
    try {
        const result = await getRoleoptionService(payload);
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


//get user // role item by user_id
const getUserandroleitemsbyuser_id = async (req, res) => {
    const payload = req.body
    try {
        const userResult = await getSingleuserService(payload);
        const roleitemResult = await getSingleroleitemService(payload);
        res.status(200).json({
            success: true,
            msg: 'Request No fetched successfully',
            data: {
                user: userResult,
                roleItems: roleitemResult
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
        success: false,
        msg: 'An error occurred while fetching the Request No',
        error: error.message
        });
    }
}

const updatedUsercontroller = async (req, res) =>{
    const payload = req.body
    console.log('payload', payload)
    try {
        await dbconnect.query('BEGIN');
        //01 update user
        const updateUserresult = await updatedUserservice(payload);
        const user_id = updateUserresult[0].user_id;
        //02 get role items by user_id
        const getRoleitems = await getSingleroleitemService({user_id: user_id});
        const exitRoleid = getRoleitems.map((item) => item.role_id);
        //03 incomming role items(new)
        const incomingRoleitems = payload.roleItems.map((item) => item.role_id);
        //04 delete role items 
        const toDelete = exitRoleid.filter((role_id) => !incomingRoleitems.includes(role_id));
        const insertDeleted = []
        if(toDelete.length > 0){
            for(const item of toDelete){
                const result = await deleteRoleitemsService({role_id: item.role_id});
                insertDeleted.push(result[0].role_id)
            }
        }
        //05 add new role items
        const insertpostRoleitems = []
        const insertupateRoleitems = []
        for(const item of payload.roleItems){
            if(!exitRoleid.includes(item.role_id)){
                const roleItem = {
                    user_id: user_id,
                    role_item: item.role_id
                }
                const result = await postRoleitemsService(roleItem)
                insertpostRoleitems.push(result[0].role_id)
            } else {
                //update role items if needed
                const result = await updatedRoleitemsService({
                    user_id: user_id,
                    role_item: item.role_id,
                    role_id: item.role_id
                })
                insertupateRoleitems.push(result[0].role_id)
            }
        }
        await dbconnect.query('COMMIT');
             res.status(200).json({
            success: true,
            msg: `Ur user ${payload.email} has been updated successfully`,
            data: {
                updateUserresult: updateUserresult,
                insertDeleted:insertDeleted,
                insertupateRoleitems: insertupateRoleitems,
                insertpostRoleitems: insertpostRoleitems
            }
        });
        console.log('data', data)
    } catch (error) {
        console.log('error', error);
        await dbconnect.query('ROLLBACK')
        res.status(500).json({
            success: false,
            msg: 'An error occurred while fetching the Request No',
            error: error.message
        });
    }
}
module.exports ={
    login,
    getAlluserController,
    getUserroleItemsController,
    postUser,
    getRoleOptioncontroller,
    getUserandroleitemsbyuser_id,
    updatedUsercontroller
}

