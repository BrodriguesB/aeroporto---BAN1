const {pipe, curryN, concat, __, when, is, map, toPairs, adjust, join} = require('ramda');

const whenStringPutQuotes = when(
    is(String),
    pipe(concat("'"),concat(__,"'"))
);

const toKeyEqualsValue = pipe(
    toPairs,
    map(pipe(
        adjust(whenStringPutQuotes, 1),
        join('=')
    ))
);

const wrapWith = curryN(3,(left,right, string) => `${left}${string}${right}`);

module.exports = {
    whenStringPutQuotes,
    toKeyEqualsValue,
    wrapWith
};