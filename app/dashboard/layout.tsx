// app/dashboard/layout.tsx
import { Sidebar } from '@/components/layout/sidebar';
import { BackgroundBlobs } from '@/components/layout/background-blobs';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BackgroundBlobs />
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 ml-80 p-8">{children}</main>
      </div>
    </>
  );
}
