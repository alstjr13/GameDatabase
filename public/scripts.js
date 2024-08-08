/*
 * These functions below are for various webpage functionalities. 
 * Each function serves to process data on the frontend:
 *      - Before sending requests to the backend.
 *      - After receiving responses from the backend.
 * 
 * To tailor them to your specific needs,
 * adjust or expand these functions to match both your 
 *   backend endpoints 
 * and 
 *   HTML structure.
 * 
 */


// global var to keep track of if a game is expanded 
// id of added row, ie. the expanded view of game
let currExpandedGameId = null;

// This function checks the database connection and updates its status on the frontend.
async function checkDbConnection() {
    const statusElem = document.getElementById('dbStatus');
    const loadingGifElem = document.getElementById('loadingGif');

    const response = await fetch('/check-db-connection', {
        method: "GET"
    });

    // Hide the loading GIF once the response is received.
    loadingGifElem.style.display = 'none';
    // Display the statusElem's text in the placeholder.
    statusElem.style.display = 'inline';

    response.text()
    .then((text) => {
        statusElem.textContent = text;
    })
    .catch((error) => {
        statusElem.textContent = 'connection timed out';  // Adjust error handling if required.
    });
}

// Fetches data from the database and displays it.
async function fetchAndDisplayTable() {
    const tableName = document.getElementById('table_select').value;
    const tableBody = document.getElementById('gametableBody');
    const tableHeader = document.getElementById('gametableHeaders');
    // const messageElement = document.getElementById('insertResultMsg');

    // obtain user selected attributes
    const selectedAttributes = Array.from(
        document.querySelectorAll('input[name="attribute"]:checked'),
        element => element.value);
    console.log(selectedAttributes);

    const filters = []; 
    // obtain user selected filters 
    selectedAttributes.forEach(attribute => {
        const operator = document.getElementById(attribute.concat("_operator")).value; 
        const input = document.getElementById(attribute.concat("_input")).value;

        if (input) {
            filter = attribute.concat(' ', operator, ' ', input); 
            filters.push(filter);
        }
    });

    console.log(filters);

    const response = await fetch(`/gametable?attributes=${selectedAttributes.join(', ')}&table=${tableName}&filters=${filters.join(' AND ')}`, { 
        method: 'GET'
    });
    const responseData = await response.json();
    const gametableContent = responseData.data;

    if (!responseData.success) {
        // messageElement.textContent = "Error fetching data!";
        console.log("Error fetching data!")
    }

    // Always clear old, already fetched data before new fetching process.
    if (tableBody) {
        tableBody.innerHTML = '';
    }

    tableHeader.innerHTML = '';
    selectedAttributes.forEach(attribute => {
        const th = document.createElement('th');
        th.textContent = attribute;
        tableHeader.appendChild(th); 
    })

    gametableContent.forEach((tuple, rowIndex) => {
        const row = tableBody.insertRow();
        if (tableName == 'GAME') {
            row.id = tuple[0]; // first col is id in our db
            row.addEventListener('click', () => expandGameDetails(tuple[0], rowIndex));
        }
        tuple.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

// get information through JOIN queries, display under clicked game 
// only for when GAME table is selected and displayed.
async function expandGameDetails(game_id, rowIndex) {
    const tableBody = document.getElementById('gametableBody');

    // generate id 
    const expansionNewId = `game${game_id}AtRow${rowIndex + 1}`;

    const existingExpanded = document.getElementById(currExpandedGameId);

    // if same row clicked, do nothing else remove
    if (existingExpanded && currExpandedGameId == expansionNewId) {
        return; 
    } else if (existingExpanded) {
        existingExpanded.remove(); 
    }

    const genres = await getGenresByGameId(game_id);
    const publishers = await getPublishersByGameId(game_id);
    const developers = await getDevelopersByGameId(game_id);
    const platforms = await getPlatformsByGameId(game_id);
    const gamepeople = await getGamePeopleByGameId(game_id);

    // create row at rowIndex + 1
    const row = tableBody.insertRow(rowIndex + 1);
    row.id = expansionNewId;

    // insert cell for game info
    const infoCell = row.insertCell(0);

    //cell.colspan = tableBody.rows[0].cells.length - 1; idk why this doesnt work
    //i mean this entire function is kinda dumb to begin with maybe should have just 
    //done everything and have stuff hidden through css

    // build content for expanded game information
    const gameInfo = document.createElement('div');
    gameInfo.innerHTML = `
        <strong>Genres:</strong> ${genres.join(', ')}<br>
        <strong>Publishers:</strong> ${publishers.join(', ')}<br>
        <strong>Developers:</strong> ${developers.join(', ')}<br>
        <strong>Platforms:</strong> ${platforms.join(', ')}<br>
        <strong>People involved:</strong> ${gamepeople.join(', ')}
    `;
    
    // add button to fetch reviews
    filterReviewButton = document.createElement('button');
    filterReviewButton.textContent = 'Filter reviews';
    filterReviewButton.addEventListener('click', () => filterGameReviews(game_id));

    // add form to filter reviews
    const filterOperator = document.createElement('select');
    filterOperator.id = `${game_id}_review_operator`;
    filterOperator.innerHTML = '<option value="=">Equal to</option> <option value=">">Greater than</option> <option value="<">Less than</option>';

    const filterInput = document.createElement('input');
    filterInput.type = 'text';
    filterInput.id = `${game_id}_filter_input`;

    // add button to gameInfo div
    gameInfo.appendChild(document.createElement('br'));
    gameInfo.appendChild(document.createElement('br'));
    gameInfo.appendChild(filterReviewButton);

    // add form and operator to gameInfo div
    gameInfo.appendChild(filterOperator);
    gameInfo.appendChild(filterInput);

    // cell to display game reviews
    const reviewCell = row.insertCell(1);
    reviewCell.id = `${game_id}_reviewCell`;

    // add game info to cell containing game info
    infoCell.appendChild(gameInfo);

    // add inforCell and reviewCell to row
    row.appendChild(infoCell);
    row.appendChild(reviewCell);

    // update currExpandedRowId 
    currExpandedGameId = expansionNewId;
}

// fetches names of all tables in database
async function getAllTables() {
    const table_select_options = document.getElementById('table_select');

    const response = await fetch("/getAllTables", {
        method: 'GET' // select table_name from user_tables; 
    });
    const responseData = await response.json();
    const tableList = responseData.data;

    // clean dropdown selections, add default one
    if (table_select_options) {
        table_select_options.innerHTML = '';
        const defaultOption = document.createElement('option');
        defaultOption.value = "";
        defaultOption.textContent = "--select--"; 
        table_select_options.appendChild(defaultOption);
    }

    // create dropdown options and append to table_select 
    tableList.forEach(tablename => {
        const option = document.createElement('option');
        option.value = tablename; 
        option.textContent = tablename;
        table_select_options.appendChild(option);
    });
}

// Fetch all tables upon page refresh, only on index.html
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.endsWith('index.html')) {
        getAllTables();
    }
});

