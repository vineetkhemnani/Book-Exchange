import { useState } from 'react'
import { Loader2 } from 'lucide-react'

const EditBookModal = ({ book, isOpen, onClose, onSave }) => {
  const [isSaveLoading, setIsSaveLoading] = useState(false)
  const [editForm, setEditForm] = useState({
    title: book.title,
    author: book.author,
    genre: book.genre,
  })

  const handleChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSaveLoading(true)
    try {
      await onSave(book._id, editForm)
      onClose()
    } catch (error) {
      console.log(error)
    } finally {
      setIsSaveLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-96 shadow-xl">
        <h2 className="text-xl font-bold mb-4">Edit Book Details</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <input
              type="text"
              name="title"
              value={editForm.title}
              onChange={handleChange}
              placeholder="Book Title"
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              required
              disabled={isSaveLoading}
            />
            <input
              type="text"
              name="author"
              value={editForm.author}
              onChange={handleChange}
              placeholder="Author"
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              required
              disabled={isSaveLoading}
            />
            <input
              type="text"
              name="genre"
              value={editForm.genre}
              onChange={handleChange}
              placeholder="Genre"
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              required
              disabled={isSaveLoading}
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50"
              disabled={isSaveLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaveLoading}
              className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaveLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditBookModal
