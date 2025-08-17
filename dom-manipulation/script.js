// Initial array of quotes
let quotes = [
    { text: "The only way to do great work is to love what you do.", category: "Motivation" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "Stay hungry, stay foolish.", category: "Motivation" },
    { text: "You must be the change you wish to see in the world.", category: "Inspiration" }
];

// Function to display a random quote
function showRandomQuote() {
    const quoteDisplay = document.getElementById('quoteDisplay');
    if (quotes.length === 0) {
        quoteDisplay.innerHTML = "No quotes available!";
        return;
    }
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    quoteDisplay.innerHTML = `<p><strong>${randomQuote.text}</strong><br><em>Category: ${randomQuote.category}</em></p>`;
}

// Function to create and append the form for adding quotes (already in HTML, but this ensures dynamic behavior)
function createAddQuoteForm() {
    // Form is already in HTML, so we just attach event listeners if needed
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
        quoteDisplay.innerHTML = "Please enter both a quote and a category!";
        return;
    }

    // Add new quote to the array
    const newQuote = { text, category };
    quotes.push(newQuote);

    // Clear input fields
    quoteTextInput.value = '';
    quoteCategoryInput.value = '';

    // Display confirmation
    quoteDisplay.innerHTML = `Quote added successfully!<br><strong>${text}</strong><br><em>Category: ${category}</em>`;
}

// Event listener for the "Show New Quote" button
document.getElementById('newQuote').addEventListener('click', showRandomQuote);

// Initialize the form functionality
createAddQuoteForm();
