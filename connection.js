const pg = require('pg');
const {getConnectionString} = require('./configurations');
let client;

module.exports.execQuery = async function execQuery(query){
    if(!client){
        client = new pg.Client(getConnectionString());
        client.connect();
    }
    return await client.query(query);
};

module.exports.finishConnection = function(){
    if(client){
        client.end();
        client = null;
    }
};