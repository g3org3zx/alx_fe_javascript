// Initialize quotes array from localStorage or empty array
let quotes = JSON.parse(localStorage.getItem('quotes')) || [];

// Server API URL
const serverUrl = 'https://jsonplaceholder.typicode.com/todos';

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
        const todos = await response.json();
        return todos.map(todo => ({
            id: todo.id,
            text: todo.title,
            category: `User${todo.userId}`
        }));
    } catch (error) {
        console.error(error);
        return [];
    }
}

// Function to post a quote to server (simulation, as it doesn't persist)
async function postToServer(quote) {
    try {
        const todo = {
            title: quote.text,
            userId: parseInt(quote.category.replace('User', '')) || 1,
            completed: false
        };
        const response = await fetch(serverUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(todo)
        });
        if (!response.ok) {
            throw new Error('Failed to post to server');
        }
        const newTodo = await response.json();
        return {
            id: newTodo.id,
            text: newTodo.title,
            category: `User${newTodo.userId}`
        };
    } catch (error) {
        console.error(error);
    }
}

// Bi-directional sync with conflict resolution
async function syncWithServer() {
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
    quoteDisplay.innerHTML = `<p><strong>${randomQuote.text}</strong><br
