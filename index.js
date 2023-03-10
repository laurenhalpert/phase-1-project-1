//Variables
let wizardArray = [];
let ratingValue;
const randomPatronus = ["lion", "wolf", "eagle", "duck", "bear", "turtle", "kangaroo", "penguin", "dolphin", "shark"];
let count = 0;



//Event Listeners
document.addEventListener("DOMContentLoaded", () => getWizards())

document.querySelector("#create-wizard").addEventListener("submit", handleSubmit);

document.querySelector("#sorter").addEventListener("change", event=> sortWizards(event, wizardArray));

document.querySelector("#filter").addEventListener("change", event =>filterBy(event))




//Event Call Back Functions
function handleSubmit(event) {
    event.preventDefault();
    document.querySelector("#wizard-pics-here").innerHTML = "";
    
    let wizardObj={};
    //if no house is selected
    if (document.querySelector("#house").value=== "") {
        let random = Math.floor(Math.random()*4)
        wizardObj.house = document.querySelectorAll(".house-option")[random].value;
    }
    //if a house is selected
    else {
        wizardObj.house =event.target[2].value;
    }

    //if no patronus given
    if (document.querySelector("#patronus").value === "") {
        let random = Math.floor(Math.random()*10)
        wizardObj.patronus = randomPatronus[random];
    }
    //if patronus given
    else {
        wizardObj.patronus = event.target[3].value;
    }
    
    wizardObj.id = count.toString();
    count ++;
    wizardObj.name = event.target[0].value;
    wizardObj.gender = event.target[1].value;
    
    wizardObj.image= event.target[4].value;
    wizardArray.push(wizardObj);
    wizardArray.forEach(wizard => renderWizard(wizard))
   

    event.target.reset();
}

function editRatingComment(){
    document.querySelector("#container-for-edit-form").style.visibility = "visible";
}

function addFriend(wizard) {
    const myFriendPic = document.createElement("img");
    
    myFriendPic.id = `${wizard.id}`
    myFriendPic.className = "wizard-thumbnail";
    myFriendPic.src= wizard.image;

    myFriendPic.addEventListener("click", () => {
        showWizardProfile(wizard);
        document.querySelector("#del-btn").style.visibility="visible";
    });
    
    document.querySelector("#my-friends-here").appendChild(myFriendPic);
  
    document.querySelector("#del-btn").style.visibility="visible";
}

function removeFriend(event, wizard) {
    
    console.log(document.querySelectorAll(".wizard-thumbnail"))
    document.querySelectorAll(".wizard-thumbnail").forEach(elem => {
        
        if (elem.id === wizard.id) {
            elem.remove();
        }
    })
    
}

function updateRatingComment(event, wizard) {
    event.preventDefault();
    let likeObj={};
    likeObj.id = wizard.id;
    likeObj.forName = wizard.name;

    function isNotEmptyComment() {
        if(event.target[5].value !== "") {
            document.querySelector("#comments").innerText = `Comment: ${event.target[5].value}`;
            likeObj.comment = event.target[5].value;
        }
    }
    
    if (document.querySelector("#rating").innerText.substring(8) === "undefined" && document.querySelector("#comments").innerText.substring(9) === "undefined"){
        getRadioRatings();
        likeObj.rating =ratingValue;
        
        isNotEmptyComment();
        postRatingComment(likeObj);
    }
    else {
        getRadioRatings();
        likeObj.rating =ratingValue;
        isNotEmptyComment();
        patchRatingComment(likeObj)
    } 
    event.target.reset();
}

function sortWizards(event, arr) {
    let nameArray = [];
    arr.forEach(wizard => nameArray.push(wizard.name));
    let arrOfSortedNames = nameArray.sort();
    
    let arrOfSortedWizards =[];
    function sortHelper(sortCriteria) {
        if (sortCriteria === "name-a-z") {
            sortedArr = arrOfSortedNames;
        } else if (sortCriteria === "name-z-a") {
            let reverseAlphabetical = nameArray.sort().reverse();
            sortedArr = reverseAlphabetical
        }
        sortedArr.forEach(name => {
            arr.forEach(wizard => {
                if (wizard.name === name) {
                    arrOfSortedWizards.push(wizard);
                }
            })
        })
        
        document.querySelector("#wizard-pics-here").innerHTML = "";
        
        arrOfSortedWizards.forEach(wizard => renderWizard(wizard));
    }
    sortHelper(event.target.value)
    
}

function filterBy(event) {
    let filteredArr =[];
    let category = "";

    function filterHelper(filterCriteria) {
        wizardArray.forEach(wizard => {
            if (filterCriteria === "male" || filterCriteria === "female") {
                category = "gender";
                
            } else{
                category = "house";

            }
            if (wizard[category].toLowerCase() === filterCriteria) {
                filteredArr.push(wizard);
            }; 
        })
    }
    
    filterHelper(event.target.value)
    
    document.querySelector("#wizard-pics-here").innerHTML = "";
    filteredArr.map(wizard=>renderWizard(wizard))
   
    document.querySelector("#sorter").addEventListener("change", event=> sortWizards(event, filteredArr));
    
}




