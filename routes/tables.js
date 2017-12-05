const express = require('express');
const router = express.Router();
const { tablesToInsertQuery } = require('../builders/insertBuilder');
const { tableToUpdateQuery } = require('../builders/updateBuilder');
const { execQuery, finishConnection } = require('../connection');

//Create
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


//Read
router.get('/:table', async function(req, res, next) {
    const { table } = req.params;

    try {
        const queryResult = await execQuery(`SELECT * FROM ${table}`);
        console.log(queryResult.rows);
        res.status(200).json(queryResult.rows);
    } catch (e){
        console.error(e);
        res.status(500).json({success:false});
    } finally {
        finishConnection();
    }

});

//Update
router.post('/:table', async function(req, res, next) {
    const { table } = req.params;
    const {set, where} = req.body;

    const query = tableToUpdateQuery(table, {set, where});
    try {
        const queryResult = await execQuery(query);
        console.log(queryResult.rows);
        res.status(200).json({success:true});
    } catch (e){
        console.error(e);
        res.status(500).json({success:false});
    } finally {
        finishConnection();
    }
});

//Delete
router.delete('/:table', async function(req, res, next) {
    const { table } = req.params;
    const { columnName, columnValue } = req.body;

    const queryResult = await execQuery(`DELETE * FROM ${table} WHERE ${ columnName } = ${ columnValue }`);
    finishConnection();

    res.status(200).json(queryResult)
});

module.exports = router;