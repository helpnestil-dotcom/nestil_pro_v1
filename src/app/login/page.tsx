import MobileLogin from './mobile-login';
import DesktopLogin from './desktop-login';

export default function LoginPage() {
  return (
    <>
      <div className="block lg:hidden">
        <MobileLogin />
      </div>
      <div className="hidden lg:block">
        <DesktopLogin />
      </div>
    </>
  );
}
