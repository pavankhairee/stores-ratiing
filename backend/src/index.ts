import pg, { Client } from "pg"
import express from "express"
import { DB_BACKEND } from "./database/config";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
import { JWT_TOKEN } from "./database/config";
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
        response: response.rows
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



app.listen(3000);