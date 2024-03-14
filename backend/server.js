const express = require('express');
const mysql = require('mysql')
const cors = require('cors')
const multer  = require('multer')


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

app.listen(8081, () => {
    console.log("KUUNTELEN")
})
app.use('/images', express.static('public/images'));

const storage  = multer.diskStorage({
    destination: function(req, file, cb) {
        return cb(null, "./public/images")
    },
    filename: function(req, file, cb) {
        return cb(null, `${Date.now()}_${file.originalname}`)
    }
})

const upload = multer({storage})

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
app.get('/users/:id', (req, res) => {
    const sql = "SELECT * FROM users WHERE user_id = ?"; 
    const user_id = req.params.id
    db.query(sql, [user_id], (err, data) => {
        if(err) return res.status(500).json("Error yskittäisen käyttäjän haussa: " + err)
        return res.status(200).json(data); 
    })
})
app.get('/recipes', (req, res) => {
    const sql = "SELECT * FROM recipes"; 
    db.query(sql, (err, data) => {
        if(err) return res.status(500).json("Error reseptien haussa: " + err)
        return res.status(200).json(data); 
    })
})
//yksittäisen reseptin haku pelkällä id:llä 
//postmanissa osoite pitää olla muotoa http://localhost:8081/recipes/2 esimerkiksi 
app.get('/recipes/:id', (req, res) => {
    const sql = "SELECT * FROM recipes WHERE author_id = ?"; 
    const recipe_id = req.params.id
    db.query(sql, [recipe_id], (err, data) => {
        if(err) return res.status(500).json("Error käyttäjän reseptien haussa: " + err)
        return res.status(200).json(data); 
    })
})
app.get('/kayttajanreseptienhaku/:id', (req, res) => {
    const sql = "SELECT r.recipe_id, r.title, r.author_id, r.description, r.visibility, DATE(r.created_at) AS created_at, DATE(r.updated_at) AS updated_at, GROUP_CONCAT(DISTINCT CONCAT(i.name, ' (' , i.quantity, ')')) AS ingredients, GROUP_CONCAT(DISTINCT p.image SEPARATOR ', ') AS photos FROM recipes r LEFT JOIN ingredients i ON r.recipe_id = i.recipe_id LEFT JOIN photos p ON r.recipe_id = p.recipe_id WHERE r.recipe_id = ? GROUP BY r.recipe_id;"; 
    const recipe_id = req.params.id
    db.query(sql, [recipe_id], (err, data) => {
        if(err) return res.status(500).json("Error yskittäisen reseptin haussa: " + err)
        data.forEach(row => {
            row.created_at = row.created_at.toISOString().split('T')[0];
            row.updated_at = row.updated_at.toISOString().split('T')[0];
        });
        return res.status(200).json(data); 
    })
})
app.get('/reseptienIDEIDENHAKU/:id', (req, res) => {
    const sql = "SELECT recipe_id FROM recipes WHERE author_id = ?"; 
    const recipe_id = req.params.id
    db.query(sql, [recipe_id], (err, data) => {
        if(err) return res.status(500).json("Error käyttäjän reseptien haussa: " + err)
        return res.status(200).json(data); 
    })
})
app.get('/ingredients', (req, res) => {
    const sql  = "SELECT * FROM ingredients"; 
    db.query(sql, (err, data) => {
        if (err) return res.status(500).json("Error ainesosien haussa: " +err)
        return res.status(200).json(data); 
    })
})
app.get('/photos', (req, res) => {
    const sql = "SELECT * FROM photos"; 
    db.query(sql, (err, data) => {
        if (err) return res.status(500).json("Error kuvien haussa: " +err)
        return res.status(200).json(data)
    })
})
app.post('/recipesidhaku', (req, res) => {
    const sql = "SELECT recipe_id FROM recipes WHERE title = ? AND author_id = ? AND description = ?"
    const values = [
        req.body.title,
        req.body.author_id,
        req.body.description
    ]
    db.query(sql, values, (err, data) => {
        if(err) return res.status(500).json("Error resepti_ID:n haussa" + err)
        if(data.length > 0 ) {
            const recipeid = data[0].recipe_id
            return res.json(recipeid);
        }
        else {
            res.status("Error resepti_ID:n haussa")
        }
     })
}
)
app.post('/register', (req, res) => {
    try {
        const checkEmailSql = "SELECT * FROM users WHERE email = ?";
        db.query(checkEmailSql, [req.body.email], (err, result) => {
            if (err) return res.status(500).json("Error rekisteröinnissä: " + err);
            if (result.length > 0) {
                return res.status(400).json("Sähköposti on jo käytössä");
            } else {
                const sql = "INSERT INTO users (nickname, name, email, password, user_role) VALUES (?, ?, ?, ?, ?)";
                const values = [
                    req.body.nickname,
                    req.body.name,
                    req.body.email,
                    req.body.password,
                    req.body.user_role
                ];
                db.query(sql, values, (err) => {
                    if(err) return res.status(500).json("Error rekisteröinnissä: " + err);
                    return res.status(200).json("Rekisteröinti onnistui");
                });
            }
        });
    } catch (error) {
        return res.status(500).json("Error rekisteröinnissä: " + error);
    }
});