// add event listener to determine user selected table,
// then fetch tables attributes from database. generate html elements
var tableSelection = document.getElementById("table_select");

// Only add event listener if we are at index.html
if (tableSelection) {
    tableSelection.addEventListener('change', async (event) => {
        const attributeSelect = document.getElementById("attribute_select");
        const applyFilters = document.getElementById("apply_filter"); 
        const selectedTable = event.target.value;
    
        console.log(selectedTable);
    
        // will return array of objects { name: attribute_name }
        const response = await fetch(`/getTableAttributes?name=${selectedTable}`, {
            method: 'GET' 
        });
        const responseData = await response.json();
        const attributesList = responseData.data;
    
        // clean elements, create new labels and inputs, append to div
        attributeSelect.innerHTML = '';
        applyFilters.innerHTML = '';
        attributesList.forEach(attribute => {
            // attribute checkboxes for projection
            const label = document.createElement('label');
            const input = document.createElement('input');
    
            // Styling for labels and inputs
            label.htmlFor = attribute.name;
            label.textContent = attribute.name; 
    
            input.type = 'checkbox';
            input.id = attribute.name;
            input.name = 'attribute';
            input.value = attribute.name;
            input.checked = true;


    
            attributeSelect.appendChild(input);
            attributeSelect.appendChild(label);
    
            // attribute filtering for selection
            const filterDiv = document.createElement('div');
            filterDiv.className = 'filter-apply'; 
    
            const filterAttributeName = document.createElement('div');
            filterAttributeName.innerHTML = `${attribute.name}`;
    
            // const filterLabel = document.createElement('label');
    
            // Styling for filtering operators
            const filterOperator = document.createElement('select');
            filterOperator.id = `${attribute.name}_operator`;
            filterOperator.innerHTML = '<option value="=">=</option> <option value=">">></option> <option value="<"><</option>';
    
            const filterInput = document.createElement('input');
            filterInput.type = 'text';
            filterInput.id = `${attribute.name}_input`;
            filterInput.style.marginLeft = '10px';
    
            filterDiv.appendChild(filterAttributeName);
            // filterDiv.appendChild(filterLabel);
            filterDiv.appendChild(filterOperator);
            filterDiv.appendChild(filterInput);
    
            applyFilters.appendChild(filterDiv);
        });
    });
}


