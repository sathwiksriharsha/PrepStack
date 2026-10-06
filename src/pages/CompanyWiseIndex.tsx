import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { SearchBar, ProgressBar } from '../components/ui';
import companiesData from '../data/clean/companies.json';

const companies = companiesData as Array<{
  id: string; name: string; description: string;
  questionCount: number; logoSrc: string; href: string; index: number;
}>;

export default function CompanyWiseIndex() {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search) return companies;
    const q = search.toLowerCase();
    return companies.filter(c => c.name.toLowerCase().includes(q));
  }, [search]);

  return (
    <div className="min-h-screen pt-3 pb-10">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold font-[family-name:var(--font-lexend)] text-gray-900 dark:text-gray-100 mb-3">
            Company Wise DSA Sheet
          </h1>
          <p className="text-gray-600 dark:text-gray-400 font-[family-name:var(--font-lexend)] text-sm leading-relaxed line-clamp-2">
            Practice company-specific DSA interview questions. Each sheet contains the most frequently asked coding problems for that company.
          </p>
          <div className="flex items-center gap-3 text-sm text-gray-500 font-[family-name:var(--font-lexend)] mt-3">
            <span className="font-semibold text-gray-700 dark:text-gray-300">{companies.length} Companies</span>
            <span>•</span>
            <span>2,593 Total Problems</span>
          </div>
        </div>

        <div className="mb-6">
          <SearchBar value={search} onChange={setSearch} placeholder="Search companies..." />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(company => {
            const slug = company.id;
            const stored = localStorage.getItem(`company-dsa-${slug.replace(/-dsa-interview-questions$/, '')}-completed`);
            const completedCount = stored ? Object.values(JSON.parse(stored)).filter(Boolean).length : 0;

            return (
              <Link
                key={company.id}
                to={`/preparation/company-wise-dsa-sheet/${company.id}`}
                className="group block rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a1a1a] p-4 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-lg transition-all duration-200 no-underline"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="size-10 rounded-lg bg-gray-50 dark:bg-gray-800 flex items-center justify-center overflow-hidden border border-gray-200 dark:border-gray-700">
                    <img
                      src={`https://hynts.in${company.logoSrc}`}
                      alt={company.name}
                      className="size-7 object-contain"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm font-[family-name:var(--font-lexend)] truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {company.name}
                    </h3>
                    <span className="text-xs text-gray-500">{company.questionCount} Problems</span>
                  </div>
                </div>
                <ProgressBar completed={completedCount} total={company.questionCount} />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
