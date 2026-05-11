const express = require("express");
const fs = require('fs');
const cors = require('cors');
const app = express();
const session = require('express-session');

app.use(session({
    secret: 'cookie-secret-key', // cookie password (session ID)
    resave: false, // do not overwrite a session if it has not changed 
    saveUninitialized: false, // do not create a session for guests without data 
    rolling: true, // updates the cookie expiration date with each user request
    cookie: {
        secure: false, // allows cookies to be passed over regular HTTP
        httpOnly: true, // prevents access to cookie via JS (via document cookie)
                        // Protection against XSS attacks
        sameSite: 'none', // Cookies will be sent in any requests, including cross-site
        maxAge: 3_600_000 // cookie lifetime in ms. 1000 * 60 * 60 = 3 600 000 = 1 hours
    }
}));

app.use(cors({
    origin: 'http://localhost:5173', // frontend port
    credentials: true // allows cookie to be passed
}));

app.use(express.json());

app.use('/api/products', require("./routes/products"));

app.post('/sign-up', (req, res) => {
    const file = 'users.json';

    fs.readFile(file, 'utf8', (err, data) => {
        let users = [];
        
        if (!err && data) {
            try { users = JSON.parse(data); }
            catch (parseErr) { return res.status(500).send('Error parsing data'); }
        }
        
        if (users.find(u => u.email === req.body.email)) {
            return res.status(409).send('Account with this email already exists');
        }

        users.push(req.body);

        // Read a file, add an object, and write back
        fs.writeFile(file, JSON.stringify(users, ['name', 'email', 'password'], 2), (err) => {
            if (err) return res.status(500).send('Error saving data');
            // Creating a session immediately after registration.
            // user doesn't need to log in
            req.session.userName = req.body.name;

            res.status(201).json({
                message: 'User saved successfully',
                user: { name: user.name }
            })
        });
    });
});

app.post('/log-in', (req, res) => {
    const file = 'users.json';

    fs.readFile(file, 'utf8', (err, data) => {
        let users = [];

        if (!err && data) {
            try { users = JSON.parse(data); }
            catch (parseErr) { return res.status(500).send('Error parsing data'); }
        }

        const user = users.find(u => 
            u.email === req.body.email
            && u.password === req.body.password
        );

        if (user) {
            req.session.userName = user.username;

            res.status(200).json({
                message: 'Successfully authorization',
                user: { name: user.username }
            })
        } else {
            res.status(401).send('Wrong email or password');
        }
    })
});

app.listen(3000, () => {
    console.log(`Application successfully started and Listening on port 3000. http://localhost:3000`)
});