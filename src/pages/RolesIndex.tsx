import { useState, useMemo } from 'react';
import { SearchBar, FilterTabs, PageHeader, CircularProgress, CompletionCheckbox, BookmarkButton } from '../components/ui';
import { useCompletionMap } from '../hooks/useStorage';
import rolesData from '../data/clean/roles.json';

const data = rolesData as {
  categories: Array<{
    title: string;
    roles: Array<{
      slug: string; displayName: string; category: string;
      metadata: { listName: string; totalQuestions: number; description: string; storageKey: string; };
      questions: Array<{ index: number; title: string; answer: string; }>;
    }>;
  }>;
};

export default function RolesIndex() {
  const [search, setSearch] = useState('');
  const [activeRole, setActiveRole] = useState(data.categories[0].roles[0].slug);

  const activeRoleData = useMemo(() => {
    for (const cat of data.categories) {
      const found = cat.roles.find(r => r.slug === activeRole);
      if (found) return found;
    }
    return data.categories[0].roles[0];
  }, [activeRole]);

  const { completed, bookmarked, toggleCompleted, toggleBookmark, completedCount } = useCompletionMap(activeRoleData.metadata.storageKey);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState('all');

  const filteredQuestions = useMemo(() => {
    let items = activeRoleData.questions || [];
    if (search) {
      const q = search.toLowerCase();
      items = items.filter(i => (i.title && i.title.toLowerCase().includes(q)) || (i.answer && i.answer.toLowerCase().includes(q)));
    }
    if (activeTab === 'bookmarked') items = items.filter(i => bookmarked[i.index]);
    return items;
  }, [activeRoleData.questions, search, activeTab, bookmarked]);

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'bookmarked', label: '⭐ Bookmarked' },
  ];

  return (
    <div className="min-h-screen pt-3 pb-10 flex flex-col md:flex-row gap-6 container mx-auto px-4">
      {/* Sidebar for Roles */}
      <div className="w-full md:w-64 shrink-0">
        <div className="sticky top-20 bg-white dark:bg-[#1a1a1a] rounded-xl border border-gray-200 dark:border-gray-800 p-4 max-h-[calc(100vh-6rem)] overflow-y-auto">
          {data.categories.map(cat => (
            <div key={cat.title} className="mb-6 last:mb-0">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">
                {cat.title}
              </h3>
              <div className="space-y-1">
                {cat.roles.map(role => (
                  <button
                    key={role.slug}
                    onClick={() => { setActiveRole(role.slug); setExpandedId(null); }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-[family-name:var(--font-lexend)] transition-colors
                      ${activeRole === role.slug
                        ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-medium'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800 hover:text-gray-900 dark:hover:text-white'
                      }`}
                  >
                    {role.displayName}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        <PageHeader
          title={activeRoleData.metadata.listName || `${activeRoleData.displayName} Interview Questions`}
          description={activeRoleData.metadata.description}
          stats={[{ label: 'Questions', value: activeRoleData.metadata.totalQuestions }]}
        />

        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <CircularProgress completed={completedCount} total={activeRoleData.metadata.totalQuestions} />
            <div>
              <div className="text-sm font-semibold text-gray-900 dark:text-white font-[family-name:var(--font-lexend)]">
                {completedCount} / {activeRoleData.metadata.totalQuestions}
              </div>
              <div className="text-xs text-gray-500">completed</div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <SearchBar value={search} onChange={setSearch} placeholder={`Search ${activeRoleData.displayName} questions...`} />
            <FilterTabs tabs={tabs} active={activeTab} onChange={setActiveTab} />
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden bg-white dark:bg-[#1a1a1a]">
          {filteredQuestions.length === 0 ? (
             <div className="py-12 text-center text-gray-500 text-sm">No questions found.</div>
          ) : (
            filteredQuestions.map(q => (
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
                      <div className="mt-3 ml-8 p-4 rounded-lg bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 prose dark:prose-invert max-w-none text-sm">
                        {/* We use dangerouslySetInnerHTML to render HTML answers properly */}
                        <div dangerouslySetInnerHTML={{ __html: q.answer }} />
                      </div>
                    )}
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
