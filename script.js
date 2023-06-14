const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');
const mealDetails = document.getElementById('mealDetails')

// This function will handle the input which is given by user it will display results if the input length is greater than zero
// clearResults will clear the results after we rollback
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
// This function will fetch results from API using themealdb with the help of json we can fetch the data from API with json and promises
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

// This function will display the results which was entered by the user. 
// It displays a card which contains image,title of meal and two buttons.
// Details button which will display all details of meals in new page
// Add to Favourite button will add this meal when clicked to a array fav which contians all the meal cards which are added by user
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

    // When clicked on details it will call fetchMealDetails functions with meal id meal.idMeal
    details.addEventListener('click',() =>{
      fetchMealDetails(meal.idMeal)
    });
    // This will add the meal card to the array fav[] along with details and delete button
    addToFav.addEventListener('click', () =>{
      addToFavourites(meal);
      displayFavourite();
    });
  });
}

// This function will fetch all the details of meals using API with json and promises
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

// This function after fetching details from the API will display them using displayMealDetails
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

  // This function will close the displayMealDetails function by clicking on 'X' button
  closeButton.addEventListener('click', ()=>{
    cardDetails.remove();
  })

  mealDetails.appendChild(cardDetails)


}

// This array will store all the meal cards when they are added
var fav = [];

// By using these code we will store fav array in local storage to make fav array persistent
if(localStorage.getItem('fav')){
  fav = JSON.parse(localStorage.getItem('fav'))
}

// addToFavourites function will push the meal cards when clicked on Add to Favourite button
// we will push card meal to local storage by converting it into string using stringify because it allows only string
function addToFavourites(meal){
  fav.push(meal);
  localStorage.setItem('fav',JSON.stringify(fav))
}

// This function will display all the meal cards in the array along with details and remove buttons
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
     // When clicked on details it will call fetchMealDetails functions with meal id meal.idMeal
    details.addEventListener('click',() =>{
      fetchMealDetails(meal.idMeal)
    });

    // This function will remove (splice) the meal cards from the array when clicked on remove button
    // we also remove it from local storage
     remove.addEventListener('click', ()=>{
      if(fav !== -1){
        fav.splice(fav.indexOf(meal),1)
        localStorage.setItem('fav',JSON.stringify(fav));
        favCard.remove();
      }
     });
  });
}


// This is the toggle function which will switch between dark and light when clicking on toggle button
const toggle = document.getElementById('toggle');
const modeName = document.getElementById('mode-name');

// This will call a class called dark and will change some css properties which are used to change colors when clicking on toggle button
toggle.addEventListener('change',function(){
  document.body.classList.toggle("dark")

  if(this.checked){
    modeName.textContent = 'Dark'
  }else{
    modeName.textContent = 'Light'
  }
});


// This function will clear all results when we roll back
function clearResults() {
  searchResults.innerHTML = '';
}
