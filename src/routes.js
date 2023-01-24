const { addBooksHandler, getAllBooksHandler, getABookHandler, editABookHandler, deleteABookHandler } = require('./handler')

const routes = [
  {
    method: 'POST',
    path: '/books',
    handler: addBooksHandler
  },

  {
    method: 'GET',
    path: '/books',
    handler: getAllBooksHandler
  },

  {
    method: 'GET',
    path: '/books/{bookId}',
    handler: getABookHandler
  },

  {
    method: 'PUT',
    path: '/books/{bookId}',
    handler: editABookHandler
  },

  {
    method: 'DELETE',
    path: '/books/{bookId}',
    handler: deleteABookHandler
  }
]

module.exports = routes
