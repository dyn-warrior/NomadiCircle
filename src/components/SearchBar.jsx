import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Calendar, Users } from 'lucide-react'

export default function SearchBar() {
  const navigate = useNavigate()
  const [searchData, setSearchData] = useState({
    destination: '',
    checkIn: '',
    checkOut: '',
    guests: 1
  })

  const handleSearch = (e) => {
    e.preventDefault()
    
    // Store search data in sessionStorage
    sessionStorage.setItem('searchData', JSON.stringify(searchData))
    
    // Navigate to destinations page with search params
    const params = new URLSearchParams({
      destination: searchData.destination,
      checkIn: searchData.checkIn,
      checkOut: searchData.checkOut,
      guests: searchData.guests
    })
    
    navigate(`/destinations?${params.toString()}`)
  }

  const getTodayDate = () => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }

  const getTomorrowDate = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split('T')[0]
  }

  return (
    <div className="w-full bg-white shadow-lg rounded-2xl p-4">
      <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3 items-end">
        {/* Destination Search */}
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-sage-700 mb-1">
            Where to?
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sage-400" size={20} />
            <input
              type="text"
              value={searchData.destination}
              onChange={(e) => setSearchData({ ...searchData, destination: e.target.value })}
              placeholder="Search destinations..."
              className="w-full pl-10 pr-4 py-3 border-2 border-sage-200 rounded-lg focus:border-terracotta-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Check-in Date */}
        <div className="flex-1 min-w-[180px]">
          <label className="block text-sm font-medium text-sage-700 mb-1">
            Check-in
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sage-400" size={20} />
            <input
              type="date"
              value={searchData.checkIn}
              onChange={(e) => setSearchData({ ...searchData, checkIn: e.target.value })}
              min={getTodayDate()}
              className="w-full pl-10 pr-4 py-3 border-2 border-sage-200 rounded-lg focus:border-terracotta-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Check-out Date */}
        <div className="flex-1 min-w-[180px]">
          <label className="block text-sm font-medium text-sage-700 mb-1">
            Check-out
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sage-400" size={20} />
            <input
              type="date"
              value={searchData.checkOut}
              onChange={(e) => setSearchData({ ...searchData, checkOut: e.target.value })}
              min={searchData.checkIn || getTomorrowDate()}
              className="w-full pl-10 pr-4 py-3 border-2 border-sage-200 rounded-lg focus:border-terracotta-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Guests */}
        <div className="min-w-[140px]">
          <label className="block text-sm font-medium text-sage-700 mb-1">
            Guests
          </label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sage-400" size={20} />
            <input
              type="number"
              value={searchData.guests}
              onChange={(e) => setSearchData({ ...searchData, guests: parseInt(e.target.value) || 1 })}
              min="1"
              max="20"
              className="w-full pl-10 pr-4 py-3 border-2 border-sage-200 rounded-lg focus:border-terracotta-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Search Button */}
        <button
          type="submit"
          className="px-8 py-3 bg-gradient-to-r from-terracotta-500 to-terracotta-600 hover:from-terracotta-600 hover:to-terracotta-700 text-white rounded-lg font-bold transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          Search
        </button>
      </form>
    </div>
  )
}