// document.getElementById('insertGameReviewForm').addEventListener('submit', insertGameReviewTable);
async function insertGameReviewTable(event) {
    event.preventDefault();

    const idValue = document.getElementById('insertID').value;
    const authorValue = document.getElementById('insertAuthor').value;
    const descValue = document.getElementById('insertDesc').value;
    const scoreValue = document.getElementById('insertScore').value;

    const response = await fetch('/insert-gamereview', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            game_id: idValue,
            author: authorValue,
            rev_desc: descValue,
            score: scoreValue
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('insertResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Game Review inserted successfully!";
        console.log("INSERT: GameReview, JSON");
        fetchTableData();
    } else {
        messageElement.textContent = "Error inserting data!";
    }
}

// For AGGREGATION with GROUP BY query
async function fetchDisplayGamesWithAvergeReview() {
    console.log("getting averages for each game");

    const tableBody = document.getElementById('averageTableBody');
    const tableHeader = document.getElementById('averageTableHeaders');

    const response = await fetch('/calculate-average-scores', { 
        method: 'GET'
    });
    const responseData = await response.json();
    const gametableContent = responseData.data;

    // Always clear old, already fetched data before new fetching process.
    if (tableBody) {
        tableBody.innerHTML = '';
    }
    console.log(response);
    console.log(gametableContent);

    const selectedAttributes = ["game_id", "name", "average_score"];

    tableHeader.innerHTML = '';
    selectedAttributes.forEach(attribute => {
        const th = document.createElement('th');
        th.textContent = attribute;
        tableHeader.appendChild(th); 
    });

    gametableContent.forEach(tuple => {
        const row = tableBody.insertRow();
        selectedAttributes.forEach(header => {
            const cell = row.insertCell();

            if (header === 'average_score') {
                cell.textContent = parseFloat(tuple[header]).toFixed(3);
            } else {
                cell.textContent = tuple[header]; 
            }
        });
    });
}

// For AGGREGATION by HAVING query
async function getCompaniesByBudget(event) {
    event.preventDefault(); //prevent page refresh

    const tableBody = document.getElementById('havingqueryBody');
    const tableHeader = document.getElementById('havingqueryHeaders');
    const threshold = document.getElementById('budgetThreshold').value;

    const response = await fetch('/having-budget', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            threshold: threshold
        })
    });
    const responseData = await response.json();
    const companies = responseData.data;

    // Clear existing table data
    tableBody.innerHTML = '';

    // Update table headers
    const selectedAttributes = ["company_ID", "company_name", "avg_budget"];
    tableHeader.innerHTML = '';
    selectedAttributes.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        tableHeader.appendChild(th);
    });

    // Populate table with new data
    companies.forEach(company => {
        const row = tableBody.insertRow();
        selectedAttributes.forEach(attr => {
            const cell = row.insertCell();
            cell.textContent = company[attr]; 
        })
    });
}

