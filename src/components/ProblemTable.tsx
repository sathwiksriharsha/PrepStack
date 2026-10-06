import { useState, useMemo } from 'react';
import {
  SearchBar, DifficultyBadge, PopularityBadge, ProviderBadge,
  CircularProgress, FilterTabs, PageHeader,
  CompletionCheckbox, BookmarkButton,
} from './ui';
import { useCompletionMap } from '../hooks/useStorage';

interface Question {
  index: number;
  title: string;
  tags?: string[];
  provider?: string;
  providerUrl?: string;
  difficulty?: string;
  popularity?: string;
  extraBadge?: string;
}

interface ProblemTableProps {
  title: string;
  description?: string;
  questions: Question[];
  storageKey: string;
  totalQuestions: number;
  showPopularity?: boolean;
  showProvider?: boolean;
  showTags?: boolean;
  extraBadgeLabel?: string;
}

export function ProblemTable({
  title, description, questions, storageKey, totalQuestions,
  showPopularity = true, showProvider = true, showTags = true,
  extraBadgeLabel,
}: ProblemTableProps) {
  const { completed, bookmarked, toggleCompleted, toggleBookmark, completedCount } = useCompletionMap(storageKey);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const filtered = useMemo(() => {
    let items = questions;
    if (search) {
      const q = search.toLowerCase();
      items = items.filter(i => i.title.toLowerCase().includes(q) || i.tags?.some(t => t.toLowerCase().includes(q)));
    }
    if (activeTab === 'easy') items = items.filter(i => i.difficulty === 'Easy');
    else if (activeTab === 'medium') items = items.filter(i => i.difficulty === 'Medium');
    else if (activeTab === 'hard') items = items.filter(i => i.difficulty === 'Hard');
    else if (activeTab === 'hot') items = items.filter(i => i.popularity === 'Hot');
    else if (activeTab === 'bookmarked') items = items.filter(i => bookmarked[i.index]);
    return items;
  }, [questions, search, activeTab, bookmarked]);

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'easy', label: 'Easy' },
    { id: 'medium', label: 'Medium' },
    { id: 'hard', label: 'Hard' },
    ...(showPopularity ? [{ id: 'hot', label: '🔥 Hot' }] : []),
    { id: 'bookmarked', label: '⭐ Bookmarked' },
  ];

  const diffStats = useMemo(() => {
    const stats: Record<string, { total: number; completed: number }> = {};
    questions.forEach(q => {
      const d = q.difficulty || 'Unknown';
      if (!stats[d]) stats[d] = { total: 0, completed: 0 };
      stats[d].total++;
      if (completed[q.index]) stats[d].completed++;
    });
    return stats;
  }, [questions, completed]);

  return (
    <div className="min-h-screen pt-3 pb-10">
      <div className="container mx-auto px-4">
        <PageHeader title={title} description={description}
          stats={[
            { label: 'Problems', value: totalQuestions },
            ...Object.entries(diffStats).map(([d, s]) => ({ label: d, value: `${s.completed}/${s.total}` })),
          ]}
        />

        {/* Progress + Filters */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <CircularProgress completed={completedCount} total={totalQuestions} />
            <div>
              <div className="text-sm font-semibold text-gray-900 dark:text-white font-[family-name:var(--font-lexend)]">
                {completedCount} / {totalQuestions}
              </div>
              <div className="text-xs text-gray-500">completed</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <SearchBar value={search} onChange={setSearch} placeholder="Search problems..." />
            <FilterTabs tabs={tabs} active={activeTab} onChange={setActiveTab} />
          </div>
        </div>

        {/* Problem Table */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden bg-white dark:bg-[#1a1a1a]">
          {/* Desktop Header */}
          <div className="hidden md:flex items-center px-4 py-3 border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-[#111] text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider gap-4">
            <div className="w-10 text-center">Status</div>
            <div className="flex-1 pl-2">Problem</div>
            {showTags && <div className="w-28 pl-1">Topic</div>}
            {extraBadgeLabel && <div className="w-24 text-center">{extraBadgeLabel}</div>}
            {showProvider && <div className="w-20 text-center">Practice</div>}
            {showPopularity && <div className="w-20 text-center">Freq.</div>}
            <div className="w-24 text-center">Difficulty</div>
            <div className="w-10 text-center">Save</div>
          </div>

          {/* Rows */}
          {filtered.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-gray-500 dark:text-gray-400 font-[family-name:var(--font-lexend)] text-sm">
                No problems match your search/filter.
              </p>
              <button onClick={() => { setSearch(''); setActiveTab('all'); }}
                className="mt-2 text-indigo-500 hover:underline text-xs cursor-pointer">
                Clear filters
              </button>
            </div>
          ) : (
            filtered.map(q => (
              <div key={q.index} className="border-b border-gray-200 dark:border-gray-800 last:border-b-0">
                {/* Desktop Row */}
                <div className="hidden md:flex items-center py-3 px-4 hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors gap-4">
                  <div className="w-10 flex justify-center">
                    <CompletionCheckbox checked={!!completed[q.index]} onChange={() => toggleCompleted(q.index)} />
                  </div>
                  <div className="flex-1 min-w-0 pl-1">
                    <div className="flex items-start gap-2">
                      <span className="font-semibold text-gray-400 text-xs w-6 text-right mr-1 shrink-0">{q.index}.</span>
                      {q.providerUrl ? (
                        <a href={q.providerUrl} target="_blank" rel="noopener noreferrer"
                          className={`font-medium text-sm leading-normal no-underline hover:text-orange-600 dark:hover:text-orange-400 font-[family-name:var(--font-lexend)] ${completed[q.index] ? 'line-through text-gray-400' : 'text-gray-900 dark:text-gray-100'}`}>
                          {q.title}
                        </a>
                      ) : (
                        <span className={`font-medium text-sm leading-normal font-[family-name:var(--font-lexend)] ${completed[q.index] ? 'line-through text-gray-400' : 'text-gray-900 dark:text-gray-100'}`}>
                          {q.title}
                        </span>
                      )}
                    </div>
                  </div>
                  {showTags && (
                    <div className="w-28 flex items-center gap-1 overflow-hidden">
                      {q.tags?.slice(0, 2).map(t => (
                        <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800/60 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 whitespace-nowrap">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                  {showProvider && (
                    <div className="w-20 flex justify-center">
                      <ProviderBadge provider={q.provider} url={q.providerUrl} />
                    </div>
                  )}
                  {q.extraBadge && (
                    <div className="w-24 flex justify-center">
                       <span className="inline-flex items-center rounded-md bg-purple-50 dark:bg-purple-400/10 px-2 py-1 text-xs font-medium text-purple-700 dark:text-purple-400 ring-1 ring-inset ring-purple-700/10 dark:ring-purple-400/30 whitespace-nowrap">
                         {q.extraBadge}
                       </span>
                    </div>
                  )}
                  {showPopularity && (
                    <div className="w-20 flex justify-center">
                      <PopularityBadge popularity={q.popularity} />
                    </div>
                  )}
                  <div className="w-24 flex justify-center">
                    <DifficultyBadge difficulty={q.difficulty || 'Medium'} />
                  </div>
                  <div className="w-10 flex justify-center">
                    <BookmarkButton bookmarked={!!bookmarked[q.index]} onClick={() => toggleBookmark(q.index)} />
                  </div>
                </div>

                {/* Mobile Row */}
                <div className="md:hidden flex items-start gap-3 py-3 px-3">
                  <CompletionCheckbox checked={!!completed[q.index]} onChange={() => toggleCompleted(q.index)} />
                  <div className="flex-1 min-w-0">
                    {q.providerUrl ? (
                      <a href={q.providerUrl} target="_blank" rel="noopener noreferrer"
                        className={`font-[family-name:var(--font-lexend)] text-sm block mb-1 no-underline font-medium leading-snug ${completed[q.index] ? 'line-through text-gray-400' : 'text-gray-900 dark:text-gray-100 hover:text-orange-600'}`}>
                        {q.index}. {q.title}
                      </a>
                    ) : (
                      <span className={`font-[family-name:var(--font-lexend)] text-sm block mb-1 font-medium ${completed[q.index] ? 'line-through text-gray-400' : 'text-gray-900 dark:text-gray-100'}`}>
                        {q.index}. {q.title}
                      </span>
                    )}
                    <div className="flex items-center gap-2 flex-wrap mt-1.5">
                      {q.provider && <ProviderBadge provider={q.provider} url={q.providerUrl} />}
                      {q.extraBadge && (
                        <span className="inline-flex items-center rounded-md bg-purple-50 dark:bg-purple-400/10 px-2 py-1 text-[10px] font-medium text-purple-700 dark:text-purple-400 ring-1 ring-inset ring-purple-700/10 dark:ring-purple-400/30 whitespace-nowrap">
                          {q.extraBadge}
                        </span>
                      )}
                      <DifficultyBadge difficulty={q.difficulty || 'Medium'} />
                      {q.popularity && <PopularityBadge popularity={q.popularity} />}
                    </div>
                  </div>
                  <BookmarkButton bookmarked={!!bookmarked[q.index]} onClick={() => toggleBookmark(q.index)} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
