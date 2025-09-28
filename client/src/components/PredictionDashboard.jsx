import { Pie } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js'

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend)

export default function PredictionDashboard({ data }) {
  if (!data) return null


  // Extract team names from title
  const getTeamNames = (title) => {
    if (!title) return ['Team A', 'Team B']
    
    // Try to extract team names from title like "Barcelona vs Real Madrid Match Prediction"
    const teamMatch = title.match(/(.+?)\s+vs\s+(.+?)\s+Match/i)
    if (teamMatch) {
      return [teamMatch[1].trim(), teamMatch[2].trim()]
    }
    
    // Try other patterns like "Prediction: Liverpool vs Chelsea"
    const predictionMatch = title.match(/Prediction:\s*(.+?)\s+vs\s+(.+)/i)
    if (predictionMatch) {
      return [predictionMatch[1].trim(), predictionMatch[2].trim()]
    }
    
    // Try simple "Team1 vs Team2" pattern
    const simpleMatch = title.match(/(.+?)\s+vs\s+(.+)/i)
    if (simpleMatch) {
      return [simpleMatch[1].trim(), simpleMatch[2].trim()]
    }
    
    return ['Team A', 'Team B']
  }

  const teamNames = getTeamNames(data.title)
  
  // Handle probabilities - they might be null for non-match queries
  let probabilities = [33, 33, 34] // Default fallback
  if (data.probability && data.probability.teamA !== null && data.probability.teamB !== null) {
    // Convert probabilities to percentages
    // Check if values are already in percentage format (> 1) or decimal format (<= 1)
    const rawValues = [data.probability.teamA || 0, data.probability.draw || 0, data.probability.teamB || 0]
    const maxValue = Math.max(...rawValues)
    
    if (maxValue > 1) {
      // Values are already in percentage format
      probabilities = rawValues.map(v => Math.round(v))
    } else {
      // Values are in decimal format, convert to percentages
      probabilities = rawValues.map(v => Math.round(v * 100))
    }
  }




  const pieChartData = {
    labels: [teamNames[0], 'Draw', teamNames[1]],
    datasets: [
      {
        data: probabilities,
        backgroundColor: [
          '#3b82f6', // Blue for Team A
          '#6b7280', // Gray for Draw
          '#ef4444'  // Red for Team B
        ],
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  }


  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          color: '#374151',
          padding: 20,
          font: {
            size: 14,
            weight: '500',
          },
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#374151',
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            return `${context.label}: ${context.parsed}%`
          }
        }
      },
    },
    elements: {
      arc: {
        borderWidth: 2,
        borderColor: '#ffffff',
      }
    }
  }

  // Helper function to get goal statistics from any format
  const getGoalStat = (avgGoals, teamName, type) => {
    if (!avgGoals) return 'N/A'
    
    // Try different data structures
    const teamData = avgGoals[teamName] || avgGoals[`${teamName}_for`] || avgGoals[`${teamName}_against`]
    
    if (teamData) {
      if (typeof teamData === 'object') {
        // Object format: {scored: 2.1, conceded: 0.9}
        return teamData[type] || teamData[`${type}PerGame`] || 'N/A'
      } else if (typeof teamData === 'string') {
        // String format: "High (2.2+ goals per game)"
        return teamData
      } else if (typeof teamData === 'number') {
        // Number format: 2.3 (assume this is scored goals)
        if (type === 'scored') {
          return teamData
        } else {
          return 'N/A' // No conceded data available
        }
      } else {
        return teamData
      }
    }
    
    // Fallback to teamA/teamB format
    const fallbackKey = type === 'scored' ? 'teamA_for' : 'teamA_against'
    const fallbackValue = avgGoals[fallbackKey]
    
    if (fallbackValue) {
      return fallbackValue
    }
    
    return 'N/A'
  }

  // Helper function to parse form data from any format
  const parseFormData = (formData) => {
    if (!formData) return []
    
    // Array format: ["W", "D", "L", "W", "W"]
    if (Array.isArray(formData)) {
      return formData.filter(item => ['W', 'D', 'L'].includes(item))
    }
    
    // String format: "WWDLW" or "W,D,L,W,W"
    if (typeof formData === 'string') {
      // Check if it's descriptive text (contains words like "win", "loss", etc.)
      if (formData.toLowerCase().includes('win') || 
          formData.toLowerCase().includes('loss') || 
          formData.toLowerCase().includes('draw') ||
          formData.toLowerCase().includes('strong') ||
          formData.toLowerCase().includes('good') ||
          formData.toLowerCase().includes('excellent') ||
          formData.toLowerCase().includes('inconsistent') ||
          formData.toLowerCase().includes('performance')) {
        return ['DESC'] // Special marker for descriptive text
      }
      
      // Extract W/D/L pattern from string
      const match = formData.match(/([WLD]+)/)
      if (match) {
        return match[1].split('')
      }
      
      // Comma-separated format
      if (formData.includes(',')) {
        return formData.split(',').map(s => s.trim()).filter(item => ['W', 'D', 'L'].includes(item))
      }
      
      // Continuous string format
      return formData.split('').filter(char => ['W', 'D', 'L'].includes(char))
    }
    
    // Object format: {wins: 3, draws: 1, losses: 1}
    if (formData && typeof formData === 'object' && formData.wins !== undefined) {
      const wins = formData.wins || 0
      const draws = formData.draws || 0
      const losses = formData.losses || 0
      
      return [
        ...Array(wins).fill('W'),
        ...Array(draws).fill('D'),
        ...Array(losses).fill('L')
      ]
    }
    
    return ['N/A']
  }

  // Helper function to render form badges
  const renderFormBadges = (formData, teamName) => {
    const formArray = parseFormData(formData)
    
    // Handle descriptive text
    if (formArray[0] === 'DESC') {
      return (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-600 mb-2">{teamName}</h4>
          <div className="text-xs text-gray-500 text-center italic">
            {formData}
          </div>
        </div>
      )
    }
    
    return (
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-600 mb-2">{teamName}</h4>
        <div className="flex gap-1 justify-center">
          {formArray.map((result, index) => (
            <span
              key={index}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                result === 'W' 
                  ? 'bg-green-500 text-white' 
                  : result === 'D' 
                  ? 'bg-gray-500 text-white' 
                  : result === 'L'
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-300 text-gray-600'
              }`}
            >
              {result}
            </span>
          ))}
        </div>
        {formArray[0] !== 'N/A' && (
          <div className="text-xs text-gray-500 text-center">
            {formArray.filter(r => r === 'W').length}W {formArray.filter(r => r === 'D').length}D {formArray.filter(r => r === 'L').length}L
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Title */}
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
          {data.title}
        </h1>
        <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full"></div>
      </div>

      {/* Main Dashboard Grid - Only show if we have match data */}
      {data.probability && data.probability.teamA !== null && data.probability.teamB !== null ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Pie Chart */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
              Win Probability
            </h2>
            <div className="h-80">
              <Pie data={pieChartData} options={chartOptions} />
            </div>
          </div>

          {/* Right Side - Stats Cards */}
          <div className="space-y-6">
            {/* Recent Form Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                Recent Form (Last 5 Games)
              </h3>
              <div className="grid grid-cols-2 gap-6">
                {data.stats?.recentForm ? (
                  <>
                    {data.stats.recentForm[teamNames[0]] ? 
                      renderFormBadges(data.stats.recentForm[teamNames[0]], teamNames[0]) :
                      data.stats.recentForm.teamA ? 
                        renderFormBadges(data.stats.recentForm.teamA, teamNames[0]) :
                        <div className="text-center text-gray-500">No recent form data</div>
                    }
                    {data.stats.recentForm[teamNames[1]] ? 
                      renderFormBadges(data.stats.recentForm[teamNames[1]], teamNames[1]) :
                      data.stats.recentForm.teamB ? 
                        renderFormBadges(data.stats.recentForm.teamB, teamNames[1]) :
                        <div className="text-center text-gray-500">No recent form data</div>
                    }
                  </>
                ) : (
                  <>
                    <div className="text-center text-gray-500">No recent form data</div>
                    <div className="text-center text-gray-500">No recent form data</div>
                  </>
                )}
              </div>
              <div className="mt-4 text-sm text-gray-600 text-center">
                <span className="font-medium">Legend:</span> 
                <span className="mx-2"><span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-1"></span>W = Win</span>
                <span className="mx-2"><span className="inline-block w-3 h-3 bg-gray-500 rounded-full mr-1"></span>D = Draw</span>
                <span className="mx-2"><span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-1"></span>L = Loss</span>
              </div>
            </div>

            {/* Average Goals Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Average Goals Per Game
              </h3>
              <div className="grid grid-cols-2 gap-6">
                {/* Team A Goals */}
                <div className="text-center">
                  <h4 className="text-sm font-medium text-gray-600 mb-2">{teamNames[0]}</h4>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Scored:</span>
                      <span className="font-semibold text-green-600">
                        {getGoalStat(data.stats?.avgGoals, teamNames[0], 'scored')}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Conceded:</span>
                      <span className="font-semibold text-red-600">
                        {getGoalStat(data.stats?.avgGoals, teamNames[0], 'conceded')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Team B Goals */}
                <div className="text-center">
                  <h4 className="text-sm font-medium text-gray-600 mb-2">{teamNames[1]}</h4>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Scored:</span>
                      <span className="font-semibold text-green-600">
                        {getGoalStat(data.stats?.avgGoals, teamNames[1], 'scored')}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Conceded:</span>
                      <span className="font-semibold text-red-600">
                        {getGoalStat(data.stats?.avgGoals, teamNames[1], 'conceded')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Show a message for non-match queries */
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200 text-center">
          <div className="text-6xl mb-4">🤖</div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">AI Sports Analysis</h2>
          <p className="text-gray-600 text-lg">
            This query is about {data.probability ? 'general sports analysis' : 'player performance or sports insights'}. 
            Check the insight below for detailed analysis.
          </p>
        </div>
      )}

      {/* Smart Insight */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-8 border border-amber-200 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm">⚡</span>
          </div>
          <h3 className="text-xl font-semibold text-amber-800">Smart Insight</h3>
        </div>
        <p className="text-amber-700 leading-relaxed text-lg">
          {typeof data.insight === 'string' ? data.insight : "No insight available"}
        </p>
      </div>

      {/* Smart Bet Section */}
      {data.smart_bet && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-200 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">💡</span>
            </div>
            <h3 className="text-xl font-semibold text-green-800">Smart Bet</h3>
          </div>
          
          <div className="space-y-4">
            {/* Bet Recommendation */}
            <div className="text-lg font-semibold text-green-700">
              {data.smart_bet.recommendation || "No recommendation available"}
            </div>
            
            {/* Confidence Score */}
            {data.smart_bet.confidence && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-green-600">Confidence</span>
                  <span className="text-sm font-bold text-green-700">
                    {Math.round(data.smart_bet.confidence * 100)}%
                  </span>
                </div>
                
                {/* Confidence Bar */}
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      data.smart_bet.confidence > 0.7 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                        : data.smart_bet.confidence > 0.4 
                        ? 'bg-gradient-to-r from-yellow-500 to-orange-500' 
                        : 'bg-gradient-to-r from-red-500 to-pink-500'
                    }`}
                    style={{ width: `${data.smart_bet.confidence * 100}%` }}
                  ></div>
                </div>
                
                {/* Confidence Level Text */}
                <div className="text-xs text-green-600 text-center">
                  {data.smart_bet.confidence > 0.7 
                    ? 'High Confidence' 
                    : data.smart_bet.confidence > 0.4 
                    ? 'Medium Confidence' 
                    : 'Low Confidence'
                  }
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
