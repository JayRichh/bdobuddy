$(document).ready(function () {
  const beerRecipe = {
    product: {
      id: 0,
      name: "Beer",
      grade: 1,
      icon: "beer_icon",
      level: "Beginner",
      xp: 400,
      effects: [{ effect: "Stamina Recovery", amplifier: 2, percent: false }]
    },
    lifeSkill: "COOKING",
    level: "Beginner",
    xp: 400,
    ingredients: [
      {
        item: [
          { id: 1, name: "Corn or Potato", count: 5, weight: 0.1 },
          { id: 2, name: "Mineral Water", count: 6, weight: 0.01 },
          { id: 3, name: "Sugar", count: 1, weight: 0.01 },
          { id: 4, name: "Leavening Agent", count: 2, weight: 0.01 }
        ]
      }
    ]
  };

  const jsonUrl =
    "https://raw.githubusercontent.com/Flockenberger/LifeBDO/master/resource/json/recipes/recipesCooking.json";
  let recipes = [beerRecipe];

  function fetchRecipes() {
    fetch(jsonUrl)
      .then((response) => response.json())
      .then((data) => {
        recipes = [beerRecipe, ...data.recipes];
        displayRecipeList();
      })
      .catch((error) => console.error("Error fetching recipes:", error));
  }

  function displayRecipeList() {
    const recipeTree = $("#recipeTree");
    recipeTree.empty();
    let recipeListHTML = "";

    recipes.forEach((recipe, index) => {
      recipeListHTML += `<div class="recipe-item" data-id="${index}">${recipe.product.name}</div>`;
    });

    recipeTree.append(recipeListHTML);

    clickFirstRecipe();
  }

  $(document).on("click", ".recipe-item", function () {
    const id = $(this).data("id");
    const recipe = recipes[id];
    displayRecipeDetails(recipe);
    $(".recipe-item").removeClass("selected");
    $(this).addClass("selected");
  });

  function displayRecipeDetails(recipe) {
    const recipeDetails = $("#recipeDetails");
    recipeDetails.empty();

    if (recipe) {
      const { product, level, xp, ingredients } = recipe;

      let detailsHTML = `<div class="recipe-details-section"> <div class="recipe-header">${product.name}</div> <div>Life Skill Level: ${level}</div> <div>XP: ${xp}</div> <div>Ingredients:</div> <ul>`;
      ingredients.forEach((ingredientGroup) => {
        ingredientGroup.item.forEach((ingredient) => {
          detailsHTML += `<li>${ingredient.count} x ${ingredient.name}</li>`;
        });
      });

      detailsHTML += `</ul></div>`;

      recipeDetails.append(detailsHTML);
    }
  }

  function clickFirstRecipe() {
    $('.recipe-item[data-id="0"]').click();
  }

  $("#submit").click(function () {
    const numberPotato = parseInt($("#numberPotato").val(), 10);
    const numberWeight = parseFloat($("#numberWeight").val());

    if (isNaN(numberPotato) && isNaN(numberWeight)) {
      alert("Please enter a valid number.");
      return;
    }

    if (!isNaN(numberPotato) && !isNaN(numberWeight)) {
      alert("Please use only one input at a time.");
      return;
    }

    if (numberPotato && numberPotato > 0) {
      calculateAndDisplayBeer(parseInt(numberPotato, 10), true);
    } else if (numberWeight && numberWeight > 0) {
      calculateAndDisplayBeer(parseFloat(numberWeight), false);
    } else {
      alert("Please enter a positive amount of potatoes or a weight limit.");
    }
  });

  function calculateAndDisplayBeer(ingredientCount, isPotato) {
    if (isPotato && ingredientCount % 5 !== 0) {
      alert("Cooking beer requires batches of 5 potatoes.");
      return;
    }

    const batches = isPotato
      ? ingredientCount / 5
      : calculateBatchesFromWeight(ingredientCount);
    const greenBeer = getRandomInt(1, 4) * batches;
    const blueBeer = getRandomInt(1, 2) * batches;

    const ingredients = {
      beer: batches * 5,
      water: batches * 6,
      sugar: batches,
      leaveningAgent: batches * 2
    };

    const totalWeight = batches * (5 * 0.1 + 6 * 0.01 + 1 * 0.01 + 2 * 0.01);

    renderResultsTable(
      ingredients,
      greenBeer,
      blueBeer,
      totalWeight.toFixed(2)
    );
  }

  function renderResultsTable(ingredients, greenBeer, blueBeer, totalWeight) {
    const resultTable = $("#resultTable");
    resultTable.empty();

    resultTable.append(`
      <tr>
        <td>Corn or Potato</td>
        <td>${ingredients.beer}</td>
        <td rowspan="4">${greenBeer}</td>
        <td rowspan="4">${blueBeer}</td>
        <td rowspan="4">${totalWeight} LT</td>
      </tr>
      <tr><td>Mineral Water</td><td>${ingredients.water}</td></tr>
      <tr><td>Sugar</td><td>${ingredients.sugar}</td></tr>
      <tr><td>Leavening Agent</td><td>${ingredients.leaveningAgent}</td></tr>
    `);
  }

  $("#clearPotato, #clearWeight").click(function () {
    $("#numberPotato, #numberWeight").val("");
    resetResultsTable();
  });

  function resetResultsTable() {
    const resultTable = $("#resultTable");
    resultTable.html(`
      <tr>
        <td>Corn or Potato</td>
        <td>0</td>
        <td rowspan="4">0</td>
        <td rowspan="4">0</td>
        <td rowspan="4">0 LT</td>
      </tr>
      <tr><td>Mineral Water</td><td>0</td></tr>
      <tr><td>Sugar</td><td>0</td></tr>
      <tr><td>Leavening Agent</td><td>0</td></tr>
    `);
  }

  function clearTable() {
    $("#resultTable").empty();
  }

  function calculateBatchesFromWeight(weightLimit) {
    const weightPerBatch = 5 * 0.1 + 6 * 0.01 + 1 * 0.01 + 2 * 0.01;
    return Math.floor(weightLimit / weightPerBatch);
  }

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  resetResultsTable();
  fetchRecipes();
});