//Helper Functions
function renderWizard(wizard) {
    const wizardPicture = document.createElement("img");
    wizardPicture.src= wizard.image;
    wizardPicture.className="wizard-thumbnail";
    wizardPicture.addEventListener("click", () => showWizardProfile(wizard));
    document.querySelector("#wizard-pics-here").appendChild(wizardPicture);
}

function hasPatronus(wizard) {
    if(wizard.patronus !== "") {
        return wizard.patronus;
    } else {
        return "unknown";
    }
}

function getRadioRatings() {
    document.querySelectorAll(".radio").forEach(elem=>{
        if(elem.checked) {
            ratingValue= elem.value;
            document.querySelector("#rating").innerText= `Rating: ${ratingValue}`;
        }
    })
}

function showRatingComment(data, wizard) {
    if (wizard.name === data.forName) {
        document.querySelector("#rating").innerText = `Rating: ${data.rating}`;
        document.querySelector("#comments").innerText = `Comment: ${data.comment}`;
    } 
}

//Event Call Back Function && helper function
function showWizardProfile(wizard) {
    const profile = document.querySelector("#wizard-profile")
    profile.innerHTML=`
    <img src="${wizard.image}" class="profile-picture">
    <h2>${wizard.name}</h2>
    <p>${wizard.gender}</p>
    <p>House: ${wizard.house}<p>
    <p>Patronus: ${hasPatronus(wizard)}</p>
    <p id="rating"> Rating: <span id="num-rating">${getRatingsComments(wizard)}</span></p>
    <p id="comments"> Comment: ${getRatingsComments(wizard)}</p>
    <div id="container-for-edit-form">
        <form id="edit-form">
            <label>Rating: </label>
            <input class = "radio" type="radio" id="rating-input-1" name="rating-input" value="&#9734">
            <label for = "rating-input-1">&#9734</label>
            <input class = "radio" type="radio" id="rating-input-2" name="rating-input" value="&#9734 &#9734">
            <label for = "rating-input-2">&#9734 &#9734</label>
            <input class = "radio" type="radio" id="rating-input-3" name="rating-input" value="&#9734 &#9734 &#9734">
            <label for = "rating-input-3">&#9734 &#9734 &#9734</label>
            <input class = "radio" type="radio" id="rating-input-4" name="rating-input" value="&#9734 &#9734 &#9734 &#9734">
            <label for = "rating-input-4">&#9734 &#9734 &#9734 &#9734</label>
            <input class = "radio" type="radio" id="rating-input-5" name="rating-input" value="&#9734 &#9734 &#9734 &#9734 &#9734">
            <label for = "rating-input-5">&#9734 &#9734 &#9734 &#9734 &#9734</label>
            <br>
            <label for="comment-input">Comment: </label>
            <textarea id="comment-input" name="comment-input" placeholder="Comment"></textarea>
            <input type="submit" id="update-btn" value="Update">
        </form>
    </div>
    <button id="add-friend-btn">Add As Friend</button>
    <button id="edit-btn">Edit Rating/Comment</button>
    <button id="del-btn">Remove Friend</button>
    `
    profile.querySelector("#edit-btn").addEventListener("click", editRatingComment);
    profile.querySelector("#add-friend-btn").addEventListener("click", () =>addFriend(wizard));
    profile.querySelector("#edit-form").addEventListener("submit", (event)=> updateRatingComment(event, wizard));
    profile.querySelector("#del-btn").addEventListener("click", (event) =>removeFriend(event,wizard));
}



//fetch functions
function getWizards() {
    fetch("https://hp-api.onrender.com/api/characters")
    .then(resp => resp.json())
    .then(wizard => {
        for (let i =0; i<10; i++) {
            renderWizard(wizard[i]);
            showWizardProfile(wizard[0]);
            wizardArray.push(wizard[i]);
        }
    })
}

function patchRatingComment(likeObj){
    fetch(`http://localhost:3000/ratingsComments/${likeObj.id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(likeObj)
    })
    .then(resp => resp.json())
    .then(data => console.log(data))
}
function postRatingComment(likeObj) {
    fetch("http://localhost:3000/ratingsComments", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(likeObj)
    })
    .then(resp=>resp.json())
    .then(data => console.log(data))
}


function getRatingsComments(wizard){
    fetch("http://localhost:3000/ratingsComments/")
    .then(resp => resp.json())
    .then(data=>data.forEach(elem=> showRatingComment(elem, wizard)))
}

