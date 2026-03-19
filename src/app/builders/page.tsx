import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Award } from 'lucide-react';

export default function BuildersPage() {
  return (
    <div className="flex items-center justify-center min-h-[80vh] bg-background">
      <Card className="w-full max-w-sm text-center">
        <CardHeader>
          <Award className="mx-auto h-12 w-12 text-primary" />
          <CardTitle className="mt-4">Top Verified Builders</CardTitle>
          <CardDescription>
            This page is connecting soon.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            A curated list of our most trusted building partners will be available here shortly.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
