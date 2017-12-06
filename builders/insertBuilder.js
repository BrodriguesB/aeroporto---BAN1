const {pipe, tail, head, toPairs, map, join, __} = require('ramda');
const { whenStringPutQuotes, toKeyEqualsValue, wrapWith } = require('./builders.core');

const toValues = pipe(
    toPairs,
    map(pipe(
        tail,
        head,
        whenStringPutQuotes
    ))
);

const toInsertValues = pipe(
    map(pipe(
        toValues,
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
