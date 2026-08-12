// Select DOM Elements
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const recipeContainer = document.getElementById("recipe-container");
const loading = document.getElementById("loading");
const errorMessage = document.getElementById("error-message");

// API Endpoint (Free Public API from TheMealDB)
const API_URL = "https://www.themealdb.com/api/json/v1/1/search.php?s=";

/**
 * Fetch recipes from API based on search query
 */
async function searchRecipes(event) {
  // Prevent form submit page reload
  if (event) event.preventDefault();

  const searchText = searchInput.value.trim();

  // 1. Validation check
  if (searchText === "") {
    errorMessage.textContent = "Please enter a recipe name to search.";
    recipeContainer.innerHTML = "";
    loading.textContent = "";
    return;
  }

  // Clear previous outputs and error states
  errorMessage.textContent = "";
  recipeContainer.innerHTML = "";
  loading.textContent = "Loading recipes...";

  try {
    // 2. Fetch data from external API
    const response = await fetch(`${API_URL}${encodeURIComponent(searchText)}`);

    // 3. Verify HTTP response status
    if (!response.ok) {
      throw new Error(`Server returned status: ${response.status}`);
    }

    // 4. Parse JSON data
    const data = await response.json();

    // 5. Handle empty search results from API
    if (!data.meals) {
      errorMessage.textContent = "No recipes found. Try searching for something else!";
      return;
    }

    // 6. Display recipes in DOM
    displayRecipes(data.meals);

  } catch (error) {
    // 7. Handle network or API parsing errors
    console.error("Fetch Error:", error);
    errorMessage.textContent = "Unable to load recipes. Please check your internet connection.";
  } finally {
    // 8. Always clear loading indicator
    loading.textContent = "";
  }
}

/**
 * Render array of meals into HTML recipe cards
 */
function displayRecipes(meals) {
  // Map array into HTML strings and insert into container
  recipeContainer.innerHTML = meals.map(meal => {
    return `
      <article class="recipe-card">
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
        <h3>${meal.strMeal}</h3>
        <p class="recipe-details">
          <strong>Category:</strong> ${meal.strCategory || 'General'} | 
          <strong>Origin:</strong> ${meal.strArea || 'Global'}
        </p>
        <a href="${meal.strSource || meal.strYoutube || '#'}" 
           target="_blank" 
           rel="noopener noreferrer" 
           class="recipe-link">
           View Recipe
        </a>
      </article>
    `;
  }).join('');
}

// Event Listeners
searchForm.addEventListener("submit", searchRecipes);