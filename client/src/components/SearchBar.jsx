import { useState } from 'react'

export default function SearchBar({ onSearch, isLoading = false }) {
  const [query, setQuery] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (query.trim() && !isLoading) {
      console.log('Search triggered:', query)
      onSearch?.(query)
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ask anything about sports predictions..."
            className="w-full px-6 py-4 text-lg bg-card rounded-xl border border-card-border 
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              transition-all duration-300 placeholder:text-muted-foreground"
            data-testid="input-search"
          />
          <button
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 
              bg-gradient-to-r from-blue-500 to-purple-600 
              hover:from-blue-600 hover:to-purple-700
              text-white px-6 py-2 rounded-lg font-medium
              transition-all duration-300 hover:scale-105
              disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!query.trim() || isLoading}
            data-testid="button-search"
          >
            {isLoading ? 'Analyzing...' : 'Predict'}
          </button>
        </div>
      </form>
    </div>
  )
}