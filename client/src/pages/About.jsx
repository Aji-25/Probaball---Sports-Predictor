import Navbar from '../components/Navbar'

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Gradient Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                About Probaball
              </span>
            </h1>
          </div>

          {/* Content */}
          <div className="prose prose-invert prose-lg max-w-none">
            <div className="bg-card rounded-xl p-8 border border-card-border">
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                Probaball is a demonstration sports prediction platform that showcases 
                advanced statistical modeling and AI-powered analysis for sports events.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">What We Offer</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      Team vs Team probability analysis
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                      Player performance predictions
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      Over/Under match statistics
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                      Real-time data analysis
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">Technology</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      Advanced statistical models
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                      Machine learning algorithms
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      Live sports data integration
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                      Historical performance analysis
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-8 p-6 bg-amber-500/10 rounded-lg border border-amber-500/20">
                <h3 className="text-lg font-semibold text-amber-200 mb-2">⚠️ Important Disclaimer</h3>
                <p className="text-amber-100/90">
                  This is a demonstration platform designed to showcase sports prediction technology. 
                  Probaball is not intended for real betting or gambling purposes. All predictions 
                  are for educational and entertainment purposes only.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}