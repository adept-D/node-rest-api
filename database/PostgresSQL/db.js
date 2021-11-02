import pg from 'pg'

const  Pool  = pg.Pool;

// const PoolClass = pg.Pool;

const pool = new Pool({
    user:"postgres",
    password: "dias2502",
    host: "localhost",
    port: 5432,
    database: "NodeDB"
})


export default pool;
