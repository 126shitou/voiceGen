'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Clock, FileText, VolumeX } from 'lucide-react';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const loading = status === 'loading';
  const user = session?.user;
  const router = useRouter();

  // Redirect if not logged in
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-[60vh]">Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="container py-10 px-4 mx-auto">
      <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
      <p className="text-muted-foreground mb-8">Manage your voice conversions and account</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Characters Used</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,340 / 100,000</div>
            <p className="text-xs text-muted-foreground">For the current billing period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Audio Generated</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">13</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Saved Voices</CardTitle>
            <VolumeX className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">+ 1 custom voice</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Current Plan</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Pro</div>
            <p className="text-xs text-muted-foreground">Renews on Apr 21, 2025</p>
          </CardContent>
        </Card>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Recent Conversions</h2>
        <Card>
          <CardHeader>
            <CardDescription>
              Your recent text-to-speech conversions will appear here
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="border-t">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-center justify-between p-4 border-b">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      Speech Sample {item}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {item === 1 ? 'Emma (English)' : item === 2 ? 'William (English)' : '李明 (Chinese)'}
                    </p>
                  </div>
                  <div className="text-sm text-muted-foreground mr-4">
                    {item === 1 ? '2 hours ago' : item === 2 ? 'Yesterday' : '3 days ago'}
                  </div>
                  <div className="flex space-x-2">
                    <button className="text-primary hover:text-primary/80 p-1">
                      {/* <Play className="h-4 w-4" /> */}
                    </button>
                    <button className="text-primary hover:text-primary/80 p-1">
                      <FileText className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}