import { Client } from 'pg';
import express from "express"
import { DB_BACKEND } from "./database/config";
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken';
import { JWT_TOKEN } from "./database/config";
import { authMiddleware } from "./middleware/authMiddleware";
const app = express();
app.use(express.json());

const pgClient = new Client(DB_BACKEND);
pgClient.connect();

//admin@example.com
//Admin@123

app.post('/app/admin/add-user', authMiddleware, async (req, res) => {

    const { name, email, password, address, role } = req.body;
    //@ts-ignore
    if (req.user.role !== 'admin') {
        res.json({
            error: "Access Denied"
        })
    }

    if (!['user', 'store_owner', 'admin'].includes(role)) {
        res.json({
            error: "Invalid role"
        })
    }

    const userRole = ['user', 'admin', 'store_owner'].includes(role) ? role : 'user'

    const hash = await bcrypt.hash(password, 10);
    const InsertQuery = `INSERT INTO users (name, email, password, address, role) VALUES ($1,$2,$3,$4,$5)`
    const response = await pgClient.query(InsertQuery, [name, email, hash, address, userRole])

    res.json({
        message: `${role} user added successfully`,
        user: response.rows[0]
    })

})


app.post('/app/admin/add-store', authMiddleware, async (req, res) => {

    const { name, email, address, owner_id } = req.body;

    const InsertQuery = `INSERT INTO stores (name, email, address, owner_id) VALUES($1, $2, $3, $4)`;
    const response = await pgClient.query(InsertQuery, [name, email, address, owner_id]);

    res.json({
        message: "Store created Successfully",
        response: response.rows[0]
    })

})

app.get('/app/admin/dashboard/stats', authMiddleware, async (req, res) => {

    //@ts-ignore
    if (req.user.role !== 'admin') {
        res.json({
            error: "Access Denied"
        })
    }

    const totalUsers = await pgClient.query(`SELECT COUNT(*) FROM users`)
    const totalStores = await pgClient.query(`SELECT COUNT(*) FROM stores`)
    const totalRatings = await pgClient.query(`SELECT COUNT(*) FROM ratings`)

    res.json({
        totalUsers: Number(totalUsers.rows[0].count),
        totalStores: Number(totalStores.rows[0].count),
        totalRatings: Number(totalRatings.rows[0].count),
    })
})

app.get('/app/admin/dashboard/stores', authMiddleware, async (req, res) => {

    //@ts-ignore
    if (req.user.role !== 'admin') {
        res.json({
            error: "Access Denied"
        })
    }

    const storesDetails = await pgClient.query(`SELECT s.name, s.email, s.address, ROUND(AVG(r.rating), 2) AS rating FROM stores s LEFT JOIN ratings r ON s.id = r.store_id GROUP BY s.id`);
    res.json({
        storesDetails: storesDetails.rows
    })
})

app.get('/app/admin/dashboard/users', authMiddleware, async (req, res) => {

    //@ts-ignore
    if (req.user.role !== 'admin') {
        res.json({
            error: "Access Denied"
        })
    }

    const usersDetails = await pgClient.query(`SELECT u.name, u.email, u.address, u.role, ROUND(AVG(r.rating), 2) AS owner_rating
                                               FROM  users u LEFT JOIN  stores s ON u.id = s.owner_id LEFT JOIN ratings r ON s.id = r.store_id 
                                               GROUP BY u.id, u.name, u.email, u.address, u.role;`);
    res.json({
        usersDetails: usersDetails.rows
    })
})

app.post('/app/user/signup', async (req, res) => {

    const { name, email, password, address } = req.body;
    const role = 'users';
    const hash = await bcrypt.hash(password, 10);
    const InsertQuery = `INSERT INTO users (name, email, password, address, role) VALUES($1, $2, $3, $4, $5)`
    const response = await pgClient.query(InsertQuery, [name, email, hash, address, role])

    res.json({
        message: "You are signup",
        response: response.rows[0]
    })

})


app.post('/app/user/login', async (req, res) => {


    const { email, password } = req.body;
    const query = `SELECT * FROM users WHERE email = $1`
    const result = await pgClient.query(query, [email]);
    const user = result.rows[0];

    if (!user || !(bcrypt.compare(password, user.password))) {
        res.json({
            error: "Invalid Credentials"
        })
    }

    const token = jwt.sign({
        id: user.id,
        role: user.role
    }, JWT_TOKEN)

    res.json({
        token,
        role: user.role
    })

})

app.post('/app/user/password-update', authMiddleware, async (req, res) => {

    const { oldPassword, newPassword } = req.body;
    //@ts-ignore
    const userId = req.id;

    const query = `SELECT password FROM users WHERE id = $1`
    const response = await pgClient.query(query, [userId])
    const user = response.rows[0]

    if (!user || !(await bcrypt.compare(oldPassword, user.password))) {
        res.json({
            error: "Old Password is incorrect"
        })
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    const updateQuery = `UPDATE users SET password = $1 WHERE id = $2`
    await pgClient.query(updateQuery, [newPasswordHash, userId])

    res.json({
        message: "Password updated successfully",
        response: response.rows[0]
    })

})

app.post('/app/user/rating', authMiddleware, async (req, res) => {

    const { user_id, store_id, rating } = req.body;

    const InsertQuery = `INSERT INTO ratings(user_id, store_id, rating) VALUES ($1,$2,$3) 
                        ON CONFLICT (user_id, store_id) 
                        DO UPDATE SET rating = EXCLUDED.rating, updated_at = CURRENT_TIMESTAMP`;

    const response = await pgClient.query(InsertQuery, [user_id, store_id, rating]);

    res.json({
        message: "Rating Submmittedd successfully",
        response: response.rows[0]
    })
})

app.get('/app/user/allstores', authMiddleware, async (req, res) => {

    const storesList = await pgClient.query(`SELECT * FROM stores`)

    res.json({
        storesList: storesList.rows
    })
})

app.get('/app/stores/search', async (req, res) => {
    const { query } = req.query;
    //@ts-ignore
    if (!query || query.trim() === '') {
        res.status(400).json({ error: "Search query is required" });
    }
    //@ts-ignore
    const searchTerm = `%${query.toLowerCase()}%`;

    try {
        const searchQuery = `
            SELECT 
                s.id,
                s.name,
                s.address,
                ROUND(AVG(r.rating), 2) AS overall_rating
            FROM stores s
            LEFT JOIN ratings r ON s.id = r.store_id
            WHERE LOWER(s.name) ILIKE $1 OR LOWER(s.address) ILIKE $1
            GROUP BY s.id
        `;

        const result = await pgClient.query(searchQuery, [searchTerm]);

        res.json({
            stores: result.rows
        });

    } catch (error) {
        console.error("Search error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


app.listen(3000);