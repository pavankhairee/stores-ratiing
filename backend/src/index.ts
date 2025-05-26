import pg, { Client } from "pg"
import express from "express"
import { DB_BACKEND } from "./database/config";
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken';
import { JWT_TOKEN } from "./database/config";
import { authMiddleware } from "./middleware/authMiddleware";
const app = express();
app.use(express.json());

const pgClient = new pg.Client(DB_BACKEND);
pgClient.connect();


app.post('/app/user/signup', async (req, res) => {

    const { name, email, password, address } = req.body;
    const role = 'user'
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


app.listen(3000);