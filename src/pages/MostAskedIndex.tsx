import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { SearchBar } from '../components/ui';
import mostAskedData from '../data/clean/most-asked-index.json';

const data = mostAskedData as {
  categories: Array<{
    title: string;
    questions: Array<{
      title: string; icon: string; href: string;
      description: string; questionCount: number;
    }>;
  }>;
};

export default function MostAskedIndex() {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search) return data.categories;
    const q = search.toLowerCase();
    return data.categories.map(cat => ({
      ...cat,
      questions: cat.questions.filter(item =>
        item.title.toLowerCase().includes(q) || item.description?.toLowerCase().includes(q)
      ),
    })).filter(cat => cat.questions.length > 0);
  }, [search]);

  return (
    <div className="min-h-screen pt-3 pb-10">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold font-[family-name:var(--font-lexend)] text-gray-900 dark:text-gray-100 mb-3">
            Most Asked Interview Questions
          </h1>
          <p className="text-gray-600 dark:text-gray-400 font-[family-name:var(--font-lexend)] text-sm">
            4,531 questions across 28 technologies and core subjects.
          </p>
        </div>

        <div className="mb-6">
          <SearchBar value={search} onChange={setSearch} placeholder="Search technologies..." />
        </div>

        {filtered.map(cat => (
          <div key={cat.title} className="mb-8">
            <h2 className="text-lg font-semibold font-[family-name:var(--font-lexend)] text-gray-900 dark:text-white mb-4">
              {cat.title}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {cat.questions.map(item => {
                const slug = item.href.split('/').filter(Boolean).pop()!;
                return (
                  <Link
                    key={slug}
                    to={item.href}
                    className="group block rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a1a1a] p-4 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-lg transition-all duration-200 no-underline"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="size-10 rounded-lg bg-gray-50 dark:bg-gray-800 flex items-center justify-center overflow-hidden border border-gray-200 dark:border-gray-700">
                        <img
                          src={`https://hynts.in${item.icon}`}
                          alt={item.title}
                          className="size-7 object-contain"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm font-[family-name:var(--font-lexend)] truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                          {item.title}
                        </h3>
                        <span className="text-xs text-gray-500">{item.questionCount} Questions</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{item.description}</p>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
