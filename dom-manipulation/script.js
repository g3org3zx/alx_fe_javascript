// Initialize quotes array from localStorage or empty array
let quotes = JSON.parse(localStorage.getItem('quotes')) || [];

// Server API URL
const serverUrl = 'https://jsonplaceholder.typicode.com/posts';

// Function to save quotes to localStorage
function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Function to fetch quotes from server
async function fetchQuotesFromServer() {
    try {
        const response = await fetch(serverUrl);
        if (!response.ok) {
            throw new Error('Failed to fetch from server');
        }
        const posts = await response.json();
        return posts.map(post => ({
            id: post.id,
            text: post.body, // Use body for quote text
            category: `User${post.userId}`
        }));
    } catch (error) {
        console.error(error);
        return [];
    }
}

// Function to post a quote to server (simulation, as it doesn't persist)
async function postToServer(quote) {
    try {
        const post = {
            body: quote.text, // Map quote text to body
            userId: parseInt(quote.category.replace('User', '')) || 1,
            title: 'Quote' // Required by posts endpoint, but not used
        };
        const response = await fetch(serverUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(post)
        });
        if (!response.ok) {
            throw new Error('Failed to post to server');
        }
        const newPost = await response.json();
        return {
            id: newPost.id,
            text: newPost.body,
            category: `User${newPost.userId}`
        };
    } catch (error) {
        console.error(error);
    }
}

// Bi-directional sync with conflict resolution
async function syncQuotes() {
    const serverQuotes = await fetchQuotesFromServer();
    if (serverQuotes.length === 0) {
        notify('Failed to fetch from server.');
        return;
    }

    // Create maps for quick lookup
    const localMap = new Map(quotes.map(q => [q.id, q]));
    const serverMap = new Map(serverQuotes.map(q => [q.id, q]));

    const conflicts = [];
    const notificationDiv = document.getElementById('notification');
    notificationDiv.innerHTML = ''; // Clear previous notifications

    // Handle server quotes (add new, check conflicts)
    for (let [id, serverQuote] of serverMap) {
        const localQuote = localMap.get(id);
        if (localQuote) {
            // Check for differences
            if (localQuote.text !== serverQuote.text || localQuote.category !== serverQuote.category) {
                conflicts.push({ id, local: localQuote, server: serverQuote });
            }
            localMap.delete(id); // Processed
        } else {
            // New from server
            quotes.push(serverQuote);
            notify(`Added new quote from server: "${serverQuote.text}" (${serverQuote.category})`);
        }
    }

    // Local extras (new local quotes) - simulate "push" to server, but since mock, just keep them
    // In a real app, loop over localMap and POST each

    // Handle conflicts
    const manualResolve = document.getElementById('manualResolve').checked;
    for (let conflict of conflicts) {
        let resolveToServer = true;
        if (manualResolve) {
            const message = `Conflict for quote ID ${conflict.id}:\nLocal: "${conflict.local.text}" (${conflict.local.category})\nServer: "${conflict.server.text}" (${conflict.server.category})\nResolve to server version? (OK for yes, Cancel for no)`;
            resolveToServer = window.confirm(message);
        }
        if (resolveToServer) {
            // Update local to server version
            const index = quotes.findIndex(q => q.id === conflict.id);
            quotes[index] = { ...conflict.server };
            notify(`Conflict resolved to server version: "${conflict.server.text}" (${conflict.server.category})`);
        } else {
            notify(`Conflict kept local version: "${conflict.local.text}" (${conflict.local.category})`);
            // In a real app, could PUT to server with local version
        }
    }

    // Save updates and refresh UI
    saveQuotes();
    populateCategories();
    filterQuotes();

    // Notify successful sync
    notify('Quotes synced with server!');
}

// Function to start periodic sync
function startPeriodicSync() {
    setInterval(syncQuotes, 30000); // Run syncQuotes every 30 seconds
}

