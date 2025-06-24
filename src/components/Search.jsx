import React from 'react'

const Search = ({searchTerm, setSearchTerm}) => {
  return (
    <>
      <div className='search'>
        <div>
          <img src="Vector.svg" alt="search-iconx" />
          <input 
            type="text" 
            placeholder='Search Movies here'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
             />
        </div>

      </div>
    </>
  )
}

export default Search
