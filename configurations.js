const configs = {
    "database":"aeroporto",
    "user":"postgres",
    "password":"postgres",
    "host": "localhost",
    getConnectionString(){
        const {user, password, host, database} = configs;

        return `postgres://${user}:${password}@${host}:5432/${database}`;
    }
};

module.exports = configs;