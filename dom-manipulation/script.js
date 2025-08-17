// 🎯 Function to create the "Add Quote" form dynamically
function createAddQuoteForm() {
  // 1. Find where we want to put the form (e.g., inside a div with id="formContainer")
  const container = document.getElementById("formContainer");

  // 2. Create a text input for the quote
  const quoteInput = document.createElement("input");
  quoteInput.id = "newQuoteText";
  quoteInput.placeholder = "Enter a new quote";

  // 3. Create a text input for the category
  const categoryInput = document.createElement("input");
  categoryInput.id = "newQuoteCategory";
  categoryInput.placeholder = "Enter category";

  // 4. Create a button to submit the new quote
  const addButton = document.createElement("button");
  addButton.textContent = "Add Quote";
  addButton.addEventListener("click", addQuote); // when clicked, run addQuote()

  // 5. Add everything to the container
  container.appendChild(quoteInput);
  container.appendChild(categoryInput);
  container.appendChild(addButton);
}

// 🎯 Call this function when the page loads
createAddQuoteForm();
