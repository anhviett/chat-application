const SearchSection = () => {
  return (
    <div className="wrap-search relative mb-4">
      <form className="w-full bg-white flex" action="">
        <input
          type="text"
          className="form-control w-full text-gray-400 text-sm p-2"
          placeholder="Search For Contacts or Messages"
        />
        <span className="p-2 cursor-pointer bg-white">
          <i className="fa-solid fa-search text-sm text-gray-400"></i>
        </span>
      </form>
    </div>
  );
};

export default SearchSection;
