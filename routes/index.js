const express = require('express');
const router = express.Router();
const pg = require('pg');
const path = require('path');

//DB
const userName = "postgres";
const password = "adm";
const host = "127.0.0.1";
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

function generateInsertQueryWith(obj,bd){
    var generated = getKeysAndArrayFor(obj);
    generated.query = `INSERT INTO public."${bd}"(${generated.columns}) VALUES (${generated.counters})` ;
    return generated;
}


/**
 * Helper query object
 * @param {string} columns - like 'foo,bar,foobar'.
 * @param {string} counters - like $1,$2.
 * @param {Array} data - [valueone,valuetwo].
 */
function HelperModel(columns,counters,data){
    this.columns = columns;
    this.counters = counters;
    this.data = data;
}

//TODO:finish
class QueryBuilder {


    /***
     * Build and return helper object
     * @return {HelperModel}
     */
    static buildQueryObjectHelper(obj){
        let keys = Object.keys(obj);
        let joined = keys.join(); // keys like (foo,bar)
        let values = ''; //counters like $1,$2
        let arr = []; //Arr, as second parameter.

        let x = 1;
        do {
            values+=`$${x},`;
            arr.push(obj[keys[x-1]]);
        }
        while(x++<keys.length-1);
        values+=`$${x}`;
        arr.push(obj[keys[x-1]]);

        return new HelperModel(joined,values,arr);
    }


    constructor(table){
        this.table = table;
        this.client = undefined;
        this.baseObject = undefined;
        this.helperObject = undefined;
    }

    setBaseObject(baseObject){
        this.baseObject = baseObject;
        this.helperObject = QueryBuilder.buildQueryObjectHelper(baseObject);
    }

    setClient(client){
        this.client = client;
    }


    /**
     * Create query.
     * @return {string}
     */
    CREATE() {
        return `INSERT INTO public."${this.table}"(${this.helperObject.columns}) VALUES (${this.helperObject.counters})`;
    }
    /**
     * Create query.
     * @return {string}
     */
    DELETE(whereObj) {
        return `INSERT INTO public."${this.table}"(${this.helperObject.columns}) VALUES (${this.helperObject.counters})`;
    }
    /**
     * Create query.
     * @return {string}
     */
    UPDATE(colsObj) {
        return `INSERT INTO public."${this.table}"(${this.helperObject.columns}) VALUES (${this.helperObject.counters})`;
    }
    /**
     * Read query.
     * @param [cond] TODO
     * @return {string}
     */
    READ(cond = false) {
        return `SELECT * FROM public."${this.table}"`;
    }

    /**
     * Executes the given query.
     * @param query { String } - Query to execute.
     * @param data  [ Array ] - optional array values data.
     * @param [allRequired] - If true check for undefined on the query. Default value is true.
     * @return {Boolean | Object} false if error, query(for callbacks) if success*/
    exec(query,data,allRequired = true){
        console.log(query);
        //If all fields are required, and there's an undefined one.
        if(allRequired && query.indexOf('undefined')!=-1) {
            return false;
        }

        let ret;
        try {
            ret = data ? this.client.query(query,data) : this.client.query(query);
        } catch(e){
            return false;
        }

        return ret;
    }


}


const planesQB = new QueryBuilder("Avioes");

/*------------------------*\
        CRUD - Avioes
\*------------------------*/

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

        //Configs query builder to this context.
        planesQB.setBaseObject(req.body);
        planesQB.setClient(client);

        //execute query.
        let create = planesQB.exec(planesQB.CREATE(),planesQB.helperObject.data);

        //if query succeeded
        if(create){
            //Read the table
            let select = planesQB.exec(planesQB.READ());
            // Stream results back one row at a time
            select.on('row', function (row) {
                results.push(row);
            });
            // After all data is returned, close connection and return results
            select.on('end', function () {
                done();
                return res.json(results);
            });
        } else {
            console.error("Could not execute query from given object");
            return res.status(500).json({success: false, data: err,errorObject:req.body});
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


/*------------------------*\
        CRUD - Voo
\*------------------------*/

//CREATE
router.post('/api/voos', function (req, res, next) {
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
        data.tripulacao             = req.body.tripulacao;
        data.data                   = req.body.data;
        data.hora                   = req.body.hora;
        data.nr_passageiros         = req.body.nr_passageiros;
        data.modelo_aviao           = req.body.modelo_aviao;
        data.passageiros            = req.body.passageiros;
        data.origem                 = req.body.origem;
        data.destino                = req.body.destino;
        data.portao_embarque        = req.body.portao_embarque;


        //Se ninguem foi omitido.
        console.log(data);
        if(    data.tripulacao
            && data.data
            && data.hora
            && data.nr_passageiros
            && data.modelo_aviao
            && data.passageiros
            && data.origem
            && data.destino
            && data.portao_embarque) {
            var arr = [ data.tripulacao, data.data, data.hora, data.nr_passageiros, data.modelo_aviao, data.passageiros, data.origem, data.destino, data.portao_embarque];
            // SQL Query > Insert Data
            client.query('INSERT INTO public."Voos"(modelo, max_passageiros, max_carga, data_aquisicao, companhia) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);', arr);

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
router.get('/api/voos', function (req, res, next) {
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
        const query = client.query('SELECT * FROM public."Voos";');
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


router.delete('/api/voos/:flight_id', function(req, res, next) {
    const results = [];
    // Grab data from the URL parameters
    const id = req.params.flight_id;
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
        client.query('DELETE FROM public."Voos" WHERE id=($1)', [id]);
        // SQL Query > Select Data
        var query = client.query('SELECT * FROM public."Voos"');
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


