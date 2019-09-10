let Library = [];

class Book {
	constructor(title, author, pages, readStatus) {
		this.title = title;
		this.author = author;
		this.pages = pages;
		this.readStatus = readStatus;
		this.bookId = Math.random()
			.toString(36)
			.substr(2, 9);
	}
}

// ************** All helpers Functions *****************************

// Function for set data on localstorage

function storeData() {
	localStorage.setItem('myLibrary', JSON.stringify(Library));
}

// Extract data from localStorage
function extractData() {
	const booksData = JSON.parse(localStorage.getItem('myLibrary'));
	return booksData || [];
}
// Function for update local book storage data
function bookInfoUpdate(id, value) {
	Library.find(x => x.bookId === id).readStatus = value;
	storeData();
}

// Function for getting object id
function bookIndexOf(id) {
	return Library.findIndex(i => i.bookId === id);
}
// ************** End *****************************

// Function for addBooks

function addBook(args) {
	const book = new Book(...args);
	Library.push(book);
	storeData();
	return book;
}

// Collect all book data from form
function bookInfoFromForm() {
	const title = document.querySelector('#title').value;
	const author = document.querySelector('#author').value;
	const pages = document.querySelector('#pages').value;
	const readStatus = document.querySelector('#bookReadStatus').value;
	return [title, author, pages, readStatus];
}

// template generator for render function
function template({ bookId, title, author, pages, readStatus }) {
	return `<tr>
              <th scope="row">${bookId.toUpperCase()}</th>
              <td>${title}</td>
              <td>${author}</td>
              <td>${pages}</td>
              <td id="readStatus-${bookId}">${readStatus}</td>
              <td>
                <button id="status-${bookId}" type="button" class="btn btn-sm btn-warning statusBtn"><i class="fas fa-dice"></i> Change status</button>
                <button id="delete-${bookId}" type="button" class="btn btn-sm btn-danger delBtn"><i class="fas fa-trash-alt"></i></button>
              </td>
            </tr>`;
}

// UI render function. Basically generates cells with data
function renderBook(book) {
	const contentBody = document.querySelector('#bookData');
	if (book) {
		contentBody.insertAdjacentHTML('beforeend', template(book));
	}
}
// Function for delete book

function deleteBook(id) {
	Library.splice(id, 1);
	storeData();
}

// Function for toogle status

function statusChange(id) {
	const [notStarted, finished, reading] = [
		'Not Started',
		'Finished',
		'Reading',
	];
	const bookId = id.split('-')[1];
	const curStatus = document.querySelector(`#readStatus-${bookId}`);
	if (curStatus.innerText === notStarted) {
		curStatus.innerText = finished;
		bookInfoUpdate(bookId, finished);
	} else if (curStatus.innerText === finished) {
		curStatus.innerText = reading;
		bookInfoUpdate(bookId, reading);
	} else {
		curStatus.innerText = notStarted;
		bookInfoUpdate(bookId, notStarted);
	}
}

function initRender() {
	Library = extractData();
	if (Library.length >= 1) {
		Library.forEach(data => {
			renderBook(data);
		});
	}
}

function initial() {
	initRender();
	document.querySelector('#bookInfoSubmit').addEventListener('click', () => {
		const book = addBook(bookInfoFromForm());
		renderBook(book);
	});
}

initial();
