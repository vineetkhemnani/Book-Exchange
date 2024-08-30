import ExchangeButton from "./ExchangeButton"

const Book = ({book}) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <h3 className="text-lg font-semibold text-gray-900">{book.title}</h3>
      <p className="text-gray-700">by {book.author}</p>
      <p className="text-sm text-gray-500">Genre: {book.genre}</p>
      <p className="text-sm text-gray-500 mt-2">
        Listed by: {book.listedBy.username}
      </p>
      <ExchangeButton book={book} />
    </div>
  )
}
export default Book