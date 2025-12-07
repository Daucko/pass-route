import Image from 'next/image';
import { BackgroundBlobs } from '@/components/layout/background-blobs';
import { cn } from '@/lib/utils';

const podiumUsers = [
  { rank: 2, name: 'Sarah J.', xp: '2,450', avatar: 'User2', type: 'silver' },
  { rank: 1, name: 'Michael T.', xp: '3,100', avatar: 'User3', type: 'gold' },
  { rank: 3, name: 'David L.', xp: '2,100', avatar: 'User4', type: 'bronze' },
];

const rankUsers = [
  { rank: 4, name: 'Emily R.', level: 'Lvl 8', xp: '1,950', avatar: 'User5' },
  {
    rank: 5,
    name: 'Alex Doe (You)',
    level: 'Lvl 5',
    xp: '1,250',
    avatar: 'User1',
  },
  { rank: 6, name: 'Chris P.', level: 'Lvl 4', xp: '1,100', avatar: 'User6' },
  { rank: 7, name: 'Jessica M.', level: 'Lvl 4', xp: '980', avatar: 'User7' },
];

export default function Leaderboard() {
  return (
    <>
      <BackgroundBlobs />

      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 lg:gap-0 mb-6 lg:mb-10">
        <div className="w-full lg:w-auto">
          <h1 className="text-2xl lg:text-3xl font-bold mb-2">Leaderboard 🏆</h1>
          <p className="text-muted-foreground">
            See where you stand among the best.
          </p>
        </div>
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="glass-panel flex items-center gap-3 px-4 lg:px-5 py-3 rounded-full flex-1 lg:flex-none lg:w-80">
            <i className="fa-solid fa-search text-muted-foreground" />
            <input
              type="text"
              placeholder="Search users..."
              className="bg-transparent border-none outline-none text-white w-full placeholder:text-muted-foreground text-sm lg:text-base"
            />
          </div>
          <button className="glass-panel w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center border border-white/10 flex-shrink-0">
            <i className="fa-solid fa-bell text-sm lg:text-base" />
          </button>
        </div>
      </header>

      <div className="space-y-6 lg:space-y-8">
        {/* Podium */}
        <div className="flex justify-center items-end gap-4 lg:gap-8">
          {podiumUsers.map((user) => (
            <div
              key={user.rank}
              className="flex flex-col items-center text-center flex-1 max-w-[120px] lg:max-w-none"
            >
              {user.type === 'gold' && (
                <div className="text-2xl lg:text-3xl text-yellow-400 mb-2 animate-float">
                  <i className="fa-solid fa-crown" />
                </div>
              )}

              <div className="relative mb-3 lg:mb-4">
                <Image
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.avatar}`}
                  alt={user.name}
                  width={80}
                  height={80}
                  className={cn(
                    'w-16 h-16 lg:w-20 lg:h-20 rounded-full border-4',
                    user.type === 'gold'
                      ? 'border-yellow-400 shadow-[0_0_20px_rgba(255,215,0,0.3)]'
                      : user.type === 'silver'
                        ? 'border-gray-400'
                        : 'border-amber-700'
                  )}
                />
                <div
                  className={cn(
                    'absolute -bottom-1 -right-1 w-6 h-6 lg:w-8 lg:h-8 rounded-full flex items-center justify-center font-bold text-black text-xs lg:text-sm',
                    user.type === 'gold'
                      ? 'bg-yellow-400'
                      : user.type === 'silver'
                        ? 'bg-gray-400'
                        : 'bg-amber-700'
                  )}
                >
                  {user.rank}
                </div>
              </div>

              <div className="mb-3 lg:mb-4">
                <h3 className="font-semibold text-sm lg:text-lg">{user.name}</h3>
                <p className="text-muted-foreground text-xs lg:text-sm">{user.xp} XP</p>
              </div>

              <div
                className={cn(
                  'w-full max-w-[80px] lg:w-24 rounded-t-lg',
                  user.type === 'gold'
                    ? 'h-24 lg:h-36 bg-gradient-to-b from-yellow-400/10 to-yellow-400/02 border-t-yellow-400'
                    : user.type === 'silver'
                      ? 'h-20 lg:h-24 bg-gradient-to-b from-gray-400/10 to-gray-400/02 border-t-gray-400'
                      : 'h-16 lg:h-20 bg-gradient-to-b from-amber-700/10 to-amber-700/02 border-t-amber-700'
                )}
              />
            </div>
          ))}
        </div>

        {/* Rank List */}
        <div className="glass-card p-0 overflow-hidden">
          <div className="hidden lg:grid grid-cols-4 gap-4 p-6 bg-white/5 border-b border-white/10 font-semibold text-muted-foreground">
            <span>Rank</span>
            <span>User</span>
            <span>Level</span>
            <span>XP</span>
          </div>

          {/* Mobile Header */}
          <div className="lg:hidden grid grid-cols-3 gap-4 p-4 bg-white/5 border-b border-white/10 font-semibold text-muted-foreground text-sm">
            <span>User</span>
            <span className="text-center">Level</span>
            <span className="text-right">XP</span>
          </div>

          <div className="divide-y divide-white/5">
            {rankUsers.map((user) => (
              <div
                key={user.rank}
                className="grid grid-cols-3 lg:grid-cols-4 gap-4 p-4 lg:p-6 transition-colors hover:bg-white/5"
              >
                {/* Rank - Hidden on mobile */}
                <span className="hidden lg:flex font-bold text-muted-foreground items-center">
                  {user.rank}
                </span>

                <div className="flex items-center gap-3 lg:gap-4 col-span-2 lg:col-span-1">
                  <div className="relative">
                    <Image
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.avatar}`}
                      alt={user.name}
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full"
                    />
                    {/* Rank indicator for mobile */}
                    <div className="lg:hidden absolute -top-2 -left-2 w-6 h-6 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-xs font-bold">
                      {user.rank}
                    </div>
                  </div>
                  <span className="text-sm lg:text-base truncate">{user.name}</span>
                </div>

                <span className="text-neon-blue font-semibold text-sm lg:text-base text-center lg:text-left">
                  {user.level}
                </span>
                <span className="font-semibold font-mono text-sm lg:text-base text-right">
                  {user.xp}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}