// For UPDATE Query
async function updateGameReview(event) {
    console.log("Update button clicked")
    // event.preventDefault();

    // Retrieve values from HTML form
    const gameIDValue = document.getElementById('updateGameID').value;
    const authorValue = document.getElementById('updateAuthor').value;
    const revDescValue = document.getElementById('updateRevDesc').value;
    const scoreValue = document.getElementById('updateScore').value;

    // Send POST request to UPDATE endpoint
    const response = await fetch('/update-gamereview', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            gameID: gameIDValue,
            author: authorValue,
            revDesc: revDescValue,
            score: scoreValue
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('updateResultMsg');

    if (responseData.success) {
        messageElement.textContent = "GameReview updated successfully!";
        console.log("Update completed")
        // Might want to call a function here that re-renders projection HTML?
    } else {
        messageElement.textContent = "Error updating GameReview!";
        console.log("Update failed")
    }
}

// For DELETE Query
// Deletes a GameReview specified by author and gameid
async function deleteGameReview(event) {
    console.log("Delete button clicked")
    // event.preventDefault();

    // Retrieve values from HTML form
    const gameIDValue = document.getElementById('deleteGameID').value;
    const authorValue = document.getElementById('deleteAuthor').value;

    // Send POST request to DELETE endpoint
    const response = await fetch('/delete-gamereview', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            gameID: gameIDValue,
            author: authorValue,
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('deleteResultMsg');

    if (responseData.success) {
        messageElement.textContent = "GameReview deleted successfully!";
        console.log("Delete completed")
        // Might want to call a function here that re-renders projection HTML?
    } else {
        messageElement.textContent = "Error deleting GameReview!";
        console.log("Delete failed")
    }
}

// FOR DIVISION AND NESTED QUERY
async function submitGenres(action) {
    event.preventDefault(); // Prevent the default form submission behavior

    const endpoint = action === 'findAboveAverageGames' ? '/find-above-average-games' : '/find-games';

    // Get selected genres from checkboxes
    const selectedGenres = Array.from(document.querySelectorAll('input[name="genres"]:checked'))
        .map(checkbox => checkbox.value);

    console.log('Selected genres:', selectedGenres);

    // Send selected genres to the server using fetch API
    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ genres: selectedGenres })
        });

        // Check if the response is successful
        if (!response.ok) {
            throw new Error(`Server error: ${response.statusText}`);
        }

        // Parse JSON response
        const games = await response.json();

        // Display the game IDs in the results div
        const resultsDiv = document.getElementById('gameResults');
        resultsDiv.innerHTML = games.length > 0
            ? games.map(game => `<p>${game.name}</p>`).join('')
            : '<p>No games found for selected genres.</p>';
    } catch (error) {
        console.error('Error fetching games:', error);
        // Display error message to the user
        document.getElementById('gameResults').innerHTML = '<p>An error occurred while fetching games. Please try again later.</p>';
    }
}

// FOR JOIN QUERIES
// GET request to retrieve genres by joining Game with inGenre
// returns only list of genres
async function getGenresByGameId(game_id) {
    const response = await fetch(`/getGenresByGameId?game_id=${game_id}`, {
        method: 'GET'
    });
    const responseData = await response.json();
    const genres = responseData.data;

    return genres;
}

// GET request to retrieve publishers by joining Game with published
// returns only list of publishers
async function getPublishersByGameId(game_id) {
    const response = await fetch(`/getPublishersByGameId?game_id=${game_id}`, {
        method: 'GET'
    });
    const responseData = await response.json();
    const publishers = responseData.data;

    return publishers;
}

// GET request to retrieve developers by joining Game with developed
// returns only list of developers
async function getDevelopersByGameId(game_id) {
    const response = await fetch(`/getDevelopersByGameId?game_id=${game_id}`, {
        method: 'GET'
    });
    const responseData = await response.json();
    const developers = responseData.data;

    return developers;
}

