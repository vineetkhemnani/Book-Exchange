import { useState } from 'react'

const EditBookModal = ({ book, isOpen, onClose, onSave }) => {
  const [editForm, setEditForm] = useState({
    title: book.title,
    author: book.author,
    genre: book.genre,
  })

  const handleChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(book._id, editForm)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Edit Book Details</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            value={editForm.title}
            onChange={handleChange}
            placeholder="Book Title"
            className="w-full mb-2 p-2 border border-gray-300 rounded"
            required
          />
          <input
            type="text"
            name="author"
            value={editForm.author}
            onChange={handleChange}
            placeholder="Author"
            className="w-full mb-2 p-2 border border-gray-300 rounded"
            required
          />
          <input
            type="text"
            name="genre"
            value={editForm.genre}
            onChange={handleChange}
            placeholder="Genre"
            className="w-full mb-4 p-2 border border-gray-300 rounded"
            required
          />
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditBookModal
