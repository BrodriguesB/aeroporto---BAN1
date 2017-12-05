const {pipe, toPairs, map, join, __} = require('ramda');
const { toKeyEqualsValue, wrapWith } = require('./builders.core');

const toInsertValues = pipe(
    map(pipe(
        toKeyEqualsValue,
        join(','),
        wrapWith('(',')')
    )),
    join(',')
);

const tablesToInsertQuery = pipe(
    toPairs,
    map(e => `INSERT INTO ${e[0]} VALUES ${toInsertValues(e[1])}`)
);


module.exports = {
    toInsertValues,
    tablesToInsertQuery
};
