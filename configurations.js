const configs = {
    "database":"aeroporto",
    "user":"postgres",
    "password":"adm",
    "host": "localhost",
    getConnectionString(){
        const {user, password, host, database} = configs;

        const connectionDBStr = `postgres://${user}:${password}@${host}:5432/${database}`;
        
        return connectionDBStr;
    }
};

module.exports = configs;