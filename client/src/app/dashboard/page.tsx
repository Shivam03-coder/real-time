import { ConnectionStatus } from "@/components/analytics/connection-status";
import EventTable from "@/components/analytics/event-table";
import SessionCards from "@/components/analytics/session-cards";
import { VisitorDashboard } from "@/components/analytics/visitor-board";
import VisitorsChart from "@/components/analytics/visitor-chart";

export default function Dashboard() {
  return (
    <div className="mx-auto w-[96%] space-y-6 p-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div>
          <ConnectionStatus />
        </div>
        <VisitorsChart />
      </div>
      <h1>FOR ALL USER ALL SESSIONS </h1>
      <VisitorDashboard />
      <h1>FOR CURRENT USER ACTIVE SESSION</h1>
      <SessionCards />
      <EventTable />
    </div>
  );
}
