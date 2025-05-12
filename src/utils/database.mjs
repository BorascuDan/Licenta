import knex from 'knex';
import knexConfig from './../../knexfile.cjs';

let dbInstance = null;

const getDbInstance = () => {
    if (!dbInstance) {
        dbInstance = knex(knexConfig);
    }
    dbInstance.on('query', (queryData) => {
        if (queryData.method === 'update') {
            queryData.bindings.push(new Date());
            queryData.sql += ', updated_at = ?';
        }
    });
    return dbInstance;  
};

const db = getDbInstance();  

export default db;