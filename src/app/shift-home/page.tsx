import MobileShiftHome from './mobile-shift-home';
import DesktopShiftHome from './desktop-shift-home';

export default function ShiftHomePage() {
  return (
    <>
      <div className="block lg:hidden">
        <MobileShiftHome />
      </div>
      <div className="hidden lg:block">
        <DesktopShiftHome />
      </div>
    </>
  );
}
