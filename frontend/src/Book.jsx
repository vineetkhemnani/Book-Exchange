import ExchangeButton from "./ExchangeButton"

const Book = ({ book }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-10 flex flex-col min-h-[250px]">
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
          {book.title}
        </h3>
        <p className="text-gray-700">by {book.author}</p>
        <p className="text-sm text-gray-500">Genre: {book.genre}</p>
        <p className="text-sm text-gray-500 mt-2">
          Listed by: {book.listedBy.username}
        </p>
      </div>
      <div className="mt-4">
        <ExchangeButton book={book} />
      </div>
    </div>
  )
}

export default Book