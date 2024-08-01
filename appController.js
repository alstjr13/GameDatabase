const express = require('express');
const appService = require('./appService');

const router = express.Router();

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
        res.json({ data: tableContent });
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