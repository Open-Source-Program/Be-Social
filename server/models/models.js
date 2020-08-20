const pg = require('pg');
pg.defaults.poolSize = 100;

const patty = 'postgres://wleysufm:pXsLZ76bqW-jjRNUkgLJHtxPWR2Dk002@raja.db.elephantsql.com:5432/wleysufm';
const jen = 'postgres://kyvtwizd:fVABvmKeENO7jTd3IBKj1PiIcNyVylqD@raja.db.elephantsql.com:5432/kyvtwizd'
const PG_URI = patty;

const pool = new pg.Pool({
  connectionString: PG_URI,
});

module.exports = {
  query: (text, params, callback) => {
    console.log('executed query', text);
    return pool.query(text, params, callback);
  },
};

// const { Pool } = require('pg');

// const PG_URI = 'postgres://opkmyovf:jlzeGeCdKnUTuAX0p15MbMj7v1LqFpFg@rajje.db.elephantsql.com:5432/opkmyovf';

// const pool = new Pool({
//   connectionString: PG_URI,
// });

// module.exports = {
//   query: (text, params, callback) => {
//     console.log('executed query', text);
//     return pool.query(text, params, callback);
//   },
// };


// psql -d postgres://wleysufm:pXsLZ76bqW-jjRNUkgLJHtxPWR2Dk002@raja.db.elephantsql.com:5432/wleysufm -f iteration-project_postgres_create.sql