app.post('/photoslisays', upload.single('file'), (req, res) => {
    const sql = "INSERT INTO photos (recipe_id, image) VALUES (?)";
    const values = [
        req.body.recipe_id,
        req.file.filename
    ]
    db.query(sql, [values], (err, result) => {
      if (err) {
        console.error("Kuvan lisäys epäonnistui", err);
        return res.status(500).json({message: "Kuvan lisäys epäonnistui"});
      }
      return res.status(200).json({message: "Kuvan lisäys onnistui", result});
    });
  });
  

  app.post('/recipeslisays', (req, res) => {
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

app.post('/ingredients', (req, res) => {
    try {
        const sql = "INSERT INTO ingredients (recipe_id, name, quantity) VALUES (?, ?, ?)"
        const values  = [req.body.recipe_id, req.body.name, req.body.quantity];
        db.query(sql, values, (err) => {
            if(err) return res.status(500).json("Ainesosien lisäys epäonnistui" + err)
            return res.status(200).json("Ainesosan lisäys onnistui")
        })
    }
    catch (error) {
        return res.status(500).json("Ainesosien lisäys epäonnistui"+ error)
    }
})
app.post('/ratings', (req, res) => {
    try {
        const sql = "INSERT INTO ratings (recipe_id, user_id, rating) VALUES (?, ?, ?)"
        const values  = [req.body.recipe_id, req.body.user_id, req.body.rating]
        db.query (sql, values, (err) => {
            if(err) return res.status(500).json("Rating epäonnistui" + err)
            return res.status(200).json("Ratingin lisäys onnistui onnistui")
        })
    }
    catch (error) {
        return res.status(500).json("Rating epäonnistui" + error)
    }
})


app.post('/login', (req, res) => {
    const sql = "SELECT name, user_id, user_role FROM users WHERE email = ? AND password = ?";
    const values = [
        req.body.email,
        req.body.password
    ]
    db.query(sql, values, (err, data) => {
        if(err) return res.json("Login Failed");
        if (data.length > 0) {
            const userName = data[0].name;
            const user_id = data[0].user_id;
            const userRole = data[0].user_role;
            return res.json({userName, user_id, userRole});
        }
        else {
            res.json("Login failed")
        }
    })
})
//postmanissa osoite pitää olla muotoa http://localhost:8081/users/delete/2, Postman poistaa käyttäjän id:llä = 2 tässä tapauksessa   
app.delete('/users/:id', (req, res) => {
    const sql = "DELETE FROM users WHERE user_id = ?";
    const userId = req.params.id; 
    db.query(sql, [userId], (err, result) => {
        if(err) {
            return res.status(500).json("Error in user deletion: " + err);
        } else {
            return res.status(200).json("User deletion successful: " + result);
        }
    });
});


app.delete('/recipes/delete/:id', (req, res) => {
    const sql = "DELETE FROM recipes WHERE recipe_id = ?";
    const recipe_id = req.params.id; 
    db.query (sql, [recipe_id], (err, result) => {
        if(err) {return res.status(500).json("Error reseptin poistossa: " + err);}
        else { return res.status(200).json("Reseptin poisto onnistui: " + result);
        }
    }
    )
})
app.put('/users/:id', (req, res) => {
    try {
        const sql = "UPDATE users SET nickname = ?, name = ?, email = ?, password = ?, user_role = ? WHERE user_id = ?";
        const values = [
            req.body.nickname,
            req.body.name,
            req.body.email,
            req.body.password,
            req.body.user_role,
            req.params.id
        ];
        db.query(sql, values, (err) => {
            if(err) return res.status(500).json("Error updating user" + err);
            return res.status(200).json("User updated successfully")
        }); 
    }
    catch (error) {
        return res.status(500).json("Error updating user: " + error);
    }
});
app.post('/keywordslisays', (req, res) => {
    try {
        const sql = "INSERT INTO keywords (recipe_id, keyword) VALUES (?, ?)";
        const values = [
            req.body.recipe_id,
            req.body.keyword
        ]
        db.query(sql, values, (err) => {
            if (err) return res.status(500).json("Error keywordin lisäämisessä" + err);
            return res.status(200).json("Keyword lisätty")
        })
    }
    catch (error) {
        return res.status(500).json("Error keywordien lisäyksessä");
    }
})
app.get('/keywordshaku', (req, res) => { 
    try {
        const sql = "SELECT keyword from keywords";
        db.query(sql, (err, data) => {
            if (err) return res.status(500).json("Error keywordin haussa" + err)
            return res.status(200).json(data)
        })
    }
    catch (error) {
        return res.status(500).json("Error keywordien haussa", error)
    }
})
app.post('/tietynreseptinhakukeywordilla', (req, res) => {
    try {
        const sql = "Select recipe_id from keywords WHERE keyword = ?"
        const keyword = req.body.keyword
        db.query(sql, keyword, (err, data) => {
            if (err) return res.status(500).json("Error recipe_id:n haussa keywordilla" + err)
            const id = data[0].recipe_id;
            return res.status(200).json(id);
        })
    }
    catch (error) {
        return res.status(500).json("Tietyn reseptin haku keywordilla ei onnistunut", error)
    }
})