import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChange, placeholder = 'Search...' }: SearchBarProps) {
  return (
    <div className="relative w-full max-w-md">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-8 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors font-[family-name:var(--font-lexend)]"
      />
      {value && (
        <button onClick={() => onChange('')} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
          <X className="size-3 text-gray-400" />
        </button>
      )}
    </div>
  );
}

export function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const colors: Record<string, string> = {
    Easy: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/30',
    Beginner: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/30',
    Medium: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
    Intermediate: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
    Hard: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30',
    Advanced: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30',
  };
  const cls = colors[difficulty] || 'bg-gray-100 text-gray-600 border-gray-300';

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${cls} font-[family-name:var(--font-lexend)]`}>
      {difficulty}
    </span>
  );
}

export function PopularityBadge({ popularity }: { popularity?: string }) {
  if (!popularity) return null;
  const colors: Record<string, string> = {
    Hot: 'bg-red-500/10 text-red-500 border-red-500/30',
    Warm: 'bg-orange-500/10 text-orange-500 border-orange-500/30',
    Normal: 'bg-blue-500/10 text-blue-500 border-blue-500/30',
    Cold: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/30',
  };
  const cls = colors[popularity] || 'bg-gray-100 text-gray-600 border-gray-300';
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${cls}`}>
      {popularity === 'Hot' ? '🔥' : popularity === 'Warm' ? '🌡️' : ''} {popularity}
    </span>
  );
}

export function ProviderBadge({ provider, url }: { provider?: string; url?: string }) {
  if (!provider) return null;
  const isLeetCode = provider.toLowerCase().includes('leetcode') || provider.toLowerCase() === 'lc';
  const isGFG = provider.toLowerCase().includes('geeksforgeeks') || provider.toLowerCase().includes('gfg');
  const isYouTube = provider.toLowerCase().includes('youtube');

  let iconSrc = '';
  if (isLeetCode) iconSrc = 'https://upload.wikimedia.org/wikipedia/commons/1/19/LeetCode_logo_black.png';
  else if (isGFG) iconSrc = 'https://upload.wikimedia.org/wikipedia/commons/4/43/GeeksforGeeks.svg';
  else if (isYouTube) iconSrc = 'https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg';

  const badge = iconSrc ? (
    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white dark:bg-gray-100 p-1.5 shadow-sm border border-gray-200">
       <img src={iconSrc} alt={provider} className="w-full h-full object-contain" />
    </div>
  ) : (
    <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[10px] font-bold text-white bg-gray-500">
      {provider}
    </span>
  );

  if (url) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
        {badge}
      </a>
    );
  }
  return badge;
}

export function ProgressBar({ completed, total }: { completed: number; total: number }) {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 whitespace-nowrap font-[family-name:var(--font-lexend)]">
        {completed}/{total}
      </span>
    </div>
  );
}

export function CircularProgress({ completed, total, size = 80 }: { completed: number; total: number; size?: number }) {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  const r = (size - 8) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="currentColor"
          className="text-gray-100 dark:text-gray-800" strokeWidth={4} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="url(#progressGrad)"
          strokeWidth={4} strokeLinecap="round" strokeDasharray={circumference}
          strokeDashoffset={offset} className="transition-all duration-700" />
        <defs>
          <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-bold text-gray-900 dark:text-white font-[family-name:var(--font-lexend)]">{pct}%</span>
      </div>
    </div>
  );
}

export function FilterTabs({ tabs, active, onChange }: {
  tabs: { id: string; label: string }[];
  active: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="inline-flex items-center gap-1 p-1.5 bg-gray-100 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-full overflow-x-auto max-w-full">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`relative px-4 py-1.5 rounded-full text-xs font-semibold font-[family-name:var(--font-lexend)] transition-colors whitespace-nowrap cursor-pointer select-none
            ${active === tab.id
              ? 'bg-white dark:bg-zinc-800 border-2 border-black dark:border-white text-black dark:text-white shadow-sm'
              : 'text-gray-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export function PageHeader({ title, description, stats }: {
  title: string;
  description?: string;
  stats?: { label: string; value: string | number }[];
}) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl md:text-3xl font-bold font-[family-name:var(--font-lexend)] text-gray-900 dark:text-gray-100 mb-3">
        {title}
      </h1>
      {description && (
        <p className="text-gray-600 dark:text-gray-400 font-[family-name:var(--font-lexend)] mb-2 text-sm leading-relaxed line-clamp-2">
          {description}
        </p>
      )}
      {stats && stats.length > 0 && (
        <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 font-[family-name:var(--font-lexend)] mt-3 flex-wrap">
          {stats.map((s, i) => (
            <span key={i}>
              {i > 0 && <span className="mr-3">•</span>}
              <span className="font-semibold text-gray-700 dark:text-gray-300">{s.value}</span> {s.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export function CompletionCheckbox({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={`size-5 rounded border-2 flex items-center justify-center transition-all duration-200 cursor-pointer
        ${checked
          ? 'bg-green-500 border-green-500 text-white'
          : 'border-gray-300 dark:border-gray-600 hover:border-green-400'
        }`}
    >
      {checked && (
        <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      )}
    </button>
  );
}

export function BookmarkButton({ bookmarked, onClick }: { bookmarked: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`transition-colors cursor-pointer ${bookmarked ? 'text-yellow-500' : 'text-gray-300 dark:text-gray-600 hover:text-yellow-500'}`}
      title={bookmarked ? 'Remove bookmark' : 'Save question'}
    >
      <svg className="size-5" viewBox="0 0 24 24" fill={bookmarked ? 'currentColor' : 'none'}
        stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    </button>
  );
}

export function ExternalLinkButton({ url, label }: { url: string; label?: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 px-3 py-1 rounded-md text-xs font-medium bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors"
    >
      {label || 'Open'} ↗
    </a>
  );
}
