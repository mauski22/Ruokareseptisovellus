const express = require('express');
const mysql = require('mysql')
const cors = require('cors')



const db = mysql.createConnection({
    host: "127.0.0.1",
    port: 3307,
    user: "root",
    password:"Ruutti",
    database: "reseptisovellus",
    waitForConnections: true
});

const app = express();
app.use(express.json());
app.use(cors());


app.get('/', (re, res)=> {
    return res.json("From backend");
})

app.get('/users', (req, res) => {
    const sql = "SELECT * FROM users"; 
    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    })
})

app.listen(8081, () => {
    console.log("KUUNTELEN")
})

app.post('/register', (req, res) => {
    try {
    const sql = "INSERT INTO users (nickname, name, email, password, user_role) VALUES (?, ?, ?, ?, ?)";
    const values = [
        req.body.nickname,
        req.body.name,
        req.body.email,
        req.body.password,
        req.body.user_role  /*USER ROLE VOI OLLA AINOASTAAN JOKO 'superadmin', 'user' tai 'viewer'          */
    ];
    db.query(sql, values, (err) => {
        if(err) return res.status(500).json("Error rekisteröinnissä" + err);
        return res.status(200).json("Rekisteröinti onnistui")
    }); 
    }
    catch (error) {
        return res.status(500).json("Error rekisteröinnissä: " + error);
    }
});
app.post('/photos', (req, res) => {
    try {
        const sql = "INSERT INTO photos (recipe_id, url) VALUES (?, ?)"
        const values = [req.body.recipe_id, req.body.url]
        db.query(sql, values, (err) => {
            if (err) return res.status(500).json("Kuvien lisäys epäonnistui" + err);
            return res.status(200).json("Kuvien lisäys onnistui")
        })
    }
    catch (error) {
        return res.status(500).json("Kuvien lisäys epäonnistui" + error)
    }
})

app.post('/recipes', (req, res) => {
    try {
        const sql = "INSERT INTO Recipes (title, author_id, description, visibility) VALUES (?, ?, ?, ?)"
        const values = [req.body.title, req.body.author_id, req.body.description, req.body.visibility]
        db.query(sql, values, (err) => {
            if(err) return res.status(500).json("Reseptin lisäys epäonnistui"+ err)
            return res.status(200).json("Reseptin lisäys onnistui")
        })
    }
    catch (error) {
        return res.status(500).json("Reseptin lisäys epäonnistui" + error)
    }
})

app.post('/login', (req, res) => {
    const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
    const values = [
        req.body.email,
        req.body.password
    ]
    db.query(sql, [req.body.email, req.body.password], (err, data) => {
        if(err) return res.json("Login Failed");
        if (data.length > 0) {
            return res.json("Login Successfully")
        }
        else {
            res.json("Eipä ollut login oikein")
        }
    })
})
app.delete('/delete/:id', (req, res) => {
    const sql = "DELETE FROM users WHERE user_id = ?";
    const user_id = req.params.id; 
    db.query (sql, [user_id], (err, result) => {
        if(err) {return res.status(500).json("Error rekisteröinnissä: " + err);}
        else { return res.status(200).json("Poisto onnistui:");
        }
    }
    )
})