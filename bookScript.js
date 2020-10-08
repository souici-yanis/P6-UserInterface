function init(){
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
    var content = document.getElementById('content');
    var divContent = document.createElement('div');
    divContent.id= "listBook";
    content.appendChild(divContent);
    getBook(); // TODO get books via map to create
    document.getElementById("button").addEventListener("click", addBook);
}

function addBook(){
    setTitle('Recherche');
    var userDisplay = document.getElementById("userDisplay");
    userDisplay.innerHTML = '<label for="name">Titre du livre</label>';
    userDisplay.innerHTML += '<input type="text" id="titleBook" name="name" required>';
    userDisplay.innerHTML += '<label for="auteur">Auteur</label>';
    userDisplay.innerHTML += '<input type="text" id="auteur" name="auteur" required></br>';
    userDisplay.innerHTML += '<button id="search">Rechercher</button></br>';
    userDisplay.innerHTML += '<button id="cancel">Annuler</button>';
    if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {     
        userDisplay.classList.add("searchClass");
    } else {
        userDisplay.classList.add("searchClassComputer");
    }
    document.getElementById("search").addEventListener("click", searchBook);
    document.getElementById("cancel").addEventListener("click", cancelSearch);
    document.getElementById("titleBook").addEventListener("keyup", checkFieldEmpty);
    document.getElementById("auteur").addEventListener("keyup", checkFieldEmpty);
}

function cancelSearch(){
    init();
    setTitle('Ma Poch\'List');
    clearListBook()
    getBook();
}

function checkFieldEmpty(ev){
    if(ev.target.validity.valueMissing){
        createErrorInput(ev.target.attributes[1].value, 'Merci de renseigner le champ.');
    } else {
        removeErrorInput(ev.target.attributes[1].value);
    }
}

function clearListBook() {
    var listBook = document.getElementById("listBook");
    if (listBook){
        listBook.innerHTML = '';
    }
}

function getBook() {
    var idBookMap = JSON.parse(sessionStorage.getItem('booksMap'));
    var idBook = sessionStorage.getItem('book');
    console.log('getBook : ', idBook);
    if(!idBook){
        return;
    }
    var bookNumber = idBook.split(',').length;
    for(var i=0; i<bookNumber; i++){
        var idBookItem = idBook.split(',')[i];
        var bookITEM = idBookMap[idBookItem];
        createItem(bookITEM, true);
    }
}

function setTitle(title) {
    var buttonPlace = document.querySelector("#content h2");
    buttonPlace.innerHTML = '<h2>' +title + '</h2>'
}

function createErrorInput(id, errorMessage){
    var idError = id + 'error';
    if(document.getElementById(idError)){
        return;
    } 
    var inputError = document.createElement("div");
    inputError.id = id + 'error';
    inputError.innerHTML = errorMessage;
    inputError.setAttribute("style", "color: red;");
    
    var div = document.getElementById(id);
    div.insertAdjacentElement('afterend', inputError);    
    div.classList.add("inputError");
}

function removeErrorInput(id){
    var idError = id + 'error';
    var messageError = document.getElementById(idError);
    var inputError = document.getElementById(id);
    
    inputError.classList.remove("inputError");
    if(messageError){
        messageError.remove();
    }
}

function searchBook(){
    var titleBook = document.getElementById("titleBook").value;
    var auteur = document.getElementById("auteur").value;
    if (titleBook == ''){
        createErrorInput('titleBook', 'Merci de renseigner le champ.');
        return;
    }
    if (auteur == ''){
        createErrorInput('auteur', 'Merci de renseigner le champ.');
        return;
    } 

    setTitle('Recherche');
    clearListBook();

    var xhr = new XMLHttpRequest();
    var request = 'https://www.googleapis.com/books/v1/volumes?q=' + titleBook + '+inauthor:'+ auteur;
    xhr.open('GET', request);
    xhr.send();

    xhr.addEventListener('readystatechange', function() { // On gère ici une requête asynchrone

        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) { // Si le fichier est chargé sans erreur
            var result = JSON.parse(xhr.responseText);
            if(result.totalItems){
                setTitle('Résultat de la recherche');
                for (var i=0; i<result.items.length; i++){        
                    createItem(result.items[i], false);
                }
            } else { 
                setTitle('Aucun livre n\'a été trouvé.');
            }
        }
    });  
}
var maptest = new Map();

function createItem(book, isPochList) {
    if(book && maptest.get(book.id) == null){
        maptest.set(book.id, book);
    }

    var content = document.getElementById('listBook');
    var divContent = document.createElement('div');
    divContent.innerHTML += '<h3> Titre : ' + book.volumeInfo.title + '</h3>';
    if(isPochList){
        divContent.innerHTML += '<div data-bookid="' + book.id + '" id="' + book.id + '" class="oneBookMark delete"></div>';
    } else {
        divContent.innerHTML += '<div data-bookid="' + book.id + '" id="' + book.id + '" class="oneBookMark bookMark"></div>';
    }

    divContent.innerHTML += '<p style="font-style: italic;"> Id : ' + book.id + '</p>';
    divContent.innerHTML += '<p> Auteur : <strong>' + book.volumeInfo.authors[0] + '</strong></p>';
    if(book.volumeInfo.description){
        divContent.innerHTML += '<p> Description : ' + book.volumeInfo.description.substring(0,200) + '...</p>';
    } else {
        divContent.innerHTML += '<p> Description : Information manquante</p>';
    }

    if(book.volumeInfo.imageLinks){
        if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {     
            divContent.innerHTML += '<div class="imageBook"><img style="width:75px;" src="' + book.volumeInfo.imageLinks.smallThumbnail + '"></div>';
        } else {
            divContent.innerHTML += '<div class="imageBook"><img style="width:100px;" src="' + book.volumeInfo.imageLinks.smallThumbnail + '"></div>';
        }
    } else {
        divContent.innerHTML += '<img src="unavailable.png" style="width:150px; display: block; margin-left: auto; margin-right: auto">';
    }
    divContent.classList.add("bookCard");
    content.appendChild(divContent);
    
    if(isPochList){
        document.getElementById(book.id).addEventListener("click", deleteBook);
    } else {
        document.getElementById(book.id).addEventListener("click", saveBook);
    }
}

var bookSavedMap = new Map();
function saveBook(ev){
    var clickedBookId = ev.target.dataset.bookid;
    var clickedBook = maptest.get(clickedBookId);
    var choosenBookId = [];
    if(!sessionStorage.getItem('book')){
        bookSavedMap[clickedBookId] = clickedBook;
        sessionStorage.setItem('booksMap', JSON.stringify(bookSavedMap));
        choosenBookId.push(clickedBookId);
        sessionStorage.setItem('book', choosenBookId);
        var divBook = document.getElementById(clickedBookId);
        divBook.classList.add("bookClicked");
    } else {
        var books = sessionStorage.getItem('book');
        var booksMap = sessionStorage.getItem('booksMap');
        if(books.includes(clickedBookId)){
            alert('Vous ne pouvez ajouter deux fois le même livre.');
        } else {
            var divBook = document.getElementById(clickedBookId);
            divBook.classList.remove("bookMark");
            divBook.classList.add("bookClicked");
            bookSavedMap = JSON.parse(booksMap);
            bookSavedMap[clickedBookId] = clickedBook;
            choosenBookId.push(books);
            choosenBookId.push(clickedBookId);
            sessionStorage.setItem('book', choosenBookId);
            sessionStorage.setItem('booksMap', JSON.stringify(bookSavedMap));
        }
    }
}

function mapToObj(map){
    const obj = {}
    for (let [k,v] of map)
    obj[k] = v
    return obj
}

function deleteBook(ev){
    var allBooks = sessionStorage.getItem('book').split(',');
    var clickedBookId = ev.target.dataset.bookid;
    var indexBook = allBooks.indexOf(clickedBookId);
    allBooks.splice(indexBook, 1);
    sessionStorage.setItem('book', allBooks);
    clearListBook();
    getBook();
}

window.addEventListener('DOMContentLoaded', init);