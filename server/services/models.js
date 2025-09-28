/**
 * Baseline probability model
 * Simple statistical model for sports predictions
 */

/**
 * Calculate win probability based on recent form
 */
function calculateFormProbability(form) {
  const wins = form.filter(result => result === 'W').length;
  const draws = form.filter(result => result === 'D').length;
  const losses = form.filter(result => result === 'L').length;
  
  const total = form.length;
  const winRate = wins / total;
  const drawRate = draws / total;
  const lossRate = losses / total;
  
  return { winRate, drawRate, lossRate };
}

/**
 * Calculate goal-based probability
 */
function calculateGoalProbability(teamAGoals, teamBGoals) {
  const goalDiff = teamAGoals.for - teamBGoals.for;
  const goalDiffB = teamBGoals.for - teamAGoals.for;
  
  // Base probability from goal difference
  let teamAProb = 50;
  let teamBProb = 50;
  
  if (goalDiff > 0) {
    teamAProb += Math.min(goalDiff * 5, 25);
    teamBProb -= Math.min(goalDiff * 5, 25);
  } else if (goalDiff < 0) {
    teamAProb -= Math.min(Math.abs(goalDiff) * 5, 25);
    teamBProb += Math.min(Math.abs(goalDiff) * 5, 25);
  }
  
  return { teamAProb, teamBProb };
}

/**
 * Calculate head-to-head probability
 */
function calculateHeadToHeadProbability(h2h) {
  const total = h2h.teamA_wins + h2h.teamB_wins + h2h.draws;
  
  if (total === 0) return { teamA: 50, teamB: 50 };
  
  const teamAWinRate = (h2h.teamA_wins / total) * 100;
  const teamBWinRate = (h2h.teamB_wins / total) * 100;
  const drawRate = (h2h.draws / total) * 100;
  
  return { teamA: teamAWinRate, teamB: teamBWinRate, draw: drawRate };
}

/**
 * Main baseline prediction model
 */
function predictMatch(stats) {
  const { teams, recentForm, avgGoals, headToHead } = stats;
  
  // Calculate probabilities from different factors
  const formA = calculateFormProbability(recentForm.teamA);
  const formB = calculateFormProbability(recentForm.teamB);
  
  const goalProb = calculateGoalProbability(avgGoals, avgGoals);
  const h2hProb = calculateHeadToHeadProbability(headToHead);
  
  // Weighted combination of factors
  const weights = {
    recentForm: 0.4,
    goalStats: 0.3,
    headToHead: 0.2,
    homeAdvantage: 0.1
  };
  
  // Calculate weighted probabilities
  let teamAProb = 0;
  let teamBProb = 0;
  let drawProb = 0;
  
  // Recent form contribution
  teamAProb += formA.winRate * weights.recentForm;
  teamBProb += formB.winRate * weights.recentForm;
  drawProb += ((formA.drawRate + formB.drawRate) / 2) * weights.recentForm;
  
  // Goal statistics contribution
  teamAProb += goalProb.teamAProb * weights.goalStats;
  teamBProb += goalProb.teamBProb * weights.goalStats;
  
  // Head-to-head contribution
  teamAProb += h2hProb.teamA * weights.headToHead;
  teamBProb += h2hProb.teamB * weights.headToHead;
  drawProb += h2hProb.draw * weights.headToHead;
  
  // Home advantage (if applicable)
  if (stats.homeAdvantage) {
    teamAProb += 5 * weights.homeAdvantage;
    teamBProb -= 2.5 * weights.homeAdvantage;
    drawProb -= 2.5 * weights.homeAdvantage;
  }
  
  // Normalize probabilities to sum to 100
  const total = teamAProb + teamBProb + drawProb;
  teamAProb = Math.round((teamAProb / total) * 100);
  teamBProb = Math.round((teamBProb / total) * 100);
  drawProb = Math.round((drawProb / total) * 100);
  
  // Ensure they sum to 100
  const remainder = 100 - (teamAProb + teamBProb + drawProb);
  if (remainder !== 0) {
    teamAProb += remainder;
  }
  
  // Generate insight based on the analysis
  const insight = generateInsight(stats, { teamA: teamAProb, teamB: teamBProb, draw: drawProb });
  
  return {
    probability: { teamA: teamAProb, draw: drawProb, teamB: teamBProb },
    insight: insight
  };
}

/**
 * Generate human-readable insight
 */
function generateInsight(stats, probabilities) {
  const { teams, recentForm, avgGoals, headToHead } = stats;
  const { teamA, teamB, draw } = probabilities;
  
  const insights = [];
  
  // Recent form analysis
  const teamAForm = recentForm.teamA.filter(r => r === 'W').length;
  const teamBForm = recentForm.teamB.filter(r => r === 'W').length;
  
  if (teamAForm > teamBForm) {
    insights.push(`${teams.teamA} has better recent form (${teamAForm} wins vs ${teamBForm} wins)`);
  } else if (teamBForm > teamAForm) {
    insights.push(`${teams.teamB} has better recent form (${teamBForm} wins vs ${teamAForm} wins)`);
  }
  
  // Goal scoring analysis
  if (avgGoals.teamA_for > avgGoals.teamB_for) {
    insights.push(`${teams.teamA} has higher scoring average (${avgGoals.teamA_for} vs ${avgGoals.teamB_for})`);
  } else if (avgGoals.teamB_for > avgGoals.teamA_for) {
    insights.push(`${teams.teamB} has higher scoring average (${avgGoals.teamB_for} vs ${avgGoals.teamA_for})`);
  }
  
  // Head-to-head analysis
  if (headToHead.teamA_wins > headToHead.teamB_wins) {
    insights.push(`${teams.teamA} leads head-to-head record (${headToHead.teamA_wins}-${headToHead.teamB_wins})`);
  } else if (headToHead.teamB_wins > headToHead.teamA_wins) {
    insights.push(`${teams.teamB} leads head-to-head record (${headToHead.teamB_wins}-${headToHead.teamA_wins})`);
  }
  
  // Final probability summary
  if (teamA > teamB) {
    insights.push(`Baseline model favors ${teams.teamA} (${teamA}% vs ${teamB}%)`);
  } else if (teamB > teamA) {
    insights.push(`Baseline model favors ${teams.teamB} (${teamB}% vs ${teamA}%)`);
  } else {
    insights.push(`Baseline model suggests a close match`);
  }
  
  return insights.join('. ') + '.';
}

/**
 * Predict player performance
 */
function predictPlayerPerformance(playerStats, matchContext) {
  const { goals, assists, avgRating, recentForm } = playerStats;
  
  // Calculate performance probability based on recent form and stats
  const formScore = recentForm.filter(r => r === 'W').length / recentForm.length;
  const basePerformance = (parseFloat(avgRating) / 10) * 50;
  const formBonus = formScore * 20;
  
  const performanceScore = Math.min(basePerformance + formBonus, 100);
  
  // Predict specific outcomes
  const goalProbability = Math.min((goals / 20) * 30 + formScore * 10, 50);
  const assistProbability = Math.min((assists / 15) * 25 + formScore * 8, 40);
  
  return {
    performanceScore: Math.round(performanceScore),
    goalProbability: Math.round(goalProbability),
    assistProbability: Math.round(assistProbability),
    insight: `${playerStats.name} has been in ${formScore > 0.6 ? 'good' : 'average'} form recently with ${goals} goals and ${assists} assists this season.`
  };
}

module.exports = {
  predictMatch,
  predictPlayerPerformance,
  calculateFormProbability,
  calculateGoalProbability,
  calculateHeadToHeadProbability
};
