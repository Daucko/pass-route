import Image from 'next/image';

// components/features/ticker.tsx
export function Ticker() {
  const tickerItems = [
    { avatar: 'Felix', text: 'User923 scored 98% in Physics' },
    { avatar: 'Aneka', text: 'User101 scored 94% in Math' },
    { avatar: 'Mark', text: 'User882 scored 96% in Chem' },
    { avatar: 'Sarah', text: 'User771 scored 99% in Bio' },
    { avatar: 'John', text: 'User554 scored 92% in English' },
  ];

  return (
    <div className="w-full overflow-hidden bg-black/30 py-4 my-10 border-y border-white/10 mask-gradient">
      <div className="flex animate-scroll">
        {[...tickerItems, ...tickerItems].map((item, index) => (
          <div key={index} className="flex items-center gap-3 px-8 shrink-0">
            <Image
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${item.avatar}`}
              alt="User"
              width={24}
              height={24}
              className="rounded-full"
            />
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              {item.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
