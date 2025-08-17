// Initialize quotes array from localStorage or use default quotes
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
    { text: "The only way to do great work is to love what you do.", category: "Motivation" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "Stay hungry, stay foolish.", category: "Motivation" },
    { text: "You must be the change you wish to see in the world.", category: "Inspiration" }
];

// Function to save quotes to localStorage
function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
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
function addQuote() {
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

    // Add new quote to the array
    const newQuote = { text, category };
    quotes.push(newQuote);

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

// Event listener for the "Show New Quote" button
document.getElementById('newQuote').addEventListener('click', showRandomQuote);

// Initialize the form functionality
createAddQuoteForm();

// Populate categories on load
populateCategories();

// Display the last viewed quote from sessionStorage on page load, if available
const lastQuote = JSON.parse(sessionStorage.getItem('lastQuote'));
if (lastQuote) {
    document.getElementById('quoteDisplay').innerHTML = `<p><strong>${lastQuote.text}</strong><br><em>Category: ${lastQuote.category}</em></p>`;
}// Initialize quotes array from localStorage or use default quotes
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
    { text: "The only way to do great work is to love what you do.", category: "Motivation" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "Stay hungry, stay foolish.", category: "Motivation" },
    { text: "You must be the change you wish to see in the world.", category: "Inspiration" }
];

// Function to save quotes to localStorage
function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
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
function addQuote() {
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

    // Add new quote to the array
    const newQuote = { text, category };
    quotes.push(newQuote);

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

// Event listener for the "Show New Quote" button
document.getElementById('newQuote').addEventListener('click', showRandomQuote);

// Initialize the form functionality
createAddQuoteForm();

// Populate categories on load
populateCategories();

// Display the last viewed quote from sessionStorage on page load, if available
const lastQuote = JSON.parse(sessionStorage.getItem('lastQuote'));
if (lastQuote) {
    document.getElementById('quoteDisplay').innerHTML = `<p><strong>${lastQuote.text}</strong><br><em>Category: ${lastQuote.category}</em></p>`;
}
