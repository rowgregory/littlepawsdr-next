import { FC, useMemo } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons'

interface SearchBarProps {
  data: any
  setSearchResults: any
  loading: boolean
  searchQuery: string
  setSearchQuery: any
}

const SearchBar: FC<SearchBarProps> = ({ data, setSearchResults, loading, searchQuery, setSearchQuery }) => {
  const filterData = useMemo(
    () => (dataArray: any, query: any) => dataArray.filter((item: any) => item.name.toLowerCase().startsWith(query.toLowerCase())),
    []
  )

  const clearSearch = () => {
    setSearchQuery('')
    setSearchResults({})
  }

  const handleSearch = (query: string) => {
    if (query === '') {
      clearSearch()
    } else {
      const filteredDachshunds = filterData(data?.dachshund || [], query)
      const filteredProducts = filterData(data?.searchBar?.products || [], query)
      const filteredEcards = filterData(data?.searchBar?.ecards || [], query)
      const filteredDogBoosts = filterData(data?.searchBar?.DogBoosts || [], query)

      setSearchResults({
        dachshunds: [...filteredDachshunds],
        products: [...filteredProducts],
        ecards: [...filteredEcards],
        DogBoosts: [...filteredDogBoosts]
      })
    }
  }

  return (
    <div className="border-b border-solid border-[#cbd7db] flex my-7 mx-5 items-center relative">
      <FontAwesomeIcon icon={faSearch} color="#cbd7db" className="mr-3" />
      <input
        className="focus:outline-none bg-transparent h-11 border-0 w-full caret-[#22c2b7]"
        disabled={loading}
        type="text"
        value={searchQuery}
        placeholder={loading ? 'Loading...' : 'Search'}
        onChange={(e: any) => {
          setSearchQuery(e.target.value)
          handleSearch(e.target.value)
        }}
      />
      <FontAwesomeIcon onClick={() => clearSearch()} icon={faTimes} className="self-end mb-2 cursor-pointer" size="xs" />
    </div>
  )
}

export default SearchBar
