let Library = [];

class Book {
  constructor(title, name, pages, readStatus) {
    Object.assign(this, { title, name, pages, readStatus });
    this.bookId = Math.random()
      .toString(36)
      .substr(2, 9);
  }
}

// Function for set data on localstorage

function storeData(libraryData, obj = {}) {
  libraryData.push(obj);
  localStorage.setItem("myLibrary", JSON.stringify(libraryData));
}

// Extract data from localStorage
function extractStorage(dataKey) {
  return JSON.parse(localStorage.getItem(dataKey));
}

// Function for addBooks

function addBook(...args) {
  let book = new Book(...args);
  storeData(Library, book);
  console.log(extractStorage("myLibrary"));
}
