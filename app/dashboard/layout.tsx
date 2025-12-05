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
        <main className="flex-1 ml-80 p-8">{children}</main>
      </div>
    </UserSyncProvider>
  );
}
