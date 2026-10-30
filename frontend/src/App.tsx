import React, { useState, useEffect, useCallback } from 'react';
import { getAuthToken } from './api/client.js';
import { api } from './api/items.api.js';
import { Item, Room, Household, DashboardData } from './types/inventory.types.js';
import { ChainedAddProvider } from './context/ChainedAddContext.js';
import { Navbar } from './components/layout/Navbar.js';
import { BottomNav } from './components/layout/BottomNav.js';
import { Footer } from './components/layout/Footer.js';
import { OverviewPage } from './pages/OverviewPage.js';
import { DressingPage } from './pages/DressingPage.js';
import { DashboardPage } from './pages/DashboardPage.js';
import { SettingsPage } from './pages/SettingsPage.js';
import { AuthPage } from './pages/AuthPage.js';
import { FastAddModal } from './components/fast-add/FastAddModal.js';
import { DressingAddModal } from './components/dressing/DressingAddModal.js';
import { ItemEnrichmentModal } from './components/inventory/ItemEnrichmentModal.js';
import { SubscriptionModal } from './components/subscription/SubscriptionModal.js';
import { LegalModal } from './components/legal/LegalModal.js';
import { LegalTabKey } from './content/legalData.js';
import { Loader2 } from 'lucide-react';

export const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!getAuthToken());
  const [activeTab, setActiveTab] = useState<'overview' | 'dressing' | 'dashboard' | 'settings'>('overview');

  // Modals state
  const [isFastAddOpen, setIsFastAddOpen] = useState(false);
  const [isDressingAddOpen, setIsDressingAddOpen] = useState(false);
  const [enrichmentItem, setEnrichmentItem] = useState<Item | null>(null);
  const [isSubscriptionOpen, setIsSubscriptionOpen] = useState(false);
  const [activeLegalTab, setActiveLegalTab] = useState<LegalTabKey | null>(null);

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

  const handleOpenAdd = () => {
    if (activeTab === 'dressing') {
      setIsDressingAddOpen(true);
    } else {
      setIsFastAddOpen(true);
    }
  };

  if (!isAuthenticated) {
    return <AuthPage onAuthSuccess={handleAuthSuccess} />;
  }

  const show90Warning = dashboardData?.freemium?.show_warning ?? false;
  const totalItemsCount = dashboardData?.total_items ?? items.length;

  return (
    <ChainedAddProvider>
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        {/* Navigation Bar Header (Responsive with desktop tabs & actions) */}
        <Navbar
          household={household}
          totalItems={totalItemsCount}
          show90Warning={show90Warning}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenFastAdd={() => setIsFastAddOpen(true)}
          onOpenDressingAdd={() => setIsDressingAddOpen(true)}
          onOpenSubscription={() => setIsSubscriptionOpen(true)}
        />

        {/* Main Content Area: Responsive container up to max-w-7xl on desktop */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
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
                  onOpenDressingAdd={() => setIsDressingAddOpen(true)}
                  onItemUpdated={loadData}
                  onSelectItem={(item) => setEnrichmentItem(item)}
                />
              )}

              {activeTab === 'dashboard' && (
                <DashboardPage
                  data={dashboardData}
                  onOpenFastAdd={() => setIsFastAddOpen(true)}
                  onOpenSubscription={() => setIsSubscriptionOpen(true)}
                />
              )}

              {activeTab === 'settings' && (
                <SettingsPage
                  household={household}
                  rooms={rooms}
                  onHouseholdUpdated={loadData}
                  onLogout={handleLogout}
                  onOpenSubscription={() => setIsSubscriptionOpen(true)}
                />
              )}
            </>
          )}
        </main>

        {/* Interactive Global Footer with Legal Links & Compliance */}
        <Footer onOpenLegal={(tab) => setActiveLegalTab(tab)} />

        {/* Mobile-first Bottom Navigation (Hidden on desktop md+, visible on mobile) */}
        <BottomNav
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenAdd={handleOpenAdd}
        />

        {/* Generic Item Fast-Add Modal (< 10s add, < 5s chained add) */}
        <FastAddModal
          isOpen={isFastAddOpen}
          onClose={() => setIsFastAddOpen(false)}
          rooms={rooms}
          onItemAdded={() => {
            loadData();
          }}
        />

        {/* Dedicated Dressing Modal (specific to clothing, lifecycle & metadata) */}
        <DressingAddModal
          isOpen={isDressingAddOpen}
          onClose={() => setIsDressingAddOpen(false)}
          rooms={rooms}
          onItemAdded={() => {
            loadData();
          }}
        />

        {/* Item enrichment modal */}
        <ItemEnrichmentModal
          item={enrichmentItem}
          onClose={() => setEnrichmentItem(null)}
          onItemUpdated={() => {
            setEnrichmentItem(null);
            loadData();
          }}
        />

        {/* Fake Payment & Subscription Modal (US1 & US2) */}
        <SubscriptionModal
          isOpen={isSubscriptionOpen}
          onClose={() => setIsSubscriptionOpen(false)}
          household={household}
          onSubscriptionUpdated={loadData}
          onOpenLegal={(tab) => setActiveLegalTab(tab)}
        />

        {/* Legal Modal: CGV, CGU, Mentions Légales, RGPD */}
        <LegalModal
          isOpen={!!activeLegalTab}
          initialTab={activeLegalTab || 'cgv'}
          onClose={() => setActiveLegalTab(null)}
        />
      </div>
    </ChainedAddProvider>
  );
};
