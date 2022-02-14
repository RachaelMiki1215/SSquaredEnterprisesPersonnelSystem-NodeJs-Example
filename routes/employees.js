const express = require('express');
const router = express.Router();
const fs = require('fs');
const jCSV = require('jquery-csv');

router.use(express.json());

router.get('/', (req, res) => {
    let content = fs.readFileSync('./public/database/table_employees.csv', (req, res) => {
        if (err) {
            console.error(err);
        }
        else {
            console.log('Data retrieval successful!!');
        }
    });
    res.send(content.toString());
});

router.post('/', (req, res) => {
    //console.log(req.body);
    // Reading employee table file.
    /*
    let origFileData = fs.readFileSync('./public/database/table_employees.csv', function() {
        if (err) {
            console.error(err);
        }
        else {
            console.log('Data retrieval successful!!');
        };
    });
    let origCsvArr = jCSV.toObjects(origFileData.toString());
    */
   
    let origFileData = fs.readFileSync(
        './public/database/table_employees.csv',
        function (err) {
            if (err) {
                console.error(err);
            }
            else {
                console.log('Data retrieval successful!!');
            };
        }
    );
    fs.writeFileSync(
        './public/database/table_employees.csv',
        origFileData.toString().trimEnd(),
        function (err) {
            if (err) {
                console.error(err);
            }
            else {
                console.log('Data retrieval successful!!');
            };
        }
    );
    fs.appendFileSync(
        './public/database/table_employees.csv',
        `\n${req.body.EmployeeId},${req.body.LastName},${req.body.FirstName},${req.body.Role},${req.body.ManagerId}`,
        (err) => {
            if (err) {
              console.log(err);
        }}
    );

    /*origCsvArr.push(req.body);
    let newCsvStr = jCSV.fromObjects(origCsvArr);
    console.table(newCsvStr);*/

    res.send('Employee has been added!!');
});

module.exports = router;