import MobileDashboard from './mobile-dashboard';
import DesktopDashboard from './desktop-dashboard';

export default function DashboardPage() {
  return (
    <>
      <div className="block lg:hidden">
        <MobileDashboard />
      </div>
      <div className="hidden lg:block">
        <DesktopDashboard />
      </div>
    </>
  );
}
