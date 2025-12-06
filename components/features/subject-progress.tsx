interface SubjectProgressProps {
  subjects: Array<{
    name: string;
    progress: number;
    color: string;
  }>;
}

export function SubjectProgress({ subjects }: SubjectProgressProps) {
  // Use passed subjects or empty array/skeleton if loading (handled by parent typically, but good to be safe)
  const displaySubjects = subjects.length > 0 ? subjects : [];

  return (
    <div className="glass-card">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold">Subject Mastery</h3>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {displaySubjects.map((subject, index) => (
          <div key={index} className="flex flex-col items-center text-center">
            {/* Circular Progress Chart */}
            <div className="relative mb-3">
              <svg
                className="w-20 h-20 transform -rotate-90"
                viewBox="0 0 100 100"
              >
                {/* Background circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="8"
                  fill="none"
                />
                {/* Progress circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke={getColorValue(subject.color)}
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 40}
                  strokeDashoffset={
                    2 * Math.PI * 40 * (1 - subject.progress / 100)
                  }
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold">{subject.progress}%</span>
              </div>
            </div>

            <p className="text-sm text-muted-foreground font-medium">
              {subject.name}
            </p>
          </div>
        ))}
      </div>

      {/* Progress Legend */}
      <div className="mt-6 pt-6 border-t border-white/10">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Mastery Level</span>
          <span>Completion</span>
        </div>
        <div className="mt-2 space-y-2">
          {displaySubjects.map((subject, index) => (
            <div key={index} className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: getColorValue(subject.color) }}
                />
                <span className="text-sm">{subject.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-20 bg-white/10 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-1000 ease-out"
                    style={{
                      width: `${subject.progress}%`,
                      backgroundColor: getColorValue(subject.color),
                    }}
                  />
                </div>
                <span className="text-sm font-medium w-8">
                  {subject.progress}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Helper function to get color values
function getColorValue(color: string): string {
  const colors: { [key: string]: string } = {
    'neon-blue': '#00f0ff',
    'neon-purple': '#bd00ff',
    'neon-green': '#00ff94',
    'neon-pink': '#ff0055',
  };
  return colors[color] || '#ffffff';
}
