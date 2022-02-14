const express = require('express');
const fs = require('fs');
const router = express.Router();

router.get('/', (req, res) => {
    let content = fs.readFileSync('./public/database/table_roles.csv', (req, res) => {
        if (err) {
            console.error(err);
        }
        else {
            console.log('Data retrieval successful!!');
        }
    });
    res.send(content.toString());
});

module.exports = router;