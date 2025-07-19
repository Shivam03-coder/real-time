import { ConnectionStatus } from "@/components/analytics/connection-status";

export default function Dashboard() {
  return (
    <div className="container mx-auto space-y-6 p-6">
      {/* <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Real-time visitor analytics and insights
          </p>
        </div>
        <Button variant="outline" onClick={handleClearStats}>
          <RotateCcw className="mr-2 h-4 w-4" />
          Clear Stats
        </Button>
      </div> */}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-1">
          <ConnectionStatus />
          {/* 
          <VisitorCounter
            activeVisitors={analyticsData.activeVisitors}
            totalVisitorsToday={analyticsData.totalVisitorsToday}
          />

          <VisitorChart data={analyticsData.visitorChart} /> */}

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* <VisitorFeed
              visitors={analyticsData.recentVisitors}
              selectedCountry={selectedCountry}
            />

            <ActiveSessions
              sessions={analyticsData.activeSessions}
              onSessionClick={handleSessionClick}
            /> */}
          </div>
        </div>

        <div className="space-y-6">
          {/* <CountryFilterComponent
            countries={countryFilters}
            selectedCountry={selectedCountry}
            onCountrySelect={handleCountrySelect}
            onClearFilter={handleClearFilter}
          /> */}
        </div>
      </div>
    </div>
  );
}
