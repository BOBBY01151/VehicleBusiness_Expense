import React, { useState } from 'react';
import { FigmaNavbar } from '../../components/figma/FigmaNavbar';
import { FigmaSidebar } from '../../components/figma/FigmaSidebar';
import { FigmaDashboard } from '../../components/figma/FigmaDashboard';
import { FigmaSpareParts } from '../../components/figma/FigmaSpareParts';

export default function FigmaAdminDashboard() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Background pattern */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-green-500/5 via-transparent to-emerald-500/5"></div>
      </div>

      <div className="relative z-10 flex h-screen">
        {/* Sidebar */}
        <FigmaSidebar
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          expanded={sidebarExpanded}
          setExpanded={setSidebarExpanded}
        />

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <FigmaNavbar
            currentPage={currentPage}
            sidebarExpanded={sidebarExpanded}
            setSidebarExpanded={setSidebarExpanded}
          />

          <main className="flex-1 overflow-hidden">
            {currentPage === 'dashboard' && <FigmaDashboard />}
            {currentPage === 'spare-parts' && <FigmaSpareParts />}
            {currentPage === 'rentals' && (
              <div className="h-full flex items-center justify-center">
                <div className="text-white/60 text-lg">Rentals Page - Coming Soon</div>
              </div>
            )}
            {currentPage === 'sales' && (
              <div className="h-full flex items-center justify-center">
                <div className="text-white/60 text-lg">Sales Page - Coming Soon</div>
              </div>
            )}
            {currentPage === 'yard-inventory' && (
              <div className="h-full flex items-center justify-center">
                <div className="text-white/60 text-lg">Yard Inventory Page - Coming Soon</div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

