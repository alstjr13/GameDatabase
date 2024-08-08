const express = require('express');
const appService = require('./appService');

const router = express.Router();



// Function to sanitize the input from req body
// Returns true if safe, false otherwise
function checkReq(req) {
    const sqlKeywords = [
        'DROP TABLE', 'DROP DATABASE', 'DELETE FROM', 'INSERT INTO', 
        'UPDATE SET', 'SELECT * FROM', 'ALTER TABLE', 'CREATE TABLE', 
        'EXEC ', 'UNION SELECT', '--', ';', '/*', '*/'
    ];
    
    const reqBody = req.body;
    
    // Convert everything to uppercase for consistent comparison
    const upperCaseBody = JSON.stringify(reqBody).toUpperCase();

    // Check for SQL keywords
    for (const keyword of sqlKeywords) {
        if (upperCaseBody.includes(keyword)) {
            console.warn(`Potential SQL injection attempt detected with keyword: ${keyword}`);
            return false;
        }
    }

    return true; // Return true if no dangerous keywords are found
}

// ----------------------------------------------------------
// API endpoints
// Modify or extend these routes based on your project's needs.
router.get('/check-db-connection', async (req, res) => {
    const isConnect = await appService.testOracleConnection();
    if (isConnect) {
        res.send('connected');
    } else {
        res.send('unable to connect');
    }
});

// general use table fetching endpoint not just for table Game i could 
// rename it but i just dont want to right now
router.get('/gametable', async (req, res) => {
    try {
        const attributes = req.query.attributes;
        const tableName = req.query.table; 
        const filters = req.query.filters; 

        console.log('Attributes received:', attributes);  

        const selectedColumns = attributes.length > 0 ? attributes : '*';
    
        let query = `SELECT ${selectedColumns} FROM ${tableName}`;

        if (filters) {
            query += ` WHERE ${filters}`;
        }

        const tableContent = await appService.fetchGametableFromDb(query);
        res.json({ data: tableContent, success: true });
    } catch (error) {
        res.status(500).json({ success: false });
        console.error('Error fetching game table:', error);
    }
});


router.get('/getAllTables', async (req, res) => {
    try {
        const tableList = await appService.fetchAllTablesFromDb();
        res.json({ data: tableList });
    } catch {
        res.status(500).json({ success: false });
    }
});

router.get('/getTableAttributes', async (req, res) => {
    try {
        const tableName = req.query.name;
        console.log("table name is:", tableName);
        const tableList = await appService.fetchAttributesFromTable(tableName);
        res.json({ data: tableList });
    } catch(err) {
        res.status(500).json({ success: false });
    }
});

