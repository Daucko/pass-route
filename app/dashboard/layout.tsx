import { Sidebar } from '@/components/layout/sidebar';
import { BackgroundBlobs } from '@/components/layout/background-blobs';
import { UserSyncProvider } from '@/components/providers/user-sync-provider';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserSyncProvider>
      <BackgroundBlobs />
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 lg:ml-80 p-4 lg:p-8 pt-16 lg:pt-8"> {/* Reduced from pt-20 to pt-16 */}
          {children}
        </main>
      </div>
    </UserSyncProvider>
  );
}