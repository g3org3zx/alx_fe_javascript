// 🎯 Step 1: Make a list (array) of quotes
// Each quote has "text" (the saying) and "category" (what type it is).
let quotes = [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Success is not the key to happiness. Happiness is the key to success.", category: "Happiness" },
  { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" }
];

// 🎯 Step 2: Function to show a random quote
function showRandomQuote() {
  // Grab the <div> (empty box) on the page where the quote will go
  const quoteDisplay = document.getElementById("quoteDisplay");

  // Pick a random number between 0 and how many quotes we have
  const randomIndex = Math.floor(Math.random() * quotes.length);

  // Use that random number to choose one quote from the list
  const randomQuote = quotes[randomIndex];

  // Put the quote text + category into the page so people can see it
  quoteDisplay.innerHTML = `"${randomQuote.text}" — <em>${randomQuote.category}</em>`;
}

// 🎯 Step 3: Function to add a new quote
function addQuote() {
  // Get what the user typed in the "quote text" box
  const quoteText = document.getElementById("newQuoteText").value.trim();

  // Get what the user typed in the "quote category" box
  const quoteCategory = document.getElementById("newQuoteCategory").value.trim();

  // Check: Did the user type something in both boxes?
  if (quoteText && quoteCategory) {
    // Yes → add the new quote to our list (array)
    quotes.push({ text: quoteText, category: quoteCategory });

    // Tell the user it worked
    alert("Quote added!");

    // Clear the text boxes for next time
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
  } else {
    // No → tell the user they must fill both boxes
    alert("Please fill in both fields.");
  }
}

// 🎯 Step 4: Connect the button to the random quote function
// When someone clicks the "New Quote" button → run showRandomQuote()
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// 🎯 Step 5: Show one random quote immediately when the page loads
showRandomQuote();
