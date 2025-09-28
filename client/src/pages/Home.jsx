import { useState } from 'react'
import Navbar from '../components/Navbar'
import SearchBar from '../components/SearchBar'
import PredictionDashboard from '../components/PredictionDashboard'

export default function Home() {
  const [searchResults, setSearchResults] = useState(null)
  const [currentQuery, setCurrentQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const popularQueries = [
    { id: 1, text: "Barcelona vs Real Madrid", icon: "⚽", category: "TEAM VS TEAM" },
    { id: 2, text: "Manchester City vs Arsenal", icon: "🎯", category: "TEAM VS TEAM" }, 
    { id: 3, text: "Liverpool vs Chelsea", icon: "📊", category: "TEAM VS TEAM" },
    { id: 4, text: "Messi next match performance", icon: "⚡", category: "PLAYER PERFORMANCE" },
    { id: 5, text: "Ronaldo goal scoring form", icon: "🔥", category: "PLAYER PERFORMANCE" },
    { id: 6, text: "Haaland 2.5+ goals chance", icon: "📈", category: "PLAYER PERFORMANCE" }
  ]

  const handleSearch = async (query) => {
    console.log('Search performed:', query)
    setCurrentQuery(query)
    setIsLoading(true)
    setError(null)
    
    try {
      // Call the real backend API
      const response = await fetch('http://127.0.0.1:5000/api/llm-query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('API Response:', data)

      // Use the raw API response directly for the new dashboard
      setSearchResults(data)
    } catch (error) {
      console.error('Error calling API:', error)
      setError(`API Error: ${error.message}. Please check if the backend server is running on port 5000.`)
      setSearchResults(null)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePopularQuery = (query) => {
    setCurrentQuery(query)
    handleSearch(query)
  }


  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
              Probaball
            </span>
          </h1>
                <p className="text-xl text-muted-foreground mb-4 max-w-3xl mx-auto leading-relaxed">
                  Ask anything about sports! Get AI-powered predictions for team matchups, player performance, 
                  match analysis, and any sports-related questions using advanced AI models.
                </p>
          
          {/* Feature Tags */}
                <div className="flex flex-wrap justify-center gap-4 mb-12">
                  <span className="bg-green-500/10 text-green-400 px-3 py-1 rounded-full text-sm border border-green-500/20">
                    ✓ Universal AI Analysis
                  </span>
                  <span className="bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-sm border border-blue-500/20">
                    🤖 Any Sports Query
                  </span>
                  <span className="bg-amber-500/10 text-amber-400 px-3 py-1 rounded-full text-sm border border-amber-500/20">
                    ⚡ Smart Insights
                  </span>
                </div>
        </div>

        {/* Search Section */}
        <div className="mb-12">
          <SearchBar onSearch={handleSearch} isLoading={isLoading} />
          {isLoading && (
            <div className="text-center mt-4">
              <div className="inline-flex items-center gap-2 text-blue-400">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
                Analyzing prediction...
              </div>
            </div>
          )}
          {error && (
            <div className="text-center mt-4">
              <div className="inline-flex items-center gap-2 text-red-400 bg-red-500/10 px-4 py-2 rounded-lg">
                ⚠️ {error}
              </div>
              <div className="text-sm text-muted-foreground mt-2">
                Make sure the backend server is running on port 5000
              </div>
            </div>
          )}
        </div>

        {/* Popular Queries */}
        {!searchResults && (
          <div className="mb-12">
            <h2 className="text-lg font-semibold text-muted-foreground text-center mb-6">
              POPULAR QUERIES
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
              {popularQueries.map((query) => (
                <button
                  key={query.id}
                  onClick={() => handlePopularQuery(query.text)}
                  className="bg-card hover:bg-card/80 rounded-xl p-6 border border-card-border 
                    hover-elevate active-elevate-2 transition-all duration-300 text-left group"
                  data-testid={`popular-query-${query.id}`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{query.icon}</span>
                    <span className="text-xs font-medium text-blue-400 uppercase tracking-wider">
                      {query.category}
                    </span>
                  </div>
                  <p className="text-foreground group-hover:text-blue-400 transition-colors duration-300">
                    {query.text}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results Section */}
        {searchResults && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-foreground">Prediction Results</h2>
              <button
                onClick={() => {
                  setSearchResults(null)
                  setCurrentQuery('')
                  setError(null)
                }}
                className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Clear Results
              </button>
            </div>
            <PredictionDashboard
              data={searchResults}
            />
          </div>
        )}
      </main>
    </div>
  )
}