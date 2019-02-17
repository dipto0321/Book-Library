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

function storeData(Library) {
  localStorage.setItem("myLibrary", JSON.stringify(Library));
}

// Extract data from localStorage
function extractData() {
  let booksData = JSON.parse(localStorage.getItem("myLibrary"));
  return booksData ? booksData : [];
}
// Function for update local book storage data
function bookInfoUpdate(id, value) {
  Library.find(x => x.bookId === id).readStatus = value;
  storeData(Library);
}

// Function for getting object id
function bookIndexOf(id) {
  return Library.findIndex(i => i.bookId === id);
}
// ************** End *****************************

// Function for addBooks

function addBook(args) {
  let book = new Book(...args);
  Library.push(book);
  storeData(Library);
}

// Collect all book data from form
function bookInfoFromForm() {
  let title = document.querySelector("#title").value;
  let author = document.querySelector("#author").value;
  let pages = document.querySelector("#pages").value;
  let readStatus = document.querySelector("#bookReadStatus").value;
  console.log(title, author, pages, readStatus);
  return [title, author, pages, readStatus];
}

// Function for delete book

function deleteBook(id) {
  Library.splice(id, 1);
  storeData(Library);
  render();
}
// UI render function. Basically generates cells with data
function render() {
  let datas = extractData();
  let contentBody = document.querySelector("#bookData");
  let html = "";
  if (datas) {
    for (const data of datas) {
      html += template(
        data.bookId,
        data.title,
        data.author,
        data.pages,
        data.readStatus
      );
    }
    contentBody.innerHTML = html;
  } else {
    console.log("No data found!");
  }
}

// template generator for render function
function template(id, title, author, pages, readstatus) {
  return `<tr>
              <th scope="row">${id.toUpperCase()}</th>
              <td>${title}</td>
              <td>${author}</td>
              <td>${pages}</td>
              <td id="readStatus-${id}">${readstatus}</td>
              <td>
                <button id="status-${id}" type="button" class="btn btn-sm btn-warning statusBtn"><i class="fas fa-dice"></i> Change status</button>
                <button id="delete-${id}" type="button" class="btn btn-sm btn-danger delBtn"><i class="fas fa-trash-alt"></i></button>
              </td>
            </tr>`;
}

// Function for toogle status

function statusChange(id) {
  let status = ["Not Started", "Finished", "Reading"];
  let bookId = id.split("-")[1];
  let curStatus = document.querySelector(`#readStatus-${bookId}`);
  if (curStatus.innerText === status[0]) {
    curStatus.innerText = status[1];
    bookInfoUpdate(bookId, status[1]);
  } else if (curStatus.innerText === status[1]) {
    curStatus.innerText = status[2];
    bookInfoUpdate(bookId, status[2]);
  } else {
    curStatus.innerText = status[0];
    bookInfoUpdate(bookId, status[0]);
  }
}

// Add events for all new generates button status and delete
function statusEventListner() {
  let allStatusBtn = Array.from(document.querySelectorAll(".statusBtn"));
  allStatusBtn.forEach(element => {
    element.addEventListener("click", () => statusChange(element.id));
  });
}

function deleteBtnEventListner() {
  let allDeleteBtn = Array.from(document.querySelectorAll(".delBtn"));
  allDeleteBtn.forEach(element => {
    element.addEventListener("click", () =>
      deleteBook(bookIndexOf(element.id.split("-")[1]))
    );
  });
}

// IIFE
{
  Library = extractData();
  document
    .querySelector("#add")
    .addEventListener("click", () => addBook(bookInfoFromForm()));
  render();
  statusEventListner();
  deleteBtnEventListner();
}
