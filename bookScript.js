function init(){
    var userDisplay = document.getElementById("userDisplay");
    if(!userDisplay){
        var div = document.createElement("div");
        div.id ="userDisplay";
        div.innerHTML = '<button id="button">Ajouter un livre</button>';
    } else {
        userDisplay.innerHTML = '<button id="button">Ajouter un livre</button>';
        userDisplay.classList.remove("searchClass");
        userDisplay.id ="userDisplay";
    }
    
    var buttonPlace = document.querySelector("#myBooks hr");
    var buttonParent = document.getElementById("myBooks");
    
    buttonParent.insertBefore(div, buttonPlace);           
    document.getElementById("button").addEventListener("click", addBook);
}

function addBook(){
    var userDisplay = document.getElementById("userDisplay");
    userDisplay.innerHTML = '<label for="name">Titre du livre</label>';
    userDisplay.innerHTML += '<input type="text" id="titleBook" name="name" required>';
    userDisplay.innerHTML += '<label for="auteur">Auteur</label>';
    userDisplay.innerHTML += '<input type="text" id="auteur" name="auteur" required></br>';
    userDisplay.innerHTML += '<button id="search">Rechercher</button></br>';
    userDisplay.innerHTML += '<button id="cancel">Annuler</button>';
    userDisplay.classList.add("searchClass");
    document.getElementById("search").addEventListener("click", searchBook);
    document.getElementById("cancel").addEventListener("click", cancelSearch);

}

function cancelSearch(){
    init()
}

function searchBook(){
    var xhr = new XMLHttpRequest();
    var titleBook = document.getElementById("titleBook").value;
    var auteur = document.getElementById("auteur").value;
    var request = 'https://www.googleapis.com/books/v1/volumes?q=' + titleBook + '+inauthor:'+ auteur;
    xhr.open('GET', request);
    xhr.send();

    xhr.addEventListener('readystatechange', function() { // On gère ici une requête asynchrone

        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) { // Si le fichier est chargé sans erreur
            var result = JSON.parse(xhr.responseText);
            console.log(result);
            console.log('Livre 1 ' + result.items[0].volumeInfo.title + ' écrit par ' + result.items[0].volumeInfo.authors);
            console.log('Livre 2 ' + result.items[1].volumeInfo.title + ' écrit par ' + result.items[1].volumeInfo.authors);
        }
    });  
}

window.addEventListener('DOMContentLoaded', init);