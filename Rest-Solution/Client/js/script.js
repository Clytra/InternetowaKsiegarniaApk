$(function f() {
    const URL = 'http://localhost:59449/api/books';
    const booksTableBodyElement = $('#books-table-body');
    const bookFormElement = $('#book-form');
    const inputAuthorElement = $('#book-author-input');
    const inputTitleElement = $('#book-title-input');
    const buttonAddNew = $('#new-book-button');
    const buttonEdit = $('#confirm-edit-button');
    const buttonCancel = $('#cancel-edit-button');

    function createBookRow(book) {
        return $(`<tr data-id="${book.ID}">
                    <td>${book.Title}</td>
                    <td>${book.Author}</td>
                    <td>
                        <div class="button-group">
                            <button class="btn btn-primary btn-sm">Edytuj</button>
                            <button class="btn btn-danger btn-sm">Usuń</button>
                            <button class="btn btn-info btn-sm">Wypożycz</button>
                        </div>
                    </td>
                </tr>`);
      }
    
      function standardErrorHandler(xhr, err, status) {
        console.error(xhr, err, status);
        alert(`We have serious problem: ${status}`);
      }
    
      // http://cee40efe.ngrok.io/api/books
    
      function loadBooksToTable() {
        $.getJSON(URL).done((books) => {
    
          books.forEach(book => {
            booksTableBodyElement.append(createBookRow(book));
          })
    
        }).fail(standardErrorHandler)
      }
    
    
      // add listener to delete button
      // get id from row
      // send DELETE request with id
      // if success remove row
    
      function getRowFromButton(button) {
        return $(button).closest('[data-id]')
      }
    
      function activateDeleteButtons() {
        booksTableBodyElement.on('click', 'button.btn-danger',
          function () {
            const row = getRowFromButton(this);
            const id = row.data('id');
            $.ajax(URL + '/' + id, {
              type: 'DELETE'
            }).done(() => {
              row.remove();
            }).fail(standardErrorHandler)
          });
      }
    
      function getDataFromForm() {
        return {
          Author: inputAuthorElement.val(),
          Title: inputTitleElement.val()
        };
      }
    
      function dataUrlString(book) {
        return '?author='
          + encodeURIComponent(book.Author)
          + '&title='
          + encodeURIComponent(book.Title);
      }
    
      function activatePostForm() {
        buttonAddNew.on('click', function () {
          const bookData = getDataFromForm(); // without ID
          $.post(URL + dataUrlString(bookData)).done((bookId) => {
            console.log(bookId);
    
            bookData.ID = bookId;
    
            booksTableBodyElement.append(createBookRow(bookData));
    
          }).fail(standardErrorHandler);
          return false;
        })
      }
    
      function clearForm() {
        bookFormElement.removeData('id');
        inputAuthorElement.val('');
        inputTitleElement.val('');
    
        buttonAddNew.removeClass('d-none');
        buttonEdit.addClass('d-none');
        buttonCancel.addClass('d-none');
    
        return false;
      }
    
      function setEditModeFor(book) {
        bookFormElement.data('id', book.ID); // bookFormElement[0].dataset.id = book.ID;
        inputAuthorElement.val(book.Author);
        inputTitleElement.val(book.Title);
    
        buttonAddNew.addClass('d-none');
        buttonEdit.removeClass('d-none');
        buttonCancel.removeClass('d-none');
      }
    
      function getBookObjectFromRow(row) {
        return {
          ID: row.data('id'),
          Title: row.children('td').eq(0).text(),
          Author: row.children('td').eq(1).text(),
        }
      }
    
      function activateEditButtons() {
        booksTableBodyElement.on('click', 'button.btn-primary',
          function () {
          const row = getRowFromButton(this);
            const book = getBookObjectFromRow(row);
            setEditModeFor(book);
          });
    
        buttonCancel.on('click', clearForm);
      }

      function activatePutForm() {
        buttonEdit.on('click', function () {
          const bookData = getDataFromForm(); // without ID
          const bookId = bookFormElement.data('id');
          $.ajax(URL + '/' + bookId + dataUrlString(bookData),
          {
            type: "PUT"
          })
          .done(() => {
            const existingRow = $(tbody > td['data-id'=$(bookId)]);
            existingRow.replaceWith(createBookRow({
                Id: bookId,
                ...bookData
            }));
        }).fail(standardErrorHandler);
        return false;
      })
    }

    function setCommunicate (text, status) {
        
    }
    
      loadBooksToTable();
      activateDeleteButtons();
      activateEditButtons();
      activatePostForm();
      activatePutForm();
});