const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const multer  = require('multer');
const nodemailer = require('nodemailer'); 


process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';


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
 const html = `<h1>Hello</h1>
<p>Tässä salasanan vaihto :) </p>
<a href="$resetpassword">Vaihda salasana</a>
`

let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465, 
    secure: true,
    auth: {
            user: 'bearmario2@gmail.com',
            pass: 'qnve boaa bixt ddkg'
    }
    });
const mailOptions = {
        from: {name: 'Haute-Cuisine backendpro 666', address: 'bearmario2@gmail.com'},
        to: 'jiojiojiojiojoij',
        subject: 'Salasananpalautus',
        html: html

}

const sendMail = async (transporter, mailOptions) => {
    try {
        await transporter.sendMail(mailOptions);
        console.log("Email has been sended")
    }
    catch (error) {
        console.error(error)
    }
}

app.post("/sendrecoveryemail", (req, res) => {
    // Oletetaan, että sähköpostiosoite lähetetään pyynnön rungossa nimellä "email"
    const recipientEmail = req.body.email;

    // Tarkista ensin tietokannasta, löytyykö sähköpostiosoite
    const checkEmailSql = "SELECT * FROM users WHERE email = ?";
    db.query(checkEmailSql, [recipientEmail], (err, result) => {
        if (err) {
            console.error("Error sähköpostiosoitteessa: " + err);
            return res.status(500).json("Error sähköpostiosoitteessa: " + err);
        }
        if (result.length > 0) {
            try {
                // Päivitä mailOptions vastaanottajan sähköpostiosoitteella
                mailOptions.to = recipientEmail;
                mailOptions.html = `<p>Hei, ${result[0].name},</p>
                <p>Näyttää siltä, että haluat vaihtaa salasanasi. Voit tehdä sen napsauttamalla alla olevaa linkkiä:</p>
                <a href="http://localhost:5173/PasswordReset/${result[0].user_id}/${result[0].name}">Vaihda salasana</a>
                <p>Jos et pyytänyt salasanan vaihtoa, voit jättää tämän viestin huomiotta.</p>
                <p>Ystävällisin terveisin,</p>
                <p>Haute Cuisine backend ;D</p>`;

                sendMail(transporter, mailOptions);
                console.log("Email has been sent to " + recipientEmail);
                res.status(200).send({message: "Email sent successfully",});
            } catch (error) {
                console.error(error);
                res.status(500).send("Error sending email");
            }
        } else {
            res.status(404).send("Email not found in the database");
        }
    });
});

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
    const sql = "SELECT r.recipe_id, r.title, r.author_id, r.description, r.visibility, DATE(r.created_at) AS created_at, DATE(r.updated_at) AS updated_at, GROUP_CONCAT(DISTINCT CONCAT(i.name, ' (' , i.quantity, ')')) AS ingredients, GROUP_CONCAT(DISTINCT i.ingredient_id) AS ingredient_ids, GROUP_CONCAT(DISTINCT p.image SEPARATOR ', ') AS photos, GROUP_CONCAT(DISTINCT k.keyword_id) AS keyword_id, GROUP_CONCAT(DISTINCT k.keyword) AS keywords FROM recipes r LEFT JOIN ingredients i ON r.recipe_id = i.recipe_id LEFT JOIN photos p ON r.recipe_id = p.recipe_id LEFT JOIN keywords k ON r.recipe_id = k.recipe_id WHERE r.recipe_id = ? GROUP BY r.recipe_id;"
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
app.get('/julkisetReseptitHaku', (req, res) => {
    const sql = "SELECT r.recipe_id, r.title, r.author_id, r.description, r.visibility, DATE(r.created_at) AS created_at, DATE(r.updated_at) AS updated_at, GROUP_CONCAT(DISTINCT CONCAT(i.name, ' (' , i.quantity, ')')) AS ingredients, GROUP_CONCAT(DISTINCT p.image SEPARATOR ', ') AS photos FROM recipes r LEFT JOIN ingredients i ON r.recipe_id = i.recipe_id LEFT JOIN photos p ON r.recipe_id = p.recipe_id WHERE r.visibility = 1 GROUP BY r.recipe_id;"; 
    db.query(sql, (err, data) => {
        if(err) return res.status(500).json("Error julkisen reseptin haussa: " + err)
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
/*app.get('/ratingsHaku', (req,res) => {
    try {
        const sql = "GET * FROM ratings"
    }
})*/

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
    const recipe_id = req.params.id; 

    db.beginTransaction(function(err) {
        if (err) { return res.status(500).json("Virhe transaktion aloittamisessa: " + err); }

        db.query('DELETE FROM ratings WHERE recipe_id = ?', [recipe_id], function(err, result) {
            if (err) { 
                db.rollback(function() {
                    return res.status(500).json("Virhe arvioiden poistossa: " + err);
                });
            }

            db.query('DELETE FROM photos WHERE recipe_id = ?', [recipe_id], function(err, result) {
                if (err) { 
                    db.rollback(function() {
                        return res.status(500).json("Virhe valokuvien poistossa: " + err);
                    });
                }

                db.query('DELETE FROM keywords WHERE recipe_id = ?', [recipe_id], function(err, result) {
                    if (err) { 
                        db.rollback(function() {
                            return res.status(500).json("Virhe avainsanojen poistossa: " + err);
                        });
                    }

                    db.query('DELETE FROM ingredients WHERE recipe_id = ?', [recipe_id], function(err, result) {
                        if (err) { 
                            db.rollback(function() {
                                return res.status(500).json("Virhe ainesosien poistossa: " + err);
                            });
                        }

                        db.query('DELETE FROM favorites WHERE recipe_id = ?', [recipe_id], function(err, result) {
                            if (err) { 
                                db.rollback(function() {
                                    return res.status(500).json("Virhe suosikkien poistossa: " + err);
                                });
                            }

                            db.query('DELETE FROM recipes WHERE recipe_id = ?', [recipe_id], function(err, result) {
                                if (err) { 
                                    db.rollback(function() {
                                        return res.status(500).json("Virhe reseptin poistossa: " + err);
                                    });
                                }

                                db.commit(function(err) {
                                    if (err) { 
                                        db.rollback(function() {
                                            return res.status(500).json("Virhe transaktion vahvistamisessa: " + err);
                                        });
                                    }
                                    return res.status(200).json("Reseptin poisto onnistui: " + result);
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});
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
app.get('/kaikkienkeywordshaku', (req, res) => { 
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

app.get('/julkistenreseptienkeywordsienhaku', (req, res) => {
    try {
        const sql = "SELECT k.keyword FROM keywords k INNER JOIN recipes r ON k.recipe_id = r.recipe_id WHERE r.visibility = 1;"
        db.query(sql, (err, data) => {
            if (err) return res.status(500).json("Error julkisten keywordien haussa", err)
            return res.status(200).json(data); 
        })
    }
    catch (error) {
        return res.status(500).json("Error julkisten keywordsien haussa", error)
    }
})
app.post('/tietynreseptinhakukeywordilla', (req, res) => {
    try {
        const sql = "Select recipe_id from keywords WHERE keyword = ?"
        const keyword = req.body.keyword
        db.query(sql, [keyword], (err, data) => {
            if (err) return res.status(500).json("Error recipe_id:n haussa keywordilla" + err)
            if (data.length === 0) return res.status(404).json("Avainsanaa ei löytynyt");
            const id = data[0].recipe_id;
            return res.status(200).json(id);
        })
    }
    catch (error) {
        return res.status(500).json("Tietyn reseptin haku keywordilla ei onnistunut", error)
    }
})
app.put("/salasananpalautus", (req, res) => {
    try {
        const sql  = "UPDATE users SET password = ? WHERE user_id = ?"
        values = [req.body.password, req.body.user_id]
        db.query(sql, values, (err) => {
            if (err) return res.status(500).json("Salasanan vaihto epäonnistui", err)
            return res.status(200).json("Salasanan vaihto onnistui")
        })
    }
    catch (error) {
        return res.status(500).json("Salasan vaihto epäonnistui", error)
    }
})

app.get('/julkisetreseptit/:id', (req, res) => {
    const sql = "SELECT r.recipe_id, r.title, r.author_id, r.description, r.visibility, DATE(r.created_at) AS created_at, DATE(r.updated_at) AS updated_at, GROUP_CONCAT(DISTINCT CONCAT(i.ingedient_id, ': ' i.name, ' (' , i.quantity, ')')) AS ingredients, GROUP_CONCAT(DISTINCT p.image SEPARATOR ', ') AS photos FROM recipes r LEFT JOIN ingredients i ON r.recipe_id = i.recipe_id LEFT JOIN photos p ON r.recipe_id = p.recipe_id WHERE r.recipe_id = ? GROUP BY r.recipe_id;"; 
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

app.put('/reseptinpaivitys', (req, res) => {
    const sql = "UPDATE recipes SET title = ?, description = ?, visibility = ? WHERE recipe_id = ?;"
    const values = [req.body.title, req.body.description, req.body.visibility, req.body.recipe_id];
    db.query(sql, values, (err, result) => {
        if(err || result.affectedRows == 0) return res.status(500).json({message: "Error reseptin päivityksessä", err})
        return res.status(200).json("Reseptin päivitys onnistui")
    })
})
app.put('/ingredientspaivitys', (req, res) => {
    const sql = "UPDATE ingredients set name = ?, quantity = ? WHERE ingredient_id = ? AND recipe_id = ?;"
    const values = [req.body.name, req.body.quantity, req.body.ingredient_id, req.body.recipe_id];
    db.query(sql, values, (err, results) => {
        if(err || results.affectedRows == 0) return res.status(500).json({message: "Ainesosien päivitys epäonnistui", error: err})
        return res.status(200).json("Ainestosien päivitys onnistui")
    })
})
app.put('/keywordspaivitys', (req, res) => {
    const sql = "UPDATE keywords set keyword = ? WHERE recipe_id = ?;"
    const values = [req.body.keyword, req.body.recipe_id];
    db.query(sql, values, (err, results) => {
        if(err || results.affectedRows == 0) return res.status(500).json({message: "Keywordsien päivitys epäonnistui", error: err})
        return res.status(200).json("Keywordsien päivitys onnistui")
    })
})
app.put('/photospaivitys', upload.single('file'), (req, res) => {
    const sql = "Update photos set image = ? WHERE recipe_id = ?;";
    
    const values = [req.file.filename, req.body.recipe_id]
    
    db.query(sql, [req.file.filename, req.body.recipe_id], (err, result) => {
      if (err) {
        console.error({message: "Kuvan päivitys epäonnistui", err});
        return res.status(500).json({message: "Kuvan lisäys epäonnistui"});
      }
      return res.status(200).json({message: "Kuvan lisäys onnistui", result});
    });
  });
  
//sendMail(transporter, mailOptions)