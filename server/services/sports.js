/**
 * Mock sports data service
 * In production, this would fetch from real sports APIs
 */

const mockTeams = {
  'barcelona': { name: 'Barcelona', league: 'La Liga' },
  'real madrid': { name: 'Real Madrid', league: 'La Liga' },
  'manchester city': { name: 'Manchester City', league: 'Premier League' },
  'arsenal': { name: 'Arsenal', league: 'Premier League' },
  'liverpool': { name: 'Liverpool', league: 'Premier League' },
  'chelsea': { name: 'Chelsea', league: 'Premier League' },
  'psg': { name: 'PSG', league: 'Ligue 1' },
  'bayern': { name: 'Bayern Munich', league: 'Bundesliga' }
};

const mockPlayers = {
  'messi': { name: 'Lionel Messi', team: 'Barcelona', position: 'Forward' },
  'ronaldo': { name: 'Cristiano Ronaldo', team: 'Real Madrid', position: 'Forward' },
  'haaland': { name: 'Erling Haaland', team: 'Manchester City', position: 'Forward' },
  'mbappe': { name: 'Kylian Mbappe', team: 'PSG', position: 'Forward' }
};

/**
 * Generate mock team statistics
 */
function getTeamStats(teamName) {
  const normalizedName = teamName.toLowerCase();
  const team = mockTeams[normalizedName];
  
  if (!team) {
    return null;
  }

  // Generate realistic mock data
  const recentForm = generateRecentForm();
  const avgGoals = generateGoalStats();
  
  return {
    team: team.name,
    league: team.league,
    recentForm: recentForm,
    avgGoals: avgGoals,
    homeRecord: generateHomeRecord(),
    awayRecord: generateAwayRecord()
  };
}

/**
 * Generate mock head-to-head statistics
 */
function getHeadToHeadStats(teamA, teamB) {
  return {
    teamA_wins: Math.floor(Math.random() * 5) + 1,
    teamB_wins: Math.floor(Math.random() * 5) + 1,
    draws: Math.floor(Math.random() * 3) + 1,
    lastMeeting: {
      date: '2024-01-15',
      result: Math.random() > 0.5 ? 'teamA' : 'teamB',
      score: `${Math.floor(Math.random() * 3) + 1}-${Math.floor(Math.random() * 3) + 1}`
    }
  };
}

/**
 * Generate mock player statistics
 */
function getPlayerStats(playerName) {
  const normalizedName = playerName.toLowerCase();
  const player = mockPlayers[normalizedName];
  
  if (!player) {
    return null;
  }

  return {
    name: player.name,
    team: player.team,
    position: player.position,
    goals: Math.floor(Math.random() * 20) + 5,
    assists: Math.floor(Math.random() * 15) + 3,
    avgRating: (Math.random() * 2 + 6).toFixed(1),
    recentForm: generateRecentForm()
  };
}

/**
 * Generate mock match statistics for two teams
 */
function getMatchStats(teamA, teamB) {
  const teamAStats = getTeamStats(teamA);
  const teamBStats = getTeamStats(teamB);
  
  if (!teamAStats || !teamBStats) {
    return null;
  }

  const headToHead = getHeadToHeadStats(teamA, teamB);
  
  return {
    teams: { teamA: teamAStats.team, teamB: teamBStats.team },
    recentForm: { 
      teamA: teamAStats.recentForm, 
      teamB: teamBStats.recentForm 
    },
    avgGoals: { 
      teamA_for: teamAStats.avgGoals.for, 
      teamA_against: teamAStats.avgGoals.against,
      teamB_for: teamBStats.avgGoals.for, 
      teamB_against: teamBStats.avgGoals.against 
    },
    headToHead: headToHead,
    homeAdvantage: teamAStats.homeRecord.winRate > teamBStats.awayRecord.winRate
  };
}

// Helper functions to generate realistic mock data
function generateRecentForm() {
  const results = ['W', 'L', 'D'];
  return Array.from({ length: 5 }, () => results[Math.floor(Math.random() * results.length)]);
}

function generateGoalStats() {
  return {
    for: (Math.random() * 2 + 1).toFixed(1),
    against: (Math.random() * 1.5 + 0.5).toFixed(1)
  };
}

function generateHomeRecord() {
  const wins = Math.floor(Math.random() * 8) + 5;
  const draws = Math.floor(Math.random() * 3) + 1;
  const losses = Math.floor(Math.random() * 4) + 1;
  
  return {
    wins,
    draws,
    losses,
    winRate: (wins / (wins + draws + losses) * 100).toFixed(1)
  };
}

function generateAwayRecord() {
  const wins = Math.floor(Math.random() * 6) + 3;
  const draws = Math.floor(Math.random() * 4) + 2;
  const losses = Math.floor(Math.random() * 6) + 2;
  
  return {
    wins,
    draws,
    losses,
    winRate: (wins / (wins + draws + losses) * 100).toFixed(1)
  };
}

module.exports = {
  getTeamStats,
  getPlayerStats,
  getMatchStats,
  getHeadToHeadStats,
  mockTeams,
  mockPlayers
};
