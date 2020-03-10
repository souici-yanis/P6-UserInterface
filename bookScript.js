function init(){
    var div = document.createElement("div");
    div.id ="userDisplay";
    div.innerHTML = '<button id="button">Ajouter un livre</button>';

    var buttonPlace = document.querySelector("#myBooks hr");
    var buttonParent = document.getElementById("myBooks");
    
    buttonParent.insertBefore(div, buttonPlace);           
    document.getElementById("button").addEventListener("click", addBook);
}

function addBook(){
    var userDisplay = document.getElementById("userDisplay");
    userDisplay.innerHTML = '<label for="name">Titre du livre</label>';
    userDisplay.innerHTML += '<input type="text" id="name" name="name" required>';
    userDisplay.innerHTML += '<label for="auteur">Auteur</label>';
    userDisplay.innerHTML += '<input type="text" id="auteur" name="auteur" required></br>';
    userDisplay.innerHTML += '<button id="search">Rechercher</button></br>';
    userDisplay.innerHTML += '<button id="cancel">Annuler</button>';
    userDisplay.classList.add("searchClass");
}

window.addEventListener('DOMContentLoaded', init);