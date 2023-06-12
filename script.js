const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');
const mealDetails = document.getElementById('mealDetails')

searchInput.addEventListener('input', handleInput);

function handleInput(){
  const inputValue = searchInput.value.trim();
  if(inputValue.length > 0){
    fetchResults(inputValue);
  }
  else{
    clearResults();
  }
}
// fetching results

function fetchResults(query){
  const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`;
  fetch(url)
    .then(response => response.json())
    .then(data => {
      const meals = data.meals
      displayResults(meals);
    })
    .catch(error =>{
      console.error('error fetching data',error);
    });
  }

// 
function displayResults(meals){
  clearResults()

  meals.forEach(meal =>{

    const card = document.createElement('div')
    card.classList.add('card');

    const image = document.createElement('img')
    image.src = meal.strMealThumb;
    image.alt = meal.strMeal;
    card.appendChild(image);

    const title = document.createElement('h3')
    title.textContent = meal.strMeal;
    card.appendChild(title);

    const details = document.createElement('button')
    details.textContent = 'Details';
    card.appendChild(details)

    const addToFav = document.createElement('button')
    addToFav.textContent = 'Add to Favourite';
    card.appendChild(addToFav);

    searchResults.appendChild(card);

    details.addEventListener('click',() =>{
      fetchMealDetails(meal.idMeal)
    });

    addToFav.addEventListener('click', () =>{
      addToFavourites(meal);
      displayFavourite();
    });
  });
}


function fetchMealDetails(mealId){
  const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`;
  mealDetails.innerHTML = '';
  fetch(url)
  .then(response => response.json())
  .then(data => {
    const meal = data.meals[0];
    displayMealDetails(meal)
  })
  .catch(error =>{
    console.error('error in fetchind Details', error);
  });
}

function displayMealDetails(meal){
  const cardDetails = document.createElement('div')
  cardDetails.classList.add('cardDetails')

  const image = document.createElement('img');
  image.src = meal.strMealThumb;
  image.alt = meal.strMeal;
  cardDetails.appendChild(image)

  const closeButton = document.createElement('button');
  closeButton.textContent = 'X';
  cardDetails.appendChild(closeButton)

  const title = document.createElement('h3');
  title.textContent = meal.strMeal;
  cardDetails.appendChild(title)

  const category = document.createElement('p')
  category.textContent = `category: ${meal.strCategory}`
  cardDetails.appendChild(category);

  const instructions = document.createElement('p')
  instructions.textContent = `instructions: ${meal.strInstructions}`;
  cardDetails.appendChild(instructions)

  closeButton.addEventListener('click', ()=>{
    cardDetails.remove();
  })

  mealDetails.appendChild(cardDetails)


}

var fav = [];

function addToFavourites(meal){
  fav.push(meal);
}

function displayFavourite(){
  const favContainer = document.getElementById('fav-container');
  favContainer.innerHTML= '';

  fav.forEach(meal =>{

    const favCard = document.createElement('div')
    favCard.classList.add('fav-card');

    const image = document.createElement('img');
    image.src = meal.strMealThumb;
    image.alt = meal.strMeal;
    favCard.appendChild(image);

    const title = document.createElement('h3');
    title.textContent = meal.strMeal;
    title.classList.add('card-title')
    favCard.appendChild(title)

    const details = document.createElement('button')
    details.textContent = 'Details';
    details.classList.add('favdetails')
    favCard.appendChild(details)

    const remove = document.createElement('button')
    remove.textContent = 'Remove';
    remove.classList.add('favremove')
    favCard.appendChild(remove)


    favContainer.appendChild(favCard)

    details.addEventListener('click',() =>{
      fetchMealDetails(meal.idMeal)
    });
     remove.addEventListener('click', ()=>{
      fav.splice(fav.indexOf(meal),1)
      favCard.remove();
     })
  })


}

const toggle = document.getElementById('toggle');
const modeName = document.getElementById('mode-name');

toggle.addEventListener('change',function(){
  document.body.classList.toggle("dark")

  if(this.checked){
    modeName.textContent = 'Dark'
  }else{
    modeName.textContent = 'Light'
  }
});



function clearResults() {
  searchResults.innerHTML = '';
}
