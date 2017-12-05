const pg = require('pg');
const connectionString = require('./configurations').getConnectionString;
const client = new pg.Client(connectionString());

module.exports.execQuery = async function execQuery(query){
    client.connect();
    await client.query(query);
    client.end();
}