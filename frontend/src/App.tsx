import React, { useState, useEffect, useCallback } from 'react';
import { getAuthToken } from './api/client.js';
import { api } from './api/items.api.js';
import { Item, Room, Household, DashboardData } from './types/inventory.types.js';
import { ChainedAddProvider } from './context/ChainedAddContext.js';
import { Navbar } from './components/layout/Navbar.js';
import { BottomNav } from './components/layout/BottomNav.js';
import { OverviewPage } from './pages/OverviewPage.js';
import { DressingPage } from './pages/DressingPage.js';
import { DashboardPage } from './pages/DashboardPage.js';
import { SettingsPage } from './pages/SettingsPage.js';
import { AuthPage } from './pages/AuthPage.js';
import { FastAddModal } from './components/fast-add/FastAddModal.js';
import { ItemEnrichmentModal } from './components/inventory/ItemEnrichmentModal.js';
import { Loader2 } from 'lucide-react';

export const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!getAuthToken());
  const [activeTab, setActiveTab] = useState<'overview' | 'dressing' | 'dashboard' | 'settings'>('overview');

  // Modals state
  const [isFastAddOpen, setIsFastAddOpen] = useState(false);
  const [enrichmentItem, setEnrichmentItem] = useState<Item | null>(null);

  // App Data
  const [items, setItems] = useState<Item[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [household, setHousehold] = useState<Household | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const loadData = useCallback(async () => {
    if (!getAuthToken()) return;
    setIsLoading(true);
    try {
      const [itemsRes, roomsRes, householdRes, dashboardRes] = await Promise.all([
        api.getItems(),
        api.getRooms(),
        api.getHousehold(),
        api.getDashboard(),
      ]);
      setItems(itemsRes);
      setRooms(roomsRes);
      setHousehold(householdRes);
      setDashboardData(dashboardRes);
    } catch (err: any) {
      console.error('Failed to load inventory data:', err);
      if (err.status === 401) {
        api.logout();
        setIsAuthenticated(false);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated, loadData]);

  const handleLogout = () => {
    api.logout();
    setIsAuthenticated(false);
    setItems([]);
    setRooms([]);
    setHousehold(null);
    setDashboardData(null);
  };

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return <AuthPage onAuthSuccess={handleAuthSuccess} />;
  }

  const show90Warning = dashboardData?.freemium?.show_warning ?? false;
  const totalItemsCount = dashboardData?.total_items ?? items.length;

  return (
    <ChainedAddProvider>
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        {/* Navigation Bar Header */}
        <Navbar
          household={household}
          totalItems={totalItemsCount}
          show90Warning={show90Warning}
        />

        {/* Main Content Area */}
        <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 pb-24">
          {isLoading && items.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-16 text-slate-400 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
              <span className="text-sm">Chargement de votre inventaire...</span>
            </div>
          ) : (
            <>
              {activeTab === 'overview' && (
                <OverviewPage
                  rooms={rooms}
                  items={items}
                  onOpenFastAdd={() => setIsFastAddOpen(true)}
                  onSelectItem={(item) => setEnrichmentItem(item)}
                />
              )}

              {activeTab === 'dressing' && (
                <DressingPage
                  items={items}
                  onOpenFastAdd={() => setIsFastAddOpen(true)}
                  onItemUpdated={loadData}
                  onSelectItem={(item) => setEnrichmentItem(item)}
                />
              )}

              {activeTab === 'dashboard' && (
                <DashboardPage
                  data={dashboardData}
                  onOpenFastAdd={() => setIsFastAddOpen(true)}
                />
              )}

              {activeTab === 'settings' && (
                <SettingsPage
                  household={household}
                  rooms={rooms}
                  onHouseholdUpdated={loadData}
                  onLogout={handleLogout}
                />
              )}
            </>
          )}
        </main>

        {/* Mobile-first Bottom Navigation with 44px+ touch targets */}
        <BottomNav
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenFastAdd={() => setIsFastAddOpen(true)}
        />

        {/* Fast-Add Modal (< 10s add, < 5s chained add) */}
        <FastAddModal
          isOpen={isFastAddOpen}
          onClose={() => setIsFastAddOpen(false)}
          rooms={rooms}
          onItemAdded={() => {
            loadData();
          }}
        />

        {/* Marc "Compléter plus tard" item enrichment modal */}
        <ItemEnrichmentModal
          item={enrichmentItem}
          onClose={() => setEnrichmentItem(null)}
          onItemUpdated={() => {
            setEnrichmentItem(null);
            loadData();
          }}
        />
      </div>
    </ChainedAddProvider>
  );
};
