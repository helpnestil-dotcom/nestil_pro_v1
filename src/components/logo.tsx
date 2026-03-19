import { Home } from 'lucide-react';
import Link from 'next/link';

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-2 text-xl font-bold text-primary ${className}`}>
      <Home className="h-6 w-6" />
      <span className="lowercase">nestil.in</span>
    </Link>
  );
}
