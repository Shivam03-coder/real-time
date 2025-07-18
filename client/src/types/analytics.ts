export interface Visitor {
    id: string;
    sessionId: string;
    country: string;
    timestamp: string;
    page: string;
    isActive: boolean;
  }
  
  export interface Session {
    sessionId: string;
    country: string;
    pages: PageView[];
    startTime: string;
    lastActivity: string;
    isActive: boolean;
  }
  
  export interface PageView {
    page: string;
    timestamp: string;
    duration?: number;
  }
  
  export interface AnalyticsData {
    activeVisitors: number;
    totalVisitorsToday: number;
    connectedDashboards: number;
    connectionStatus: 'Connected' | 'Reconnecting' | 'Disconnected';
    recentVisitors: Visitor[];
    activeSessions: Session[];
    visitorChart: ChartData[];
  }
  
  export interface ChartData {
    time: string;
    visitors: number;
  }
  
  export interface CountryFilter {
    country: string;
    count: number;
  }