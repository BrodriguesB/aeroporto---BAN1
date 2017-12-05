const pg = require('pg');
const {getConnectionString} = require('./configurations');
const client = new pg.Client(getConnectionString());

let isConnectionOpen = false;

module.exports.execQuery = async function execQuery(query){
    if(!isConnectionOpen){
        client.connect();
        isConnectionOpen = true;
    }
    return await client.query(query);
};

module.exports.finishConnection = function(){
    isConnectionOpen = false;
    client.end();
};