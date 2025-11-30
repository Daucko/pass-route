// components/layout/background-blobs.tsx
export function BackgroundBlobs() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="absolute w-[600px] h-[600px] -top-48 -left-24 bg-radial from-neon-purple to-transparent opacity-40 blur-3xl rounded-full animate-float-blob" />
      <div className="absolute w-[500px] h-[500px] -bottom-24 -right-24 bg-radial from-neon-blue to-transparent opacity-40 blur-3xl rounded-full animate-float-blob animation-delay-[-5s]" />
      <div className="absolute w-[400px] h-[400px] top-2/5 left-1/3 bg-radial from-neon-green to-transparent opacity-20 blur-3xl rounded-full animate-float-blob animation-delay-[-10s]" />
    </div>
  );
}
