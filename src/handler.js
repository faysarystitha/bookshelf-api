const { nanoid } = require('nanoid')
const books = require('./books')

const addBooksHandler = (request, h) => {
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload

  const id = nanoid(16)
  const finished = pageCount === readPage
  const insertedAt = new Date().toISOString()
  const updatedAt = insertedAt

  const newBook = {
    id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt
  }

  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku'
    }).code(400)
    return response
  } else if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
    }).code(400)
    return response
  }

  books.push(newBook)
  const isSucccess = books.filter((book) => book.id === id).length > 0

  if (isSucccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id
      }
    }).code(201)
    return response
  }

  const response = h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan'
  }).code(500)
  return response
}

const nextStep = (listBooks, reading, finished) => {
  let newArray = []
  if (reading === '0') {
    if (finished === '0') {
      const newBooks = listBooks.filter((book) => book.reading === false && book.finished === false)
      newArray = newBooks.map((item) => {
        const obj = {
          id: item.id,
          name: item.name,
          publisher: item.publisher
        }
        return obj
      })
      return newArray
    } else if (finished === '1') {
      const newBooks = listBooks.filter((book) => book.reading === false && book.finished === true)
      newArray = newBooks.map((item) => {
        const obj = {
          id: item.id,
          name: item.name,
          publisher: item.publisher
        }
        return obj
      })
      return newArray
    } else {
      const newBooks = listBooks.filter((book) => book.reading === false)
      newArray = newBooks.map((item) => {
        const obj = {
          id: item.id,
          name: item.name,
          publisher: item.publisher
        }
        return obj
      })
      return newArray
    }
  } else if (reading === '1') {
    if (finished === '0') {
      const newBooks = listBooks.filter((book) => book.reading === true && book.finished === false)
      newArray = newBooks.map((item) => {
        const obj = {
          id: item.id,
          name: item.name,
          publisher: item.publisher
        }
        return obj
      })
      return newArray
    } else if (finished === '1') {
      const newBooks = listBooks.filter((book) => book.reading === true && book.finished === true)
      newArray = newBooks.map((item) => {
        const obj = {
          id: item.id,
          name: item.name,
          publisher: item.publisher
        }
        return obj
      })
      return newArray
    } else {
      const newBooks = listBooks.filter((book) => book.reading === true)
      newArray = newBooks.map((item) => {
        const obj = {
          id: item.id,
          name: item.name,
          publisher: item.publisher
        }
        return obj
      })
      return newArray
    }
  } else if (finished === '0') {
    const newBooks = listBooks.filter((book) => book.finished === false)
    newArray = newBooks.map((item) => {
      const obj = {
        id: item.id,
        name: item.name,
        publisher: item.publisher
      }
      return obj
    })
    return newArray
  } else if (finished === '1') {
    const newBooks = listBooks.filter((book) => book.finished === true)
    newArray = newBooks.map((item) => {
      const obj = {
        id: item.id,
        name: item.name,
        publisher: item.publisher
      }
      return obj
    })
    return newArray
  } else {
    newArray = listBooks.map((item) => {
      const obj = {
        id: item.id,
        name: item.name,
        publisher: item.publisher
      }
      return obj
    })
    return newArray
  }
}

const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query
  let newArray = []

  if (name !== undefined) {
    const newWithQName = books.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()))
    newArray = nextStep(newWithQName, reading, finished)
  } else {
    newArray = nextStep(books, reading, finished)
  }

  return {
    status: 'success',
    data: {
      books: newArray
    }
  }
}

const getABookHandler = (request, h) => {
  const { bookId } = request.params

  const book = books.filter((book) => book.id === bookId)[0]

  if (book !== undefined) {
    const response = h.response({
      status: 'success',
      data: {
        book
      }
    }).code(200)
    return response
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan'
  }).code(404)
  return response
}

const editABookHandler = (request, h) => {
  const { bookId } = request.params
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload
  const updatedAt = new Date().toISOString()

  const index = books.findIndex((book) => book.id === bookId)

  if (index !== -1) {
    if (name === undefined) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku'
      }).code(400)
      return response
    } else if (readPage > pageCount) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
      }).code(400)
      return response
    }

    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt
    }
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui'
    }).code(200)
    return response
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan'
  }).code(404)
  return response
}

const deleteABookHandler = (request, h) => {
  const { bookId } = request.params
  const index = books.findIndex((book) => book.id === bookId)

  if (index !== -1) {
    books.splice(index, 1)
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus'
    }).code(200)
    return response
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan'
  }).code(404)
  return response
}

module.exports = { addBooksHandler, getAllBooksHandler, getABookHandler, editABookHandler, deleteABookHandler }
