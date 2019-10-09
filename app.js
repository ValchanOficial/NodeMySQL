const mysql = require('mysql');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

//-------------------------------------Connect to Database
var pool  = mysql.createPool({
    connectionLimit : 10,
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'db'
});
//-------------------------------------CRUD
app.get('/find', (req, res) => {
    pool.query('SELECT * FROM db.user ORDER BY iduser', (error, result) => {
        if (error) {
            res.status(500).json({ message: error.message || "Some error occurred!" });
        }
        res.status(200).json(result);
    });
});

app.get('/find/:userId', (req, res) => {
    pool.query('SELECT * FROM db.user WHERE iduser =  ?', [req.params.userId], (error, result) => {
        if (error) {
            res.status(500).json({ message: error.message || "Some error occurred!" });
        }
        res.status(200).json(result);
    });
});

app.post('/create', (req, res) => {
    pool.query('INSERT INTO db.user (name, email) VALUES (?, ?)', [req.body.name, req.body.email], (error, result) => {
        if (error) {
            res.status(500).json({ message: error.message || "Some error occurred!" });
        }
        res.status(200).json("User successfully created! ID: " + result.insertId);
    });
});

app.put('/update/:userId', (req, res) => {
    pool.query('UPDATE db.user SET name = ?, email = ? WHERE iduser = ?', [req.body.name, req.body.email, req.params.userId], (error, result) => {
        if (error) {
            res.status(500).json({ message: error.message || "Some error occurred!" });
        }
        res.status(200).json("User successfully updated! ID: "+req.params.userId);
    });
});


app.delete('/delete/:userId', (req, res) => {
    pool.query('DELETE FROM db.user WHERE iduser = ?', [req.params.userId], (error, result) => {
        if (error) {
            res.status(500).json({ message: error.message || "Some error occurred!" });
        }
        res.status(200).json("User successfully deleted!");
    });
});

//-------------------------------------
app.listen(PORT, () => {
    console.log(`Server is up and running on port: ${PORT}`);
});