// Listen to UPDATE endpoint
router.post('/update-gamereview', async (req, res) => {
    console.log("POST request for update received");

    // Sanitize input
    if (!checkReq(req)) {
        return res.status(400).json({ success: false, message: "Invalid input detected" });
    }

    const { gameID, author, revDesc, score } = req.body;
    const updateResult = await appService.updateGameReview(gameID, author, revDesc, score);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

// Listen to DELETE endpoint
router.post('/delete-gamereview', async (req, res) => {
    console.log("POST request for delete received");

    // Sanitize input
    if (!checkReq(req)) {
        return res.status(400).json({ success: false, message: "Invalid input detected" });
    }

    const { gameID, author } = req.body;
    const updateResult = await appService.deleteGameReview(gameID, author);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

// Listen to endpoint for DIVISION
router.post('/find-games', async (req, res) => {
    console.log("POST request for division received");
    const { genres } = req.body;

    try {
        const games = await appService.findGames(genres);
        res.json(games);
    } catch (error) {
        console.error('Error finding games:', error);
        res.status(500).json({ success: false });
    }
});

// Listen to endpoint for NESTED
router.post('/find-above-average-games', async (req, res) => {
    console.log("POST request for finding above average games received");
    const { genres } = req.body;

    try {
        const games = await appService.findAboveAverageGames(genres);
        res.json(games);
    } catch (error) {
        console.error('Error finding above average games:', error);
        res.status(500).json({ success: false });
    }
});


// appController : INSERT Game Review
router.post('/insert-gamereview', async (req, res) => {
    console.log("POST: API request, INSERTing new values")

    // Sanitize input
    if (!checkReq(req)) {
        return res.status(400).json({ success: false, message: "Invalid input detected" });
    }
    
    const {game_id, author, rev_desc, score} = req.body;
    const insertResult = await appService.insertGameReview(game_id, author, rev_desc, score)
    if (insertResult) {
        res.json({ success: true});
    } else {
        res.status(500).json({success: false}); 
    }
})


// JOIN game with inGenre to select genres
router.get('/getGenresByGameId', async (req, res) => {
    try {
        const game_id = req.query.game_id;
        let query = `SELECT ig.genre_name 
                        FROM Game g, inGenre ig 
                        WHERE g.game_id = ig.game_id 
                            AND g.game_id = ${game_id}`;
        const tableContent = await appService.fetchGametableFromDb(query);
        res.json({ data: tableContent });
    } catch(err) {
        res.status(500).json({ success: false });
        console.error(`Error inGenre joining game_id ${game_id}:`, error);
    }
});

// JOIN game with published to select company names
router.get('/getPublishersByGameId', async (req, res) => {
    try {
        const game_id = req.query.game_id;
        let query = `SELECT c.company_name 
                        FROM Game g, Published p, Company c
                        WHERE g.game_id = p.game_id AND p.company_id = c.company_id
                        AND g.game_id = ${game_id}`;
        const tableContent = await appService.fetchGametableFromDb(query);
        res.json({ data: tableContent });
    } catch(err) {
        res.status(500).json({ success: false });
        console.error(`Error published joining game_id ${game_id}:`, error);
    }
});

// JOIN game with developed to select company names
router.get('/getDevelopersByGameId', async (req, res) => {
    try {
        const game_id = req.query.game_id;
        let query = `SELECT c.company_name 
                        FROM Game g, Developed d, Company c
                        WHERE g.game_id = d.game_id AND d.company_id = c.company_id
                        AND g.game_id = ${game_id}`;
        const tableContent = await appService.fetchGametableFromDb(query);
        res.json({ data: tableContent });
    } catch(err) {
        res.status(500).json({ success: false });
        console.error(`Error developed joining game_id ${game_id}:`, error);
    }
});

// get platform names given game_id
router.get('/getPlatformsByGameId', async (req, res) => {
    try {
        const game_id = req.query.game_id;
        let query = `SELECT platform_name 
                        FROM runsOn
                        WHERE game_id = ${game_id}`;
        const tableContent = await appService.fetchGametableFromDb(query);
        res.json({ data: tableContent });
    } catch(err) {
        res.status(500).json({ success: false });
        console.error(`Error getting platforms ${game_id}:`, error);
    }
});

// JOIN game with workedOn to select gamepeople names
router.get('/getGamePeopleByGameId', async (req, res) => {
    try {
        const game_id = req.query.game_id;
        let query = `SELECT gp.gpname 
                        FROM Game g, workedOn wo, Gameperson gp
                        WHERE g.game_id = wo.game_id AND wo.gameperson_id = gp.gameperson_id
                        AND g.game_id = ${game_id}`;
        const tableContent = await appService.fetchGametableFromDb(query);
        res.json({ data: tableContent });
    } catch(err) {
        res.status(500).json({ success: false });
        console.error(`Error workedOn joining game_id ${game_id}:`, error);
    }
});

// JOIN game with GameReview with selector query to filter a game's reviews
router.get('/getReviewsByGameIdFilter', async (req, res) => {
    try {
        const game_id = req.query.game_id;
        const operator = req.query.operator;
        const input = req.query.input;
        let query = `
            SELECT gr.author, gr.rev_desc, gr.score
                FROM Game g, GameReview gr
                WHERE g.game_id = gr.game_id 
                AND g.game_id = ${game_id}
                AND gr.score ${operator} ${input}
            `
        const tableContent = await appService.fetchGametableFromDb(query);
        res.json({ data: tableContent });
    } catch(err) {
        res.status(500).json({ success: false });
        console.error(`Error fetching reviews ${game_id}:`, error);
    }
})

// GROUP BY:
router.get('/calculate-average-scores', async (req, res) => {
    console.log("POST request for GROUP BY received");
    
    try {
        const scores = await appService.calculateAverageScore();
        res.json({ data: scores });
    } catch (error) {
        console.error('Error Calculating Average Score of games:', error);
        res.status(500).json({ success: false });
    }
});

// HAVING:
router.post('/having-budget', async (req, res) => {
    console.log("POST request for HAVING received");

    const threshold = req.body.threshold;

    // User input not received:
    if (threshold === undefined) {
        return res.status(400).json({message: "Input a value in USD to retrieve list of companies"})
    }

    try {
        const results = await appService.havingBudget(threshold);

        if (results == false) {
            res.status(500).json({message: "ERROR: Query unable to execute"})
        } else {
            res.json({ data: results });
        }
    } catch(err) {
        console.error("ERROR: ", err)
        res.status(500).json({message: "ERROR: havingBudget Unable to be executed"})
    }
})




// DEMO CODE BELOW:

router.post("/initiate-demotable", async (req, res) => {
    const initiateResult = await appService.initiateDemotable();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/insert-demotable", async (req, res) => {
    const { id, name } = req.body;
    const insertResult = await appService.insertDemotable(id, name);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/update-name-demotable", async (req, res) => {
    const { oldName, newName } = req.body;
    const updateResult = await appService.updateNameDemotable(oldName, newName);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.get('/count-demotable', async (req, res) => {
    const tableCount = await appService.countDemotable();
    if (tableCount >= 0) {
        res.json({ 
            success: true,  
            count: tableCount
        });
    } else {
        res.status(500).json({ 
            success: false, 
            count: tableCount
        });
    }
});


module.exports = router;