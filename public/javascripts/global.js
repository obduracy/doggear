

// booklist data array for info box


$(document).ready(function(){

	// populate the book table
	populateTable();

	// get total number of pages read/books read
	totalPagesRead();

	// get all the pretty book covers and info
	bookCovers();


	// book link click
	$("#bookList table tbody").on("click", "td a.linkshowbook", showBookInfo);

	// add book button click
	$("#btnAddBook").on("click", addBook);

	// delete book link click
	$("#bookList table tbody").on("click", "td a.linkdeletebook", deleteBook);
})

// get book covers for the library

function bookCovers() {
	var myBooks = [];
	var username = $(".username").text();
	var libraryContent = '';

		// jquery ajax call for json
	$.getJSON('/books/booklist', function(data){
		// restrict rendered books to the logged in user's books
			for(var i = 0; i < data.length; i++) {
				if (data[i].user === username){
					libraryContent += '<div class="bookcover-list"><img src="' + data[i].picture + '" title="' + data[i].description + '" class="bookcovers"><br><h2>' + data[i].title + ' : ' + data[i].author + '</h2></td><hr>';

			}
			$('#bookCovers').html(libraryContent);
		}
	})
	

}


// gets statistics for the profile

function totalPagesRead() {
	var myBooks = [];
	var username = $(".username").text();
	var totalPages = 0;

	// jquery ajax call for json
	$.getJSON('/books/booklist', function(data){
		// restrict rendered books to the logged in user's books
			for(var i = 0; i < data.length; i++) {
				if (data[i].user === username){
					myBooks.push(data[i].page);
			}
		}
		$("#booknumber").text(myBooks.length);
		$.map(myBooks, function(e){
			e = parseInt(e);
			totalPages += e;
		})
		$("#pagesnumber").text(totalPages);
	});

}

// fill table with data
function populateTable(){

	// content string
	var tableContent = '';
	var username = $(".username").text();

	// jquery ajax call for json
	$.getJSON('/books/booklist', function(data){
		// restrict rendered books to the logged in user's books
			for(var i = 0; i < data.length; i++) {
				if (data[i].user === username){
					tableContent += '<tr><td><a href="#" class="linkshowbook" rel="' + data[i].title + '">' + data[i].title + '</a></td><td>' + data[i].page + '</td><td><a href="#" class="linkdeletebook" rel="' + data[i]._id + '">delete</a></td></tr>';

			}
			$('#bookList table tbody').html(tableContent);
		}
	})
	
}


// show book info

function showBookInfo(event){

	event.preventDefault();

	// get book list data from json
	var bookListData = [];
	var username = $(".username").text();

	// retrieve book title from link rel attribute
	var thisBookTitle = $(this).attr("rel");

	// jquery ajax call for json
	$.getJSON('/books/booklist', function(data){
		// restrict rendered books to the logged in user's books
			for(var i = 0; i < data.length; i++) {
				if (data[i].title === thisBookTitle){
					bookListData.push(data[i]);
					console.log(bookListData)
			}
			
		}
		// get index of object based on id value
		var arrPosition = bookListData.map(function(arrayItem){ return arrayItem.title;}).indexOf(thisBookTitle);

		// get book object
		var thisBookObject = bookListData[arrPosition];

		// populate info box
		$("#bookInfoTitle").text(thisBookObject.title);
		$("#bookInfoAuthor").text(thisBookObject.author);
		$("#bookInfoGenre").text(thisBookObject.genre);
		$("#bookInfoDescription").text(thisBookObject.description);
	})
	

};

// Add Book
function addBook(event){
	event.preventDefault();

	// if the user doesn't have a picture of the book, it will default to this
	var pic = $("input#inputBookPicture").val();


	if (pic === '') {
		$("input#inputBookPicture").val("http://www.clker.com/cliparts/6/4/J/9/E/9/closed-book-hi.png");
	}

	// Super basic validaton - increase errorCount Variable if any fields are blank
	var errorCount = 0;
	$("#addBook input").each(function(index, val){
		if($(this).val() === "") { errorCount++; }
	});

	// if errorCount is at 0, proceed
	if(errorCount === 0){

		// compile info into object
		var newBook = {
			"title": $("#addBook fieldset input#inputBookTitle").val(),
			"page": $("#addBook fieldset input#inputBookPage").val(),
			"author": $("#addBook fieldset input#inputBookAuthor").val(),
			"genre": $("#addBook fieldset input#inputBookGenre").val(),
			"description": $("#addBook fieldset input#inputBookDescription").val(),
			"picture": $("#addBook fieldset input#inputBookPicture").val(),
			"user": $("#addBook fieldset input#inputBookUser").val()
		}

		// AJAx posts object to adduser route
		$.ajax({
			type: "POST",
			data: newBook,
			url: "/books/addbook",
			dataType: "JSON"
		}).done(function(res){

			// blank response = success
			if (res.msg === ""){

				// clear form input
				$("#addBook fieldset input").val("");

				// update table
				populateTable();

			}
			else {

				// throw error if something's wrong
				alert("Error: " + res.msg);

			}
		});
	}
	else {
		// if errorCount is more than 0, throw this error
		alert("Please fill in all fields");
		return false;
	}
};

// delete book
function deleteBook(event){
	event.preventDefault();
	var username = $(".username").text();
	var bookUser;

	// retrieve book id from link rel attribute
	var thisBookID = $(this).attr("rel");

	// jquery ajax call for json
	$.getJSON('/books/booklist', function(data){
		// restrict rendered books to the logged in user's books
			for(var i = 0; i < data.length; i++) {
				if (data[i]._id === thisBookID){
					bookUser = data[i].user;
			}
			
		}

		// this will make sure the person attempting to delete the book is the user who input the book in the first place

		if (bookUser === username) {
		// confirmation alert
		var confirmation = confirm("Are you sure you want to delete this book from your list?");

			// check and make sure the user confirmed
			if (confirmation === true){

				// if confirmed, delete
				$.ajax({
					type: "DELETE",
					url: "/books/deletebook/" + thisBookID,
				}).done(function(res){

					// check for successful response
					if (res.msg === ""){				
					} 
					else {
						alert("Error: " + res.msg);
					}

					// update table
					populateTable();

				});
			}
			else {
				// if unconfirmed, return false
				return false;
			}
		}
		else {
			alert("Hey now! Don't go pulling out people's bookmarks! That's not nice at all.");
	}

	})

};