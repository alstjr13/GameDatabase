const oracledb = require('oracledb');
const loadEnvFile = require('./utils/envUtil');

const envVariables = loadEnvFile('./.env');

// Database configuration setup. Ensure your .env file has the required database credentials.
const dbConfig = {
    user: envVariables.ORACLE_USER,
    password: envVariables.ORACLE_PASS,
    connectString: `${envVariables.ORACLE_HOST}:${envVariables.ORACLE_PORT}/${envVariables.ORACLE_DBNAME}`,
    poolMin: 1,
    poolMax: 3,
    poolIncrement: 1,
    poolTimeout: 60
};

// initialize connection pool
async function initializeConnectionPool() {
    try {
        await oracledb.createPool(dbConfig);
        console.log('Connection pool started');
    } catch (err) {
        console.error('Initialization error: ' + err.message);
    }
}

async function closePoolAndExit() {
    console.log('\nTerminating');
    try {
        await oracledb.getPool().close(10); // 10 seconds grace period for connections to finish
        console.log('Pool closed');
        process.exit(0);
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
}

initializeConnectionPool();

process
    .once('SIGTERM', closePoolAndExit)
    .once('SIGINT', closePoolAndExit);


// ----------------------------------------------------------
// Wrapper to manage OracleDB actions, simplifying connection handling.
async function withOracleDB(action) {
    let connection;
    try {
        connection = await oracledb.getConnection(); // Gets a connection from the default pool 
        return await action(connection);
    } catch (err) {
        console.error(err);
        throw err;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
}


// ----------------------------------------------------------
// Core functions for database operations
// Modify these functions, especially the SQL queries, based on your project's requirements and design.
async function testOracleConnection() {
    return await withOracleDB(async (connection) => {
        return true;
    }).catch(() => {
        return false;
    });
}

async function fetchGametableFromDb(query) {
    return await withOracleDB(async (connection) => {
        try{
            console.log('Executing query:', query); 
            const result = await connection.execute(query);
            return result.rows;
        } catch(err) {
            console.error(error);
            return [];
        }});
}

async function fetchAllTablesFromDb() {
    return await withOracleDB(async (connection) => {
        try {
            const result = await connection.execute("SELECT table_name FROM user_tables");
            return result.rows;
        } catch(err) {
            console.error(error);
            return [];
        }});
}

async function fetchAttributesFromTable(tableName) {
    return await withOracleDB(async (connection) => {
        try {
            const result = await connection.execute(`SELECT * FROM ${tableName}`);
            console.log(result.metaData);
            return result.metaData;
        } catch(err) {
            console.error(error);
            return [];
        }});
}

// Send UPDATE query to Oracle
async function updateGameReview(gameID, author, revDesc, score) {
    console.log("Sending UPDATE query to Oracle"); 
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `UPDATE GameReview SET rev_desc=:revDesc, score=:score where author=:author AND game_id=:gameID`,
            { gameID, author, revDesc, score },
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;

    }).catch(() => {
        return false;
    });
}

// Send DELETE query to Oracle
async function deleteGameReview(gameID, author) {
    console.log("Sending DELETE query to Oracle"); 
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `DELETE FROM GameReview WHERE author = :author AND game_id = :gameID`,
            { gameID, author },
            { autoCommit: true }
        );

        console.log("GameReview deleted")

        return result.rowsAffected && result.rowsAffected > 0;

    }).catch(() => {
        return false;
    });
}

async function findGames(genres) {
    console.log("Sending queries for division"); 
    return await withOracleDB(async (connection) => {
        // Build the query to find game IDs matching all selected genres
        const genreConditions = genres.map((_, index) => `g.genre_name = :genre${index}`).join(' OR ');
        const sqlQuery = `
            SELECT ga.game_id, ga.game_name
            FROM inGenre g
            JOIN Game ga ON g.game_id = ga.game_id
            WHERE ${genreConditions}
            GROUP BY ga.game_id, ga.game_name
            HAVING COUNT(DISTINCT g.genre_name) = :genreCount
        `;
        
        // Create bind parameters
        const bindParams = genres.reduce((params, genre, index) => {
            params[`genre${index}`] = genre;
            return params;
        }, {});
        bindParams.genreCount = genres.length;

        // Execute the SELECT query
        const result = await connection.execute(sqlQuery, bindParams);

        // Map the result to an array of game objects
        return result.rows.map(row => ({
            game_id: row[0],
            name: row[1]
        }));
    }).catch((error) => {
        console.error('Database query error:', error);
        throw error;
    });
}

async function insertGameReview(game_id, author, rev_desc, score) {

    // For debugging:
    console.log("INSERT: Inserting new values in GameReview Table")
    console.log(`Game ID: ${game_id}, Author: ${author}, Review Description: ${rev_desc}, Score: ${score}`);

    return await withOracleDB(async (connection) => {
        
        const result = await connection.execute(
            `INSERT INTO GameReview (game_id, author, rev_desc, score) 
                VALUES (:game_id, :author, :rev_desc, :score)`,
            [game_id, author, rev_desc, score],
            { autoCommit: true }
        );
        return result.rowsAffected && result.rowsAffected > 0;

    }).catch(() => {
        return false;
    });
}

// DEMO CODE BELOW: 


async function initiateDemotable() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE DEMOTABLE`);
        } catch(err) {
            console.log('Table might not exist, proceeding to create...');
        }

        const result = await connection.execute(`
            CREATE TABLE DEMOTABLE (
                id NUMBER PRIMARY KEY,
                name VARCHAR2(20)
            )
        `);
        return true;
    }).catch(() => {
        return false;
    });
}

async function insertDemotable(id, name) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO DEMOTABLE (id, name) VALUES (:id, :name)`,
            [id, name],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function updateNameDemotable(oldName, newName) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `UPDATE DEMOTABLE SET name=:newName where name=:oldName`,
            [newName, oldName],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function countDemotable() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT Count(*) FROM DEMOTABLE');
        return result.rows[0][0];
    }).catch(() => {
        return -1;
    });
}

module.exports = {
    testOracleConnection,
    fetchGametableFromDb,
    fetchAllTablesFromDb,
    fetchAttributesFromTable,
    initiateDemotable, 
    insertDemotable, 
    updateNameDemotable, 
    countDemotable,
    updateGameReview,
    deleteGameReview,
    findGames,
    insertGameReview
};