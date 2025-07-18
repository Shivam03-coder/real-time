import type { AnalyticsData, Visitor, Session, ChartData, CountryFilter } from '@/types/analytics';

// Generate dummy visitors
export const generateDummyVisitors = (): Visitor[] => {
  const countries = ['India', 'USA', 'UK', 'Canada', 'Australia', 'Germany', 'France', 'Japan', 'Brazil', 'Netherlands'];
  const pages = ['/', '/products', '/about', '/contact', '/pricing', '/blog', '/features', '/support', '/login', '/signup'];
  
  return Array.from({ length: 35 }, (_, i) => ({
    id: `visitor-${i + 1}`,
    sessionId: `session-${Math.floor(i / 4) + 1}`,
    country: countries[Math.floor(Math.random() * countries.length)],
    timestamp: new Date(Date.now() - Math.random() * 7200000).toISOString(), // Last 2 hours
    page: pages[Math.floor(Math.random() * pages.length)],
    isActive: Math.random() > 0.4 // 60% chance of being active
  }));
};

// Generate dummy sessions
export const generateDummySessions = (): Session[] => {
  const countries = ['India', 'USA', 'UK', 'Canada', 'Australia', 'Germany', 'France', 'Japan', 'Brazil', 'Netherlands'];
  const pages = ['/', '/products', '/about', '/contact', '/pricing', '/blog', '/features', '/support', '/login', '/signup'];
  
  return Array.from({ length: 12 }, (_, i) => {
    const pageCount = Math.floor(Math.random() * 6) + 1; // 1-6 pages per session
    const startTime = new Date(Date.now() - Math.random() * 10800000); // Last 3 hours
    const country = countries[Math.floor(Math.random() * countries.length)];
    
    return {
      sessionId: `session-${i + 1}`,
      country,
      startTime: startTime.toISOString(),
      lastActivity: new Date(startTime.getTime() + Math.random() * 3600000).toISOString(),
      isActive: Math.random() > 0.3, // 70% chance of being active
      pages: Array.from({ length: pageCount }, (_, j) => ({
        page: pages[Math.floor(Math.random() * pages.length)],
        timestamp: new Date(startTime.getTime() + j * 180000 + Math.random() * 120000).toISOString(), // 3-5 min intervals
        duration: Math.floor(Math.random() * 400) + 60 // 60-460 seconds
      }))
    };
  });
};

// Generate chart data for last 10 minutes
export const generateChartData = (): ChartData[] => {
  const data: ChartData[] = [];
  const now = new Date();
  
  for (let i = 9; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60000); // Each minute
    const baseVisitors = 15 + Math.floor(Math.random() * 25); // 15-40 base visitors
    const timeBoost = i < 3 ? Math.floor(Math.random() * 15) : 0; // Recent activity boost
    
    data.push({
      time: time.toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      visitors: baseVisitors + timeBoost
    });
  }
  
  return data;
};

// Generate country filter data
export const generateCountryFilters = (): CountryFilter[] => {
  const visitors = generateDummyVisitors();
  const countryCount: Record<string, number> = {};
  
  visitors.forEach(visitor => {
    countryCount[visitor.country] = (countryCount[visitor.country] || 0) + 1;
  });
  
  return Object.entries(countryCount)
    .map(([country, count]) => ({ country, count }))
    .sort((a, b) => b.count - a.count); // Sort by count descending
};

// Generate page filter data
export const generatePageFilters = () => {
  const visitors = generateDummyVisitors();
  const pageCount: Record<string, number> = {};
  
  visitors.forEach(visitor => {
    pageCount[visitor.page] = (pageCount[visitor.page] || 0) + 1;
  });
  
  return Object.entries(pageCount)
    .map(([page, count]) => ({ page, count }))
    .sort((a, b) => b.count - a.count);
};

// Generate dummy analytics data
export const generateDummyAnalyticsData = (): AnalyticsData => {
  const visitors = generateDummyVisitors();
  const sessions = generateDummySessions();
  const chartData = generateChartData();
  
  const activeVisitors = visitors.filter(v => v.isActive).length;
  const activeSessions = sessions.filter(s => s.isActive);
  
  // Simulate connection status (mostly connected)
  const connectionStates: ('Connected' | 'Reconnecting' | 'Disconnected')[] = ['Connected', 'Reconnecting', 'Disconnected'];
  const connectionWeights = [0.8, 0.15, 0.05]; // 80% connected, 15% reconnecting, 5% disconnected
  const randomValue = Math.random();
  let connectionStatus: 'Connected' | 'Reconnecting' | 'Disconnected' = 'Connected';
  
  let cumulativeWeight = 0;
  for (let i = 0; i < connectionStates.length; i++) {
    cumulativeWeight += connectionWeights[i];
    if (randomValue <= cumulativeWeight) {
      connectionStatus = connectionStates[i];
      break;
    }
  }
  
  return {
    activeVisitors,
    totalVisitorsToday: visitors.length + Math.floor(Math.random() * 50), // Add some historical visitors
    connectedDashboards: Math.floor(Math.random() * 8) + 1, // 1-8 connected dashboards
    connectionStatus,
    recentVisitors: visitors
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 15), // Show 15 most recent
    activeSessions,
    visitorChart: chartData
  };
};

// Simulate real-time visitor activity
export const simulateNewVisitor = (): Visitor => {
  const countries = ['India', 'USA', 'UK', 'Canada', 'Australia', 'Germany', 'France', 'Japan', 'Brazil', 'Netherlands'];
  const pages = ['/', '/products', '/about', '/contact', '/pricing', '/blog', '/features', '/support', '/login', '/signup'];
  
  return {
    id: `visitor-${Date.now()}`,
    sessionId: `session-${Date.now()}`,
    country: countries[Math.floor(Math.random() * countries.length)],
    timestamp: new Date().toISOString(),
    page: pages[Math.floor(Math.random() * pages.length)],
    isActive: true
  };
};

// Simulate session page navigation
export const simulatePageNavigation = (sessionId: string, country: string) => {
  const pages = ['/', '/products', '/about', '/contact', '/pricing', '/blog', '/features', '/support', '/login', '/signup'];
  
  return {
    id: `visitor-${Date.now()}`,
    sessionId,
    country,
    timestamp: new Date().toISOString(),
    page: pages[Math.floor(Math.random() * pages.length)],
    isActive: true
  };
};

// Get random activity simulation data
export const getRandomActivityData = () => {
  const activityTypes = ['new_visitor', 'page_navigation', 'session_end'];
  const type = activityTypes[Math.floor(Math.random() * activityTypes.length)];
  
  switch (type) {
    case 'new_visitor':
      return {
        type: 'new_visitor',
        data: simulateNewVisitor()
      };
    case 'page_navigation':
      const sessions = generateDummySessions();
      const activeSession = sessions.find(s => s.isActive);
      if (activeSession) {
        return {
          type: 'page_navigation',
          data: simulatePageNavigation(activeSession.sessionId, activeSession.country)
        };
      }
      return {
        type: 'new_visitor',
        data: simulateNewVisitor()
      };
    case 'session_end':
      return {
        type: 'session_end',
        data: { sessionId: `session-${Math.floor(Math.random() * 12) + 1}` }
      };
    default:
      return {
        type: 'new_visitor',
        data: simulateNewVisitor()
      };
  }
};