2. Creating a Dynamic Content Filtering System Using Web Storage and JSON
mandatory
Objective: Enhance the “Dynamic Quote Generator” by implementing a dynamic content filtering system that allows users to filter quotes by categories stored in web storage. This task focuses on integrating interactive filtering capabilities that utilize web storage to enhance user experience.

Task Description:
Expand the functionality of the “Dynamic Quote Generator” to include a filtering system based on categories. Users will be able to select a category and see only the quotes that match this category. This involves manipulating the DOM to dynamically update the displayed content and using web storage to remember the user’s last selected filter across sessions.

Step 1: Update the HTML Structure
Add Category Filter:
Introduce a dropdown menu or a set of buttons that allow the user to select a category for filtering quotes.
  <select id="categoryFilter" onchange="filterQuotes()">
    <option value="all">All Categories</option>
    <!-- Dynamically populated categories -->
  </select>
Step 2: Implement Filtering Logic in JavaScript
Populate Categories Dynamically:

Use the existing quotes array to extract unique categories and populate the dropdown menu.
Name the function behind this implementation populateCategories.
Filter Quotes Based on Selected Category:

Implement the filterQuotes function to update the displayed quotes based on the selected category.
Remember the Last Selected Filter:

Use local storage to save the last selected category filter and restore it when the user revisits the page.
Step 3: Update Web Storage with Category Data
Enhance Storage Functionality:
Update the addQuote function to also update the categories in the dropdown if a new category is introduced.
Ensure that changes in categories and filters are reflected in real-time and persisted across sessions.
Step 4: Testing and Deployment
Ensure Comprehensive Testing:
Test the application to ensure the filtering system works correctly across different browsers and sessions.
Verify that category changes and filter preferences are preserved as expected using web storage.
Repo:

GitHub repository: alx_fe_javascript
Directory: dom-manipulation
