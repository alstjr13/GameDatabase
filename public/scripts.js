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

    gametableContent.forEach(tuple => {
        const row = tableBody.insertRow();
        tuple.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
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

// add event listener to determine user selected table,
// then fetch tables attributes from database. generate html elements
var tableSelection = document.getElementById("table_select");
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

        const filterOperator = document.createElement('select');
        filterOperator.id = `${attribute.name}_operator`;
        filterOperator.innerHTML = '<option value="=">=</option> <option value=">">></option> <option value="<"><</option>';

        const filterInput = document.createElement('input');
        filterInput.type = 'text';
        filterInput.id = `${attribute.name}_input`;

        filterDiv.appendChild(filterAttributeName);
        // filterDiv.appendChild(filterLabel);
        filterDiv.appendChild(filterOperator);
        filterDiv.appendChild(filterInput);

        applyFilters.appendChild(filterDiv);
    });
});


// For UPDATE Query
// Updates names in the demotable.
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
        // TODO: Maybe not string
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

// ---------------------------------------------------------------
// Initializes the webpage functionalities.
// Add or remove event listeners based on the desired functionalities.
window.onload = function() {
    checkDbConnection();
    fetchTableData();
    document.getElementById("resetDemotable").addEventListener("click", resetDemotable);
    document.getElementById("insertDemotable").addEventListener("submit", insertDemotable);
    document.getElementById("updataNameDemotable").addEventListener("submit", updateNameDemotable);
    document.getElementById("countDemotable").addEventListener("click", countDemotable);
};

// General function to refresh the displayed table data. 
// You can invoke this after any table-modifying operation to keep consistency.
function fetchTableData() {
    // fetchAndDisplayUsers();
}
