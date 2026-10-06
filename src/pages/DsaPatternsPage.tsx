import { useState, useMemo } from 'react';
import { PageHeader, CircularProgress, DifficultyBadge, CompletionCheckbox, ProviderBadge, BookmarkButton, SearchBar, FilterTabs } from '../components/ui';
import { useCompletionMap } from '../hooks/useStorage';
import dsaPatternsData from '../data/clean/dsa-patterns.json';

const data = dsaPatternsData as {
  title: string; description: string; creatorName: string; totalProblems: number; storageKey: string; hasVideoLinks: boolean;
  sections: Array<{
    topic: string; subTopic: string;
    problems: Array<{ id: string; title: string; problemUrl: string; platform: string; difficulty: string; videoUrl: string | null; }>;
  }>;
};

export default function DsaPatternsPage() {
  const { completed, bookmarked, toggleCompleted, toggleBookmark, completedCount } = useCompletionMap(data.storageKey);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const filteredSections = useMemo(() => {
    return data.sections.map(section => {
      let items = section.problems;
      if (search) {
        const q = search.toLowerCase();
        items = items.filter(i => i.title.toLowerCase().includes(q));
      }
      if (activeTab === 'easy') items = items.filter(i => i.difficulty === 'Easy');
      else if (activeTab === 'medium') items = items.filter(i => i.difficulty === 'Medium');
      else if (activeTab === 'hard') items = items.filter(i => i.difficulty === 'Hard');
      else if (activeTab === 'bookmarked') items = items.filter(i => bookmarked[i.id]);

      return { ...section, problems: items };
    }).filter(s => s.problems.length > 0);
  }, [search, activeTab, bookmarked]);

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'easy', label: 'Easy' },
    { id: 'medium', label: 'Medium' },
    { id: 'hard', label: 'Hard' },
    { id: 'bookmarked', label: '⭐ Bookmarked' },
  ];

  return (
    <div className="min-h-screen pt-3 pb-10">
      <div className="container mx-auto px-4">
        <PageHeader
          title={data.title}
          description={data.description}
          stats={[{ label: 'Problems', value: data.totalProblems }, { label: 'Creator', value: data.creatorName }]}
        />

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <CircularProgress completed={completedCount} total={data.totalProblems} />
            <div>
              <div className="text-sm font-semibold text-gray-900 dark:text-white font-[family-name:var(--font-lexend)]">
                {completedCount} / {data.totalProblems}
              </div>
              <div className="text-xs text-gray-500">completed</div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <SearchBar value={search} onChange={setSearch} placeholder="Search patterns..." />
            <FilterTabs tabs={tabs} active={activeTab} onChange={setActiveTab} />
          </div>
        </div>

        <div className="space-y-6">
          {filteredSections.map((section, idx) => {
            const sectionCompletedCount = section.problems.filter(p => completed[p.id]).length;
            const isSectionComplete = sectionCompletedCount === section.problems.length && section.problems.length > 0;

            return (
              <div key={idx} className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="bg-gray-50 dark:bg-[#111] px-4 py-3 flex items-center justify-between border-b border-gray-200 dark:border-gray-800">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white font-[family-name:var(--font-lexend)] flex items-center gap-2">
                       {isSectionComplete && <span className="text-green-500">✓</span>}
                      {section.topic}
                    </h3>
                    <p className="text-xs text-gray-500">{section.subTopic}</p>
                  </div>
                  <div className="text-xs font-semibold text-gray-500">
                    {sectionCompletedCount} / {section.problems.length}
                  </div>
                </div>

                <div>
                   {section.problems.map((q, pIdx) => (
                      <div key={q.id} className="border-b border-gray-200 dark:border-gray-800 last:border-b-0">
                        <div className="hidden md:flex items-center py-3 px-4 hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors gap-4">
                          <div className="w-10 flex justify-center">
                            <CompletionCheckbox checked={!!completed[q.id]} onChange={() => toggleCompleted(q.id)} />
                          </div>
                          <div className="flex-1 min-w-0 pl-1">
                            <div className="flex items-start gap-2">
                              <span className="font-semibold text-gray-400 text-xs w-6 text-right mr-1 shrink-0">{pIdx + 1}.</span>
                              <a href={q.problemUrl} target="_blank" rel="noopener noreferrer"
                                className={`font-medium text-sm leading-normal no-underline hover:text-orange-600 dark:hover:text-orange-400 font-[family-name:var(--font-lexend)] ${completed[q.id] ? 'line-through text-gray-400' : 'text-gray-900 dark:text-gray-100'}`}>
                                {q.title}
                              </a>
                            </div>
                          </div>
                          <div className="w-20 flex justify-center">
                            <ProviderBadge provider={q.platform} url={q.problemUrl} />
                          </div>
                          <div className="w-24 flex justify-center">
                            <DifficultyBadge difficulty={q.difficulty} />
                          </div>
                           <div className="w-10 flex justify-center">
                            <BookmarkButton bookmarked={!!bookmarked[q.id]} onClick={() => toggleBookmark(q.id)} />
                          </div>
                        </div>
                         {/* Mobile Row */}
                        <div className="md:hidden flex items-start gap-3 py-3 px-3">
                          <CompletionCheckbox checked={!!completed[q.id]} onChange={() => toggleCompleted(q.id)} />
                          <div className="flex-1 min-w-0">
                            <a href={q.problemUrl} target="_blank" rel="noopener noreferrer"
                                className={`font-[family-name:var(--font-lexend)] text-sm block mb-1 no-underline font-medium leading-snug ${completed[q.id] ? 'line-through text-gray-400' : 'text-gray-900 dark:text-gray-100 hover:text-orange-600'}`}>
                                {pIdx + 1}. {q.title}
                            </a>
                            <div className="flex items-center gap-2 flex-wrap mt-1.5">
                              <ProviderBadge provider={q.platform} url={q.problemUrl} />
                              <DifficultyBadge difficulty={q.difficulty} />
                            </div>
                          </div>
                          <BookmarkButton bookmarked={!!bookmarked[q.id]} onClick={() => toggleBookmark(q.id)} />
                        </div>
                      </div>
                   ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