// Function to populate categories in the dropdown
function populateCategories() {
    // Explicitly use document.getElementById to get the category filter dropdown
    const categoryFilter = document.getElementById('categoryFilter');
    
    // Clear existing options except the first one ("All Categories")
    while (categoryFilter.children.length > 1) {
        categoryFilter.removeChild(categoryFilter.lastChild);
    }
    
    // Explicitly use map to extract categories and create a Set for unique values
    const allCategories = quotes.map(quote => quote.category);
    const uniqueCategories = [...new Set(allCategories)];
    
    // Use document.getElementById again to ensure reference and append options
    const dropdown = document.getElementById('categoryFilter');
    uniqueCategories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        dropdown.appendChild(option);
    });
    
    // Restore last selected filter, if any
    const lastFilter = localStorage.getItem('lastCategoryFilter') || 'all';
    document.getElementById('categoryFilter').value = lastFilter;
}

// Function to filter and display quotes based on selected category
function filterQuotes() {
    const categoryFilter = document.getElementById('categoryFilter');
    const selectedCategory = categoryFilter.value;
    const quoteDisplay = document.getElementById('quoteDisplay');
    
    // Save selected filter to localStorage
    localStorage.setItem('lastCategoryFilter', selectedCategory);
    
    // Filter quotes
    const filteredQuotes = selectedCategory === 'all' 
        ? quotes 
        : quotes.filter(quote => quote.category === selectedCategory);
    
    // Clear previous content
    quoteDisplay.innerHTML = '';
    
    if (filteredQuotes.length === 0) {
        quoteDisplay.innerHTML = 'No quotes available for this category!';
        return;
    }
    
    // Display all filtered quotes
    filteredQuotes.forEach(quote => {
        const quoteElement = document.createElement('p');
        quoteElement.innerHTML = `<strong>${quote.text}</strong><br><em>Category: ${quote.category}</em>`;
        quoteDisplay.appendChild(quoteElement);
    });
}

// Function to display a random quote (filtered by current category)
function showRandomQuote() {
    const categoryFilter = document.getElementById('categoryFilter');
    const selectedCategory = categoryFilter.value;
    const quoteDisplay = document.getElementById('quoteDisplay');
    
    // Filter quotes based on current category
    const filteredQuotes = selectedCategory === 'all' 
        ? quotes 
        : quotes.filter(quote => quote.category === selectedCategory);
    
    if (filteredQuotes.length === 0) {
        quoteDisplay.innerHTML = "No quotes available for this category!";
        return;
    }
    
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const randomQuote = filteredQuotes[randomIndex];
    
    // Use innerHTML to display the quote
    quoteDisplay.innerHTML = `<p><strong>${randomQuote.text}</strong><br><em>Category: ${randomQuote.category}</em></p>`;
    
    // Save the last viewed quote to sessionStorage
    sessionStorage.setItem('lastQuote', JSON.stringify(randomQuote));
}

// Function to create and append the form for adding quotes (already in HTML)
function createAddQuoteForm() {
    // Form is in HTML, so we just ensure the addQuote function is bound
    const addButton = document.querySelector('button[onclick="addQuote()"]');
    addButton.addEventListener('click', addQuote);
}

