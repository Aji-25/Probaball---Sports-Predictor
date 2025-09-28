import { Link, useLocation } from 'wouter'

export default function Navbar() {
  const [location] = useLocation()

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" data-testid="link-home">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">PB</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Probaball
                </h1>
                <p className="text-xs text-muted-foreground">Sports Predictions</p>
              </div>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            <Link href="/" data-testid="link-home-nav">
              <span className={`text-sm font-medium transition-colors hover:text-primary ${
                location === '/' ? 'text-primary' : 'text-muted-foreground'
              }`}>
                Home
              </span>
            </Link>
            <Link href="/about" data-testid="link-about">
              <span className={`text-sm font-medium transition-colors hover:text-primary ${
                location === '/about' ? 'text-primary' : 'text-muted-foreground'
              }`}>
                About
              </span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}