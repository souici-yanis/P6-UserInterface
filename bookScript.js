function init(){
    debugger;
    var userDisplay = document.getElementById("userDisplay");
    if(!userDisplay){
        var div = document.createElement("div");
        div.id ="userDisplay";
        div.innerHTML = '<button id="button">Ajouter un livre</button>';

        var buttonPlace = document.querySelector("#myBooks hr");
        var buttonParent = document.getElementById("myBooks");
        
        buttonParent.insertBefore(div, buttonPlace); 
    } else {
        userDisplay.innerHTML = '<button id="button">Ajouter un livre</button>';
        userDisplay.id ="userDisplay";
        userDisplay.classList.remove("searchClass");
    }

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
    init();
    clearBooks();
}

function clearBooks(){
    var content = document.getElementById('content');
    content.innerHTML = '<h2>Ma poch\'liste</h2>';
}

function searchBook(){
    clearBooks();
    var xhr = new XMLHttpRequest();
    var titleBook = document.getElementById("titleBook").value;
    var auteur = document.getElementById("auteur").value;
    var request = 'https://www.googleapis.com/books/v1/volumes?q=' + titleBook + '+inauthor:'+ auteur;
    xhr.open('GET', request);
    xhr.send();

    xhr.addEventListener('readystatechange', function() { // On gère ici une requête asynchrone

        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) { // Si le fichier est chargé sans erreur
            var result = JSON.parse(xhr.responseText);
            var content = document.getElementById('content');
            var divContent = document.createElement('div');
            divContent.id= "listBook"
            content.appendChild(divContent);
            for (var i=0; i<result.items.length; i++){ 
                console.log(result.items[i]);        
                createItem(result.items[i]);
            }
        }
    });  
}

function createItem(book) {
    var content = document.getElementById('listBook');
    var divContent = document.createElement('div');
    divContent.innerHTML += '<h3> Titre : ' + book.volumeInfo.title + '</h3>';
    divContent.innerHTML += '<p> Id : ' + book.id + '</p>';
    divContent.innerHTML += '<p> Auteur : ' + book.volumeInfo.authors[0] + '</p>';
    divContent.innerHTML += '<p> Description : ' + book.volumeInfo.description.substring(0,200) + '...</p>';
    if(book.volumeInfo.imageLinks.smallThumbnail){
        divContent.innerHTML += '<div class="imageBook"><img src="' + book.volumeInfo.imageLinks.smallThumbnail + '"></div>';
    } else {
        //divContent.innerHTML += '<img src="unavailable.png">';
    }
    divContent.classList.add("bookCard");
    content.appendChild(divContent);
}

window.addEventListener('DOMContentLoaded', init);