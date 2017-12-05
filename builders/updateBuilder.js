const {pipe, curryN, toPairs, map, prop, join} = require('ramda');
const { toKeyEqualsValue } = require('./builders.core');


const toUpdateSet = pipe(
    toKeyEqualsValue,
    join(',')
);

const setToEqualKeys = pipe(
    prop('set'),
    toUpdateSet
);

const tablesToUpdateQueries = pipe(
    toPairs,
    map(e => `UPDATE ${e[0]} SET ${setToEqualKeys(e[1])} WHERE ${e[1].where};`)
);


const tableToUpdateQuery = curryN(2, (table, {set, where}) => `UPDATE ${table} SET ${toUpdateSet(set)} WHERE ${where};`);

module.exports = {
    tablesToUpdateQueries,
    tableToUpdateQuery
};
