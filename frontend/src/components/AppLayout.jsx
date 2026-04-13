import { useState } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

const AppLayout = ({ children }) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      {/* Sidebar */}
      <Sidebar
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <main className="lg:ml-64 min-h-screen flex flex-col">
        {/* TopBar */}
        <TopBar onMobileMenuToggle={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)} />

        {/* Page Content */}
        <div className="flex-1">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
