'use client';

import React, { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { LoaderCircle } from 'lucide-react';

function SignupRedirector() {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    // Redirect to the new unified login page, preserving any redirect params
    React.useEffect(() => {
        const redirect = searchParams.get('redirect');
        const loginUrl = redirect ? `/login?redirect=${redirect}` : '/login';
        router.replace(loginUrl);
    }, [router, searchParams]);

    // Show a loader while redirecting
    return (
        <div className="flex min-h-[80vh] items-center justify-center bg-background">
            <LoaderCircle className="h-12 w-12 animate-spin text-primary" />
        </div>
    );
}

export default function SignupPage() {
    return (
        <Suspense fallback={
            <div className="flex min-h-[80vh] items-center justify-center bg-background">
                <LoaderCircle className="h-12 w-12 animate-spin text-primary" />
            </div>
        }>
            <SignupRedirector />
        </Suspense>
    );
}
