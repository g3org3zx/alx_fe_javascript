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

// Function to display a random quote
function showRandomQuote() {
    const quoteDisplay = document.getElementById('quoteDisplay');
    
    if (quotes.length === 0) {
        quoteDisplay.innerHTML = "No quotes available!";
        return;
    }

    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    
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

// Display the last viewed quote from sessionStorage on page load, if available
const lastQuote = JSON.parse(sessionStorage.getItem('lastQuote'));
if (lastQuote) {
    document.getElementById('quoteDisplay').innerHTML = `<p><strong>${lastQuote.text}</strong><br><em>Category: ${lastQuote.category}</em></p>`;
}
