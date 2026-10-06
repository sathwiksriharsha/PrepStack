import { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { SearchBar, DifficultyBadge, FilterTabs, PageHeader, CircularProgress, CompletionCheckbox, BookmarkButton } from '../components/ui';
import { useCompletionMap } from '../hooks/useStorage';
import techQuestionsData from '../data/clean/tech-questions.json';

const allTechQuestions = techQuestionsData as Record<string, {
  title: string; description: string; icon: string;
  totalQuestions: number; storageKey: string; slug: string; href: string; category: string;
  questions: Array<{
    index: number; title: string; answer: string;
    difficulty: string; category: string;
  }>;
}>;

export default function TechDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const data = slug ? allTechQuestions[slug] : null;

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-gray-500">Subject not found.</p>
      </div>
    );
  }

  return <TechQuestionsRenderer data={data} />;
}

function TechQuestionsRenderer({ data }: { data: typeof allTechQuestions[string] }) {
  const { completed, bookmarked, toggleCompleted, toggleBookmark, completedCount } = useCompletionMap(data.storageKey);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const filtered = useMemo(() => {
    let items = data.questions;
    if (search) {
      const q = search.toLowerCase();
      items = items.filter(i => i.title.toLowerCase().includes(q) || i.answer?.toLowerCase().includes(q));
    }
    if (activeTab === 'bookmarked') items = items.filter(i => bookmarked[i.index]);
    else if (activeTab !== 'all') items = items.filter(i => i.difficulty?.toLowerCase() === activeTab);
    return items;
  }, [data.questions, search, activeTab, bookmarked]);

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'beginner', label: 'Beginner' },
    { id: 'intermediate', label: 'Intermediate' },
    { id: 'advanced', label: 'Advanced' },
    { id: 'bookmarked', label: '⭐ Bookmarked' },
  ];

  return (
    <div className="min-h-screen pt-3 pb-10">
      <div className="container mx-auto px-4">
        <PageHeader title={data.title} description={data.description}
          stats={[{ label: 'Questions', value: data.totalQuestions }]}
        />

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <CircularProgress completed={completedCount} total={data.totalQuestions} />
            <div>
              <div className="text-sm font-semibold text-gray-900 dark:text-white font-[family-name:var(--font-lexend)]">
                {completedCount} / {data.totalQuestions}
              </div>
              <div className="text-xs text-gray-500">completed</div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <SearchBar value={search} onChange={setSearch} placeholder="Search questions..." />
            <FilterTabs tabs={tabs} active={activeTab} onChange={setActiveTab} />
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden bg-white dark:bg-[#1a1a1a]">
          {filtered.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-gray-500 text-sm">No questions match your filter.</p>
            </div>
          ) : (
            filtered.map(q => (
              <div key={q.index} className="border-b border-gray-200 dark:border-gray-800 last:border-b-0">
                <div className="flex items-start gap-3 py-3 px-4 hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                  <div className="mt-0.5">
                    <CompletionCheckbox checked={!!completed[q.index]} onChange={() => toggleCompleted(q.index)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <button
                      onClick={() => setExpandedId(expandedId === q.index ? null : q.index)}
                      className="w-full text-left cursor-pointer"
                    >
                      <div className="flex items-start gap-2">
                        <span className="font-semibold text-gray-400 text-xs w-6 text-right mr-1 shrink-0 mt-0.5">{q.index}.</span>
                        <span className={`font-medium text-sm font-[family-name:var(--font-lexend)] ${completed[q.index] ? 'line-through text-gray-400' : 'text-gray-900 dark:text-gray-100'}`}>
                          {q.title}
                        </span>
                      </div>
                    </button>
                    {expandedId === q.index && q.answer && (
                      <div className="mt-3 ml-8 p-4 rounded-lg bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                          {q.answer}
                        </p>
                      </div>
                    )}
                    <div className="flex items-center gap-2 mt-1.5 ml-8">
                      {q.difficulty && <DifficultyBadge difficulty={q.difficulty} />}
                      {q.category && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 border border-gray-200 dark:border-gray-700">
                          {q.category}
                        </span>
                      )}
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
