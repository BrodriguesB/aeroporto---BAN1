const express = require('express');
const router = express.Router();
const pg = require('pg');
const path = require('path');

//DB
const userName = "postgres";
const password = "adm";
const host = "localhost";
const dbName = "aeroporto";
const connectionDBStr = 'postgres://' + userName + ':' + password + '@' + host + ':5432/' + dbName;


/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

/* GET home page. */
router.get('/menu', function (req, res, next) {
    res.render('menu');
});

/*------------------*\
         CRUD
\*------------------*/

//CREATE
router.post('/api/avioes', function (req, res, next) {
    const results = [];

    // Get a Postgres client from the connection pool
    pg.connect(connectionDBStr, function (err, client, done) {
        // Handle connection errors
        if (err) {
            done();
            console.log(err);
            return res.status(500).json({success: false, data: err});
        }

        var data = {};
        data.modelo             = req.body.modelo;
        data.max_passageiros   = req.body.max_passageiros;
        data.max_carga          = req.body.max_carga;
        data.data_aquisicao     = req.body.data_aquisicao;
        data.companhia           = req.body.companhia;

        //Se ninguem foi omitido.
        console.log(data);
        if(data.modelo && data.max_passageiros && data.max_carga && data.data_aquisicao && data.companhia) {
            var arr = [data.modelo, data.max_passageiros, data.max_carga, data.data_aquisicao, data.companhia];
            // SQL Query > Insert Data
            client.query('INSERT INTO public."Avioes"(modelo, max_passageiros, max_carga, data_aquisicao, companhia) VALUES ($1, $2, $3, $4, $5);', arr);

            // SQL Query > Select Data
            const query = client.query('SELECT * FROM public."Avioes";');

            // Stream results back one row at a time
            query.on('row', function (row) {
                results.push(row);
            });
            // After all data is returned, close connection and return results
            query.on('end', function () {
                done();
                return res.json(results);
            });
        } else {
            console.log("Some fields were empty, all fields are required.");
            return res.status(500).json({success: false, data: err});
        }
    });
});


//READ
router.get('/api/avioes', function (req, res, next) {
    const results = [];
    // Get a Postgres client from the connection pool
    pg.connect(connectionDBStr, function (err, client, done) {
        // Handle connection errors
        if (err) {
            done();
            console.log(err);
            return res.status(500).json({success: false, data: err});
        }
        // SQL Query > Select Data
        const query = client.query('SELECT * FROM public."Avioes";');
        // Stream results back one row at a time
        query.on('row', function (row) {
            results.push(row);
        });
        // After all data is returned, close connection and return results
        query.on('end', function () {
            done();
            return res.json(results);
        });
    });
});


router.delete('/api/avioes/:plane_id', function(req, res, next) {
    const results = [];
    // Grab data from the URL parameters
    const id = req.params.plane_id;
    // Get a Postgres client from the connection pool
    pg.connect(connectionDBStr, function(err, client, done) {
        console.log("called");
        // Handle connection errors
        if(err) {
            done();
            console.log(err);
            return res.status(500).json({success: false, data: err});
        }
        // SQL Query > Delete Data
        console.log(id);
        client.query('DELETE FROM public."Avioes" WHERE registro=($1)', [id]);
        // SQL Query > Select Data
        var query = client.query('SELECT * FROM public."Avioes"');
        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });
        // After all data is returned, close connection and return results
        query.on('end', function () {
            done();
            return res.json(results);
        });
    });
});


module.exports = router;


