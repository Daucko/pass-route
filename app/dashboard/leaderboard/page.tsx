// app/leaderboard/page.tsx
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

      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold mb-2">Leaderboard 🏆</h1>
          <p className="text-muted-foreground">
            See where you stand among the best.
          </p>
        </div>
        <div className="flex items-center gap-5">
          <div className="glass-panel flex items-center gap-3 px-5 py-3 rounded-full w-80">
            <i className="fa-solid fa-search text-muted-foreground" />
            <input
              type="text"
              placeholder="Search users..."
              className="bg-transparent border-none outline-none text-white w-full placeholder:text-muted-foreground"
            />
          </div>
          <button className="glass-panel w-12 h-12 rounded-full flex items-center justify-center border border-white/10">
            <i className="fa-solid fa-bell" />
          </button>
        </div>
      </header>

      <div className="space-y-8">
        {/* Podium */}
        <div className="flex justify-center items-end gap-8">
          {podiumUsers.map((user) => (
            <div
              key={user.rank}
              className="flex flex-col items-center text-center"
            >
              {user.type === 'gold' && (
                <div className="text-3xl text-yellow-400 mb-2 animate-float">
                  <i className="fa-solid fa-crown" />
                </div>
              )}

              <div className="relative mb-4">
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.avatar}`}
                  alt={user.name}
                  className={cn(
                    'w-20 h-20 rounded-full border-4',
                    user.type === 'gold'
                      ? 'border-yellow-400 shadow-[0_0_20px_rgba(255,215,0,0.3)]'
                      : user.type === 'silver'
                      ? 'border-gray-400'
                      : 'border-amber-700'
                  )}
                />
                <div
                  className={cn(
                    'absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center font-bold text-black text-sm',
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

              <div className="mb-4">
                <h3 className="font-semibold text-lg">{user.name}</h3>
                <p className="text-muted-foreground">{user.xp} XP</p>
              </div>

              <div
                className={cn(
                  'w-24 rounded-t-lg',
                  user.type === 'gold'
                    ? 'h-36 bg-gradient-to-b from-yellow-400/10 to-yellow-400/02 border-t-yellow-400'
                    : user.type === 'silver'
                    ? 'h-24 bg-gradient-to-b from-gray-400/10 to-gray-400/02 border-t-gray-400'
                    : 'h-20 bg-gradient-to-b from-amber-700/10 to-amber-700/02 border-t-amber-700'
                )}
              />
            </div>
          ))}
        </div>

        {/* Rank List */}
        <div className="glass-card p-0 overflow-hidden">
          <div className="grid grid-cols-4 gap-4 p-6 bg-white/5 border-b border-white/10 font-semibold text-muted-foreground">
            <span>Rank</span>
            <span>User</span>
            <span>Level</span>
            <span>XP</span>
          </div>

          <div className="divide-y divide-white/5">
            {rankUsers.map((user) => (
              <div
                key={user.rank}
                className="grid grid-cols-4 gap-4 p-6 transition-colors hover:bg-white/5"
              >
                <span className="font-bold text-muted-foreground">
                  {user.rank}
                </span>
                <div className="flex items-center gap-4">
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.avatar}`}
                    alt={user.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <span>{user.name}</span>
                </div>
                <span className="text-neon-blue font-semibold">
                  {user.level}
                </span>
                <span className="font-semibold font-mono">{user.xp}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
