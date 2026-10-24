import { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Shield, Plus } from 'lucide-react';
import { Stepper } from './Stepper';
import { useInvestigation } from '../../state/InvestigationContext';

interface AppShellProps {
  children: ReactNode;
  showStepper?: boolean;
}

export function AppShell({ children, showStepper = false }: AppShellProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { reset } = useInvestigation();
  
  const getCurrentStep = () => {
    if (location.pathname === '/') return 1;
    if (location.pathname === '/results') return 2;
    if (location.pathname === '/review') return 3;
    if (location.pathname === '/incidents' || location.pathname.startsWith('/incidents/')) return 4;
    return 0;
  };

  const isIncidentsActive = location.pathname === '/incidents' || location.pathname.startsWith('/incidents/');
  
  const handleNewInvestigation = () => {
    reset();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900 flex flex-col font-sans">
      {/* Top Clean Header matching ScholarXI inspiration */}
      <header className="border-b border-zinc-100 bg-white sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Navigation */}
            <div className="flex items-center gap-8">
              <button
                type="button"
                onClick={handleNewInvestigation}
                className="flex items-center gap-2.5 group cursor-pointer text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center text-white">
                  <Shield className="w-4 h-4" />
                </div>
                <span className="text-base font-bold tracking-tight text-zinc-950 font-sans">
                  Message Investigator
                </span>
              </button>

              {/* Clean Nav Links (Workbench tab removed per request) */}
              <nav className="hidden sm:flex items-center gap-6 text-sm font-medium">
                <Link
                  to="/incidents"
                  className={`transition-colors ${
                    isIncidentsActive
                      ? 'text-zinc-950 font-semibold'
                      : 'text-zinc-500 hover:text-zinc-900'
                  }`}
                >
                  Saved Incidents
                </Link>
              </nav>
            </div>

            {/* Right Status & Action Button */}
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 text-xs text-zinc-500">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Offline Air-gap Mode</span>
              </div>

              <button
                type="button"
                onClick={handleNewInvestigation}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold rounded-lg transition-all shadow-sm cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Investigation</span>
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Stepper Pipeline */}
      {showStepper && (
        <div className="border-b border-zinc-100 bg-zinc-50/50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <Stepper currentStep={getCurrentStep()} />
          </div>
        </div>
      )}
      
      {/* Main Workspace */}
      <main className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        {children}
      </main>

      {/* Clean Minimalist Footer */}
      <footer className="border-t border-zinc-100 py-6 mt-auto bg-white text-xs text-zinc-400">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>Human-in-the-loop verification required before incident persistence.</span>
          <span className="text-zinc-400">Links are defanged · Zero external resolution</span>
        </div>
      </footer>
    </div>
  );
}
