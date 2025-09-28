export default function StatsCard({ title, value, testId }) {
  return (
    <div 
      className="bg-card rounded-lg p-4 border border-card-border hover-elevate transition-all duration-300"
      data-testid={testId}
    >
      <h4 className="text-sm text-muted-foreground mb-1">{title}</h4>
      <p className="text-sm font-medium text-foreground">{value}</p>
    </div>
  )
}