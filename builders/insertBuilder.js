const {pipe, toPairs, map, tail, head, join, concat, __, when, is} = require('ramda');

const whenStringPutQuotes = when(
    is(String),
    pipe(concat("'"),concat(__,"'"))
);

const toEqualsKeys = pipe(
    toPairs,
    map(pipe(tail, head, whenStringPutQuotes)),
    join(',')
);
const toInsertValues = pipe(
    map(pipe(
        toEqualsKeys,
        concat('('),
        concat(__,')')
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
