'use client';

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { CalendarCheck } from 'lucide-react';

export default function VisitRequestsPage() {
  
  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <CalendarCheck /> Visit Requests
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>Feature Disabled</CardTitle>
          <CardDescription>
            This feature is not currently available.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-16 border-dashed border-2 rounded-lg">
              <h2 className="text-xl font-semibold">No visit requests found.</h2>
              <p className="text-muted-foreground mt-2">
                This feature has been disabled.
              </p>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
