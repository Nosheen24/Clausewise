import { Button } from '@/components/ui/Button';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <span className="text-xl font-bold text-primary">Clausewise</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">Features</a>
              <a href="#pricing" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">Pricing</a>
              <a href="#about" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">About</a>
            </div>
            <div className="flex items-center gap-3">
              <a href="/login" className="text-sm font-medium text-gray-700 hover:text-primary transition-colors">Log in</a>
              <a href="/signup" className="bg-primary text-white text-sm font-medium px-5 py-2 rounded-lg hover:bg-primary/90 transition-colors">
                Get Started
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-5">
              <h1 className="text-4xl sm:text-5xl font-bold text-primary leading-tight">
                AI-Powered Contract Intelligence for Teams
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed">
                Clausewise helps legal and business teams review contracts faster, track obligations and renewals automatically, and enforce playbook-based compliance checks — all in one place.
              </p>
              <div className="flex gap-3">
                <a href="/signup" className="bg-primary text-white px-6 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors text-center">
                  Start Free Trial
                </a>
                <a href="#features" className="border border-gray-300 text-primary px-6 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition-colors text-center">
                  Learn More
                </a>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full" /> Free 14-day trial
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full" /> No credit card required
                </span>
              </div>
            </div>
            <div className="bg-surface rounded-xl shadow-md border border-gray-200 p-5">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Dashboard Preview</span>
                  <span className="text-xs text-gray-400">3 contracts active</span>
                </div>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="bg-blue-50 rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-blue-700">42</div>
                    <div className="text-xs text-blue-600">Active</div>
                  </div>
                  <div className="bg-amber-50 rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-amber-700">8</div>
                    <div className="text-xs text-amber-600">Needs Review</div>
                  </div>
                  <div className="bg-red-50 rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-red-700">7</div>
                    <div className="text-xs text-red-600">Renewals</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">Acme Services Agreement</span>
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">Approved</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">Beta Services Contract</span>
                    <span className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-full">In Review</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">Gamma NDA</span>
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">Draft</span>
                  </div>
                </div>
              </div>
              </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-14 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-primary">Everything you need to manage contracts</h2>
            <p className="mt-3 text-gray-600 max-w-2xl mx-auto">From review to renewal, Clausewise automates the entire contract lifecycle so your team can focus on what matters.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              </div>
              <h3 className="text-base font-semibold text-primary mb-1.5">Contract Intelligence</h3>
              <p className="text-sm text-gray-600">AI-assisted review identifies risks, anomalies, and key terms in seconds, not hours.</p>
            </div>
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
              <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 className="text-base font-semibold text-primary mb-1.5">Obligation Tracking</h3>
              <p className="text-sm text-gray-600">Never miss a renewal, payment deadline, or compliance filing with automated tracking.</p>
            </div>
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 className="text-base font-semibold text-primary mb-1.5">Approval Workflows</h3>
              <p className="text-sm text-gray-600">Streamlined review and approval chains keep contracts moving without bottlenecks.</p>
            </div>
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
              <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              </div>
              <h3 className="text-base font-semibold text-primary mb-1.5">Playbook Compliance</h3>
              <p className="text-sm text-gray-600">Enforce your standard terms automatically — flag deviations before they become issues.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="bg-primary py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-accent">42+</div>
              <div className="text-xs text-blue-100 mt-0.5">Active Contracts Tracked</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-accent">99%</div>
              <div className="text-xs text-blue-100 mt-0.5">Renewal Deadlines Caught</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-accent">8</div>
              <div className="text-xs text-blue-100 mt-0.5">Avg. Review Time (min)</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-accent">14K</div>
              <div className="text-xs text-blue-100 mt-0.5">Obligations Monitored</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                  <span className="text-white font-bold text-xs">C</span>
                </div>
                <span className="font-bold text-primary">Clausewise</span>
              </div>
              <p className="text-sm text-gray-500">AI-powered contract lifecycle management.</p>
            </div>
            <div>
              <h4 className="font-semibold text-primary mb-2 text-sm">Product</h4>
              <ul className="space-y-1.5 text-sm text-gray-600">
                <li><a href="#features" className="hover:text-primary">Features</a></li>
                <li><a href="#pricing" className="hover:text-primary">Pricing</a></li>
                <li><a href="#about" className="hover:text-primary">About</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-primary mb-2 text-sm">Company</h4>
              <ul className="space-y-1.5 text-sm text-gray-600">
                <li><a href="#" className="hover:text-primary">Careers</a></li>
                <li><a href="#" className="hover:text-primary">Blog</a></li>
                <li><a href="#" className="hover:text-primary">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-primary mb-2 text-sm">Legal</h4>
              <ul className="space-y-1.5 text-sm text-gray-600">
                <li><a href="#" className="hover:text-primary">Privacy</a></li>
                <li><a href="#" className="hover:text-primary">Terms</a></li>
                <li><a href="#" className="hover:text-primary">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Clausewise. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}