import { Pie, Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js'
import StatsCard from './StatsCard'

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement)

export default function Results({ searchQuery, data }) {
  if (!data) return null

  // Extract team names from query or use defaults
  const getTeamNames = (query) => {
    if (!query) return ['Team A', 'Draw', 'Team B']
    
    // Try to extract team names from query
    const teamMatch = query.match(/(.+?)\s+(?:vs|v|against)\s+(.+)/i)
    if (teamMatch) {
      return [teamMatch[1].trim(), 'Draw', teamMatch[2].trim()]
    }
    
    return ['Team A', 'Draw', 'Team B']
  }

  const teamNames = getTeamNames(searchQuery)
  
  const pieChartData = {
    labels: teamNames,
    datasets: [
      {
        data: data.probabilities || [33, 33, 34],
        backgroundColor: [
          '#3b82f6', // Blue
          '#6b7280', // Gray
          '#ef4444'  // Red
        ],
        borderWidth: 0,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: 'hsl(var(--foreground))',
          padding: 20,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: 'hsl(var(--popover))',
        titleColor: 'hsl(var(--popover-foreground))',
        bodyColor: 'hsl(var(--popover-foreground))',
        borderColor: 'hsl(var(--border))',
        borderWidth: 1,
      },
    },
  }

  return (
    <div className="w-full max-w-6xl mx-auto mt-8 space-y-6" data-testid="results-section">
      {/* Query Display */}
      <div className="bg-card rounded-xl p-6 border border-card-border">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          {searchQuery}
        </h2>
        <p className="text-muted-foreground">Team Vs Team</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart Panel */}
        <div className="bg-card rounded-xl p-6 border border-card-border backdrop-blur-sm">
          <div className="h-80">
            <Pie data={pieChartData} options={chartOptions} />
          </div>
        </div>

        {/* Key Statistics */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-5 h-5 bg-gradient-to-r from-blue-500 to-purple-600 rounded"></div>
            <h3 className="text-lg font-semibold">Key Statistics</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <StatsCard 
              title={`Recent Form (${teamNames[0]})`}
              value={data.stats?.recentForm?.teamA ? data.stats.recentForm.teamA.join('-') : 'W-W-L-W-W'}
              testId="stat-form-a"
            />
            <StatsCard 
              title={`Recent Form (${teamNames[2]})`}
              value={data.stats?.recentForm?.teamB ? data.stats.recentForm.teamB.join('-') : 'L-D-W-L-D'}
              testId="stat-form-b"
            />
            <StatsCard 
              title="Head to Head"
              value="Team A: 7 wins, Team B: 3 wins"
              testId="stat-h2h"
            />
            <StatsCard 
              title="Average Goals"
              value={data.stats?.avgGoals ? 
                `${data.stats.avgGoals.teamA_for || '2.8'} (${teamNames[0]}), ${data.stats.avgGoals.teamB_for || '1.6'} (${teamNames[2]})` : 
                '2.8 (Team A), 1.6 (Team B)'
              }
              testId="stat-goals"
            />
          </div>
        </div>
      </div>

      {/* Smart Insight */}
      <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-xl p-6 border border-amber-500/20">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs">⚡</span>
          </div>
          <h3 className="text-lg font-semibold text-amber-200">Smart Insight</h3>
        </div>
        <p className="text-amber-100/90 leading-relaxed">
          {data.insight || "Liverpool has won 4 of their last 5 matches and scored 2+ goals in 80% of home games this season."}
        </p>
      </div>
    </div>
  )
}