const express = require('express');
const fs = require('fs');
const app = express();
const employees = require('./routes/employees.js');
const roles = require('./routes/roles.js')

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use(express.static(__dirname));

app.get(
    '/',
    (req, res) => {
        res.render('index');
    }
)

app.use((req, res, next) => {
    console.log('Time:', Date.now());
    next();
});

app.use('/employee', employees);
app.use('/role', roles);

app.listen(process.env.port || 3000);
console.log('Web Server is listening at port '+ (process.env.port || 3000));