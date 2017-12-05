const express = require('express');
const router = express.Router();
const {tablesToInsertQuery} = require('../builders/insertBuilder');
const { execQuery, finishConnection } = require('../connection');

/* GET users listing. */
router.get('/:table', async function(req, res, next) {
    const { table } = req.params;
    try {
        const queryResult = await execQuery(`SELECT * FROM ${table}`);
        console.log(queryResult.rows);
        res.status(200).json(queryResult.rows);
    } catch (e){
        console.error(e);
    }

    finishConnection();
});

router.delete('/:table', async function(req, res, next) {
    const { table } = req.params;
    const { columnName, columnValue } = req.body;

    const queryResult = await execQuery(`DELETE * FROM ${table} WHERE ${ columnName } = ${ columnValue }`);
    finishConnection();

    res.status(200).json(queryResult)
});

router.post('/', async function(req, res, next) {
    const { tables } = req.body;

    const queries = tablesToInsertQuery(tables);

    for(const index in queries) {
        const query = queries[index];

        console.log(query);
        try{
            await execQuery(query);
        } catch(e) {
            console.error(e);
        }
    }

    res.status(200).json({success:true});

    finishConnection();
});

module.exports = router;