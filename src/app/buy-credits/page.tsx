'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Coins } from 'lucide-react';
import Link from 'next/link';

export default function BuyCreditsDisabledPage() {
  return (
    <div className="flex items-center justify-center min-h-[80vh] bg-background">
      <Card className="w-full max-w-sm text-center">
        <CardHeader>
          <Coins className="mx-auto h-12 w-12 text-primary" />
          <CardTitle className="mt-4">Feature Disabled</CardTitle>
          <CardDescription>
            This feature is currently not available.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <Link href="/" className="text-sm underline">Go back to Homepage</Link>
        </CardContent>
      </Card>
    </div>
  );
}