// Function to add a new quote
async function addQuote() {
    const quoteTextInput = document.getElementById('newQuoteText');
    const quoteCategoryInput = document.getElementById('newQuoteCategory');
    const quoteDisplay = document.getElementById('quoteDisplay');

    const text = quoteTextInput.value.trim();
    const category = quoteCategoryInput.value.trim();

    // Validate inputs
    if (!text || !category) {
        // Clear previous content
        while (quoteDisplay.firstChild) {
            quoteDisplay.removeChild(quoteDisplay.firstChild);
        }
        const errorMessage = document.createElement('p');
        errorMessage.textContent = "Please enter both a quote and a category!";
        quoteDisplay.appendChild(errorMessage);
        return;
    }

    // Add new quote to the array with unique ID
    const newQuote = { id: Date.now(), text, category };
    quotes.push(newQuote);

    // Simulate posting to server (fire and forget)
    postToServer(newQuote);

    // Save to localStorage
    saveQuotes();

    // Update categories in dropdown
    populateCategories();

    // Clear input fields
    quoteTextInput.value = '';
    quoteCategoryInput.value = '';

    // Clear previous content
    while (quoteDisplay.firstChild) {
        quoteDisplay.removeChild(quoteDisplay.firstChild);
    }

    // Display confirmation using createElement and appendChild
    const confirmationMessage = document.createElement('p');
    confirmationMessage.textContent = "Quote added successfully!";

    const quoteText = document.createElement('p');
    const quoteStrong = document.createElement('strong');
    quoteStrong.textContent = text;
    quoteText.appendChild(quoteStrong);

    const categoryText = document.createElement('em');
    categoryText.textContent = `Category: ${category}`;
    const br = document.createElement('br');

    // Append elements to quoteDisplay
    quoteText.appendChild(br);
    quoteText.appendChild(categoryText);
    quoteDisplay.appendChild(confirmationMessage);
    quoteDisplay.appendChild(quoteText);
}

// Function to export quotes to a JSON file
function exportToJsonFile() {
    const jsonStr = JSON.stringify(quotes, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes.json';
    a.click();
    URL.revokeObjectURL(url);
}

// Function to import quotes from a JSON file
function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
        try {
            const importedQuotes = JSON.parse(event.target.result);
            // Validate imported quotes (array of objects with text and category)
            if (!Array.isArray(importedQuotes) || importedQuotes.some(q => !q.text || !q.category)) {
                alert('Invalid JSON format! Must be an array of objects with "text" and "category" properties.');
                return;
            }
            // Add IDs if missing
            importedQuotes.forEach(q => {
                if (!q.id) q.id = Date.now();
            });
            quotes.push(...importedQuotes);
            saveQuotes();
            populateCategories(); // Update categories after import
            alert('Quotes imported successfully!');
            // Display the last imported quote
            if (importedQuotes.length > 0) {
                const lastQuote = importedQuotes[importedQuotes.length - 1];
                document.getElementById('quoteDisplay').innerHTML = `<p><strong>${lastQuote.text}</strong><br><em>Category: ${lastQuote.category}</em></p>`;
            }
        } catch (e) {
            alert('Error parsing JSON file!');
        }
    };
    fileReader.readAsText(event.target.files[0]);
}

// Function to simulate local change for testing conflicts
function simulateLocalChange() {
    if (quotes.length === 0) {
        alert('No quotes to modify!');
        return;
    }
    const index = Math.floor(Math.random() * quotes.length);
    quotes[index].text = `Locally modified: ${quotes[index].text}`;
    saveQuotes();
    populateCategories();
    filterQuotes();
    alert('Local quote modified! Run sync to detect conflict.');
}

// Function to notify user
function notify(message) {
    const notificationDiv = document.getElementById('notification');
    const p = document.createElement('p');
    p.textContent = message;
    notificationDiv.appendChild(p);
}

// Event listeners
document.getElementById('newQuote').addEventListener('click', showRandomQuote);
document.getElementById('syncButton').addEventListener('click', syncQuotes);
document.getElementById('simulateLocalButton').addEventListener('click', simulateLocalChange);

// Initialize the form functionality
createAddQuoteForm();

// Populate categories on load and display last quote after initial sync
syncQuotes().then(() => {
    populateCategories();
    const lastQuote = JSON.parse(sessionStorage.getItem('lastQuote'));
    if (lastQuote) {
        document.getElementById('quoteDisplay').innerHTML = `<p><strong>${lastQuote.text}</strong><br><em>Category: ${lastQuote.category}</em></p>`;
    } else {
        filterQuotes();
    }
    startPeriodicSync(); // Start periodic sync after initial sync
});
