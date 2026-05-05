import MobileRequirements from './mobile-requirements';
import DesktopRequirements from './desktop-requirements';

export default function RequirementsPage() {
  return (
    <>
      <div className="block lg:hidden">
        <MobileRequirements />
      </div>
      <div className="hidden lg:block">
        <DesktopRequirements />
      </div>
    </>
  );
}