// GET request to retrieve platforms by joining Game with runsOn
// returns only list of platforms
async function getPlatformsByGameId(game_id) {
    const response = await fetch(`/getPlatformsByGameId?game_id=${game_id}`, {
        method: 'GET'
    });
    const responseData = await response.json();
    const platforms = responseData.data;

    return platforms;
}

// GET request to retrieve game people by joining Game with workedOn
// returns only list of game people
async function getGamePeopleByGameId(game_id) {
    const response = await fetch(`/getGamePeopleByGameId?game_id=${game_id}`, {
        method: 'GET'
    });
    const responseData = await response.json();
    const gamepeople = responseData.data;

    return gamepeople;
}

async function filterGameReviews(game_id) {
    const operator = document.getElementById(`${game_id}_review_operator`).value;
    const input = document.getElementById(`${game_id}_filter_input`).value;

    if (!input) {
        alert("Ensure form is filled out!");
        return;
    }
    
    const response = await fetch(`/getReviewsByGameIdFilter?game_id=${game_id}&operator=${operator}&input=${input}`, {
        method: 'GET'
    });
    const responseData = await response.json();
    const reviews = responseData.data;

    const reviewCell = document.getElementById(`${game_id}_reviewCell`);
    let temp = ``;
    
    reviews.forEach(tuple => {
        temp += `
        <strong>${tuple[0]}:</strong> ${tuple[1]}<strong> [${tuple[2]}]</strong><br>`
    });

    reviewCell.innerHTML = temp;
}



// ---------------------------------------------------------------
// Initializes the webpage functionalities.
// Add or remove event listeners based on the desired functionalities.
window.onload = function() {
    checkDbConnection();
    fetchTableData();
    // document.getElementById("resetDemotable").addEventListener("click", resetDemotable);
    // document.getElementById("insertDemotable").addEventListener("submit", insertDemotable);
    // document.getElementById("updataNameDemotable").addEventListener("submit", updateNameDemotable);
    // document.getElementById("countDemotable").addEventListener("click", countDemotable);
};

// General function to refresh the displayed table data. 
// You can invoke this after any table-modifying operation to keep consistency.
function fetchTableData() {
    // fetchAndDisplayUsers();
}










/* DEMO CODE BELOW






*/


// This function resets or initializes the demotable.
async function resetDemotable() {
    const response = await fetch("/initiate-demotable", {
        method: 'POST'
    });
    const responseData = await response.json();

    if (responseData.success) {
        const messageElement = document.getElementById('resetResultMsg');
        messageElement.textContent = "demotable initiated successfully!";
        fetchTableData();
    } else {
        alert("Error initiating table!");
    }
}

// Inserts new records into the demotable.
async function insertDemotable(event) {
    event.preventDefault();

    const idValue = document.getElementById('insertId').value;
    const nameValue = document.getElementById('insertName').value;

    const response = await fetch('/insert-demotable', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: idValue,
            name: nameValue
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('insertResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Data inserted successfully!";
        fetchTableData();
    } else {
        messageElement.textContent = "Error inserting data!";
    }
}

// Updates names in the demotable.
async function updateNameDemotable(event) {
    event.preventDefault();

    const oldNameValue = document.getElementById('updateOldName').value;
    const newNameValue = document.getElementById('updateNewName').value;

    const response = await fetch('/update-name-demotable', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            oldName: oldNameValue,
            newName: newNameValue
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('updateNameResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Name updated successfully!";
        fetchTableData();
    } else {
        messageElement.textContent = "Error updating name!";
    }
}

// Counts rows in the demotable.
// Modify the function accordingly if using different aggregate functions or procedures.
async function countDemotable() {
    const response = await fetch("/count-demotable", {
        method: 'GET'
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('countResultMsg');

    if (responseData.success) {
        const tupleCount = responseData.count;
        messageElement.textContent = `The number of tuples in demotable: ${tupleCount}`;
    } else {
        alert("Error in count demotable!");
    }
}
