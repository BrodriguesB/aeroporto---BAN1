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
    res.render('layout', {title: 'Express'});
});

/* GET index page. */
router.get('/index', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

/* GET flights page. */
router.get('/sindicato', function (req, res, next) {
    res.render('union');
});

/* GET employee page. */
router.get('/funcionario', function (req, res, next) {
    res.render('employee');
});

/* GET office page. */
router.get('/cargo', function (req, res, next) {
    res.render('office');
});

/* GET office page. */
router.get('/modelos', function (req, res, next) {
    res.render('planesModel');
});



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


    constructor(){
        this.table = undefined;
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

    setTable(table){
        this.table = table;
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
    UPDATE(id,id_column,object) {
        let base = Object.assign({},object);
        let set = Object.keys(base).map((x)=>{
                        //if its the id key we ignore.
                        return `${x}='${base[x]}'`;
                    }).join(', ');
        return `UPDATE public."${this.table}" SET ${set} WHERE ${id_column}=${id}`;
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

        //If all fields are required, and there's an undefined one.
        if(allRequired && query.indexOf('undefined')!=-1) {
            return false;
        }

        var ret;
        try {
            ret = data ? this.client.query(query,data) : this.client.query(query);

        } catch(e){
            return false;
        }

        return ret;
    }


}


const generalQB = new QueryBuilder();

/*------------------------*\
        CRUD - Avioes
\*------------------------*/

//CREATE
router.post('/api/:table', function (req, res, next) {
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
        generalQB.setBaseObject(req.body);
        generalQB.setClient(client);
        generalQB.setTable(req.params.table);

        //execute query.
        let create = generalQB.exec(generalQB.CREATE(),generalQB.helperObject.data);

        //if query succeeded
        if(create){

            // After all data is returned, close connection and return results
            create.on('end', function () {
                returnAllFromTable(req,res);
            });
            returnAllFromTable(req,res);
        } else {
            console.error("Could not execute query from given object");
            return res.status(500).json({success: false, data: err,errorObject:req.body});
        }
    });
});


//READ
router.get('/api/:table', returnAllFromTable);

/**
 * READ
 * get all columns from given table
 */
function returnAllFromTable(req, res) {
    const results = [];

    // Grab data from the URL parameters
    const table = req.params.table;
    // Get a Postgres client from the connection pool
    pg.connect(connectionDBStr, function (err, client, done) {
        // Handle connection errors
        if (err) {
            done();
            console.log(err);
            return res.status(500).json({success: false, data: err});
        }

        // SQL Query > Select Data
        //const query = client.query(`SELECT * FROM public."${req.params.table}";`);

        generalQB.setClient(client);
        generalQB.setTable(table);

        //Read the table
        let select = generalQB.exec(generalQB.READ());

        //if query succeeded
        if(select){
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
}

/**
 * DELETE
 * delete a registry from a table from the give id.
 */
router.delete('/api/:table/:column/:id', function(req, res, next) {
    const results = [];
    // Grab data from the URL parameters
    const id = req.params.id;
    const table = req.params.table;
    const column = req.params.column;
    // Get a Postgres client from the connection pool
    pg.connect(connectionDBStr, function(err, client, done) {
        // Handle connection errors
        if(err) {
            done();
            console.log(err);
            return res.status(500).json({success: false, data: err});
        }
        // SQL Query > Delete Data
        console.log(id);
        let query = client.query(`DELETE FROM public."${table}" WHERE ${column}=(${id})`);
        query.on("end",()=>{returnAllFromTable(req,res);})
    });
});

router.put('/api/:table/:id_column/:id', (req, res, next) => {

    pg.connect(connectionDBStr, (err, client, done) => {
        // Handle connection errors
        if(err) {
            done();
            console.log(err);
            return res.status(500).json({success: false, data: err});
        }

        generalQB.setClient(client);
        generalQB.setTable(req.params.table);
        console.log(generalQB.UPDATE(req.params.id,req.params.id_column,req.body));
        let update = generalQB.exec(generalQB.UPDATE(req.params.id,req.params.id_column,req.body));

        if(update){
            update.on('end',function () {
                returnAllFromTable(req,res);
            });
        } else {
            console.error("Could not execute query from given object");
            return res.status(500).json({success: false, data: err,errorObject:req.body});
        }
    });
});

module.exports = router;


