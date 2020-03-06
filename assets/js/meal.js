let search;
let mealsArray = [];
const searchContainerEl = $('#search-results-container');
const recipeEl = $("#recipe");

const mealSearch = (searchTerm) => {
    $.ajax({
        url: "https://www.themealdb.com/api/json/v1/1/search.php?s="+searchTerm,
        method: "GET"
    }).then(function(response){
        let searchResultEl = $('#search-results');
        mealsArray = response.meals;

        /* display meal options from user search */
        searchResultEl.empty();
        searchContainerEl.css('display', 'block');
        recipeEl.css('display', 'none');
  
        /* Get a reference to the search history element for this search */

        if (mealsArray === null) {
            const searchFailedMsg = $('<p>').text('Sorry, no results were found. Try another search.');
            $('#search-results').append(searchFailedMsg);
        } else {
            displaySearchHistory(searchTerm);
            const historyElement = $("li[data-search|=' + searchTerm + ']");

            /* Update search history listing with count of recipes returned */
            const recipesReturnedCount = `${searchTerm} (${mealsArray.length})`;
          
            /* Get the search history object and update the count for this search */
            let searchHistory = JSON.parse(localStorage.getItem('search_history'));
            searchHistory[searchTerm].text = recipesReturnedCount;
          
            /* Save the history again */
            localStorage.setItem('search_history', JSON.stringify(searchHistory));

            historyElement.innerHTML = recipesReturnedCount;
            
            /* Print each search result */
            for (obj of mealsArray) {
                const resultElement = $('<div>').attr('class', 'column is-3');
                const resultLink = $('<a id="' + obj.idMeal + '">');
                const resultImg = $('<img>').attr('width', '200');
                resultImg.attr('src', obj.strMealThumb);
                const resultPara = $('<p>').text(obj.strMeal);
              
                resultLink.attr("onclick", "recipeSelected(event)");
                resultLink.append(resultImg);
                resultLink.append(resultPara);
                resultElement.append(resultLink);
              
                /* Place the new elements for the recipe on the page */
                $('#search-results').append(resultElement);
            };
        }
    });
};


function recipeSelected(event) {
    // need to determine what was selected since the event doesn't capture the anchor tag
    if(event.target.localName === "img" || event.target.localName === "p"){
        console.log('foobarbaz');
        mealSelection(event.target.parentNode.id);
    }else{
        mealSelection(event.target.id);
    }    
}

const mealSelection = (selMealID) => {
    let mealSelectionArray = [];

    let selMealObj = mealsArray.find(mealsArray => mealsArray.idMeal === selMealID);
    var mealTitleEl = $("#title");
    var mealImgEl = $("#recipe_img");
    var ingredientEl = $("#ingredient");
    var measurementEl = $("#measurement");
    var instructionsEl = $("#instructions");

    /* Hide search results and show recipe */
    searchContainerEl.css('display', 'none');
    recipeEl.css('display', 'block');
    ingredientEl.empty();
    measurementEl.empty();

    mealTitleEl.text(selMealObj.strMeal);
    mealImgEl.attr("src", selMealObj.strMealThumb);

    instructionsEl.text(selMealObj.strInstructions);
    
    for (let i = 1; i <= 20; i++){
        const ingredient = selMealObj["strIngredient" + i];
        const measurement = selMealObj["strMeasure" + i];

        if(ingredient !== "" && ingredient !== null){
            var ingredientListItem = $("<li>");

            ingredientListItem.text(ingredient);
            ingredientEl.append(ingredientListItem);
            
            var measurementListItem = $("<li>");
            
            measurementListItem.text(measurement);
            measurementEl.append(measurementListItem);

            mealSelectionArray.push({"ingredient": ingredient, "quantity": measurement});
        }else{
            break;
        };
    };
    getNutrition(mealSelectionArray);
};