"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { RotateCcw } from 'lucide-react';
import { ConnectionStatus } from '@/components/analytics/connection-status';
import { VisitorCounter } from '@/components/analytics/visitor-counter';
import { VisitorFeed } from '@/components/analytics/visitor-feed';
import { ActiveSessions } from '@/components/analytics/active-session';
import { VisitorChart } from '@/components/analytics/visitor-chart';
import { CountryFilterComponent } from '@/components/analytics/country-filter';
import { SessionDetails } from '@/components/analytics/filter-details';
import type { AnalyticsData, Session } from '@/types/analytics';
import { generateDummySessions,generateDummyVisitors,generateDummyAnalyticsData,generateCountryFilters } from '@/lib/dummy-data';      

export default function Dashboard() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string>();
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [showSessionDetails, setShowSessionDetails] = useState(false);

  useEffect(() => {
    const loadData = () => {
      setAnalyticsData(generateDummyAnalyticsData());
    };

    loadData();
    
    // Simulate real-time updates
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSessionClick = (session: Session) => {
    setSelectedSession(session);
    setShowSessionDetails(true);
  };

  const handleClearStats = () => {
    setAnalyticsData(generateDummyAnalyticsData());
    setSelectedCountry(undefined);
  };

  const handleCountrySelect = (country: string) => {
    setSelectedCountry(selectedCountry === country ? undefined : country);
  };

  const handleClearFilter = () => {
    setSelectedCountry(undefined);
  };

  if (!analyticsData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RotateCcw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading analytics data...</p>
        </div>
      </div>
    );
  }

  const countryFilters = generateCountryFilters();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Real-time visitor analytics and insights</p>
        </div>
        <Button variant="outline" onClick={handleClearStats}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Clear Stats
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ConnectionStatus 
            status={analyticsData.connectionStatus} 
            connectedDashboards={analyticsData.connectedDashboards} 
          />
          
          <VisitorCounter 
            activeVisitors={analyticsData.activeVisitors}
            totalVisitorsToday={analyticsData.totalVisitorsToday}
          />
          
          <VisitorChart data={analyticsData.visitorChart} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <VisitorFeed 
              visitors={analyticsData.recentVisitors}
              selectedCountry={selectedCountry}
            />
            
            <ActiveSessions 
              sessions={analyticsData.activeSessions}
              onSessionClick={handleSessionClick}
            />
          </div>
        </div>

        <div className="space-y-6">
          <CountryFilterComponent
            countries={countryFilters}
            selectedCountry={selectedCountry}
            onCountrySelect={handleCountrySelect}
            onClearFilter={handleClearFilter}
          />
        </div>
      </div>

      <SessionDetails
        session={selectedSession}
        open={showSessionDetails}
        onClose={() => setShowSessionDetails(false)}
      />
    </div>
  );
}