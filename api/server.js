const express = require('express'),
path = require('path'),
bodyParser = require('body-parser'),
cors = require('cors'),
sqlite3 = require('sqlite3').verbose();

const app = express();
app.use(express.json());
app.use(cors());


const withDB = (operations, res) => {
    try {
        const db = new sqlite3.Database('./db.sqlite');
        
        db.serialize(function () {
            operations(db);
        });
    
        db.close();
    } catch (error) {
        res.status(500).json({ message: 'Error connecting to db', error });
    }
}

app.get('/api/transactions', (req, res) => {
    withDB((db) => {
        db.all("SELECT rowid AS id, date, type, description, amount, status FROM transactions", function (err, results) {
            res.send(results);
        });
        
    }, res);
})

app.get('/api/transactions/:id', (req, res) => {
    const id = req.params.id;
    withDB((db) => {
        db.all(`SELECT rowid AS id, date, type, description, amount, status FROM transactions WHERE rowid=${id}`, function (err, results) {
            res.send(results[0]);
        });
        
    }, res);
})

app.post('/api/transactions', (req, res) => {
    const { date, type, description, amount, status } = req.body;

    withDB((db) => {
        db.run(`CREATE TABLE IF NOT EXISTS transactions (
                date TEXT NOT NULL,
                type TEXT NOT NULL,
                description TEXT NULL,
                amount REAL NOT NULL,
                status TEXT NOT NULL
            )`
        );

        const stmt = db.prepare("INSERT INTO transactions VALUES (?,?,?,?,?)");
        stmt.run(date, type, description, amount, status);
        stmt.finalize();
        
        res.send(req.body);
    }, res);
});

app.put('/api/transactions/:id', (req, res) => {
    const { date, type, description, amount, status } = req.body;
    const id = req.params.id;

    withDB((db) => {
        const stmt = db.prepare(`UPDATE transactions SET date=?,type=?, description=?, amount=?,status=? WHERE rowid=${id}`);
        stmt.run(date, type, description, amount, status);
        stmt.finalize();
        
        res.send(req.body);
    }, res);
});

app.delete('/api/transactions/:id', (req, res) => {
    const id = req.params.id;
    withDB((db) => {
        const stmt = db.prepare(`DELETE FROM transactions WHERE rowid=${id}`);
        stmt.run();
        stmt.finalize();
        res.send({});
    }, res);
});

let port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log('Listening on port ' + port);
});