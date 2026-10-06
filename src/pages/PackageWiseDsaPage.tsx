import { useState, useMemo } from 'react';
import { ProblemTable } from '../components/ProblemTable';
import { FilterTabs } from '../components/ui';
import packageData from '../data/clean/package-dsa.json';

const data = packageData as {
  title: string; description: string; totalQuestions: number; storageKey: string;
  packages: Array<{ id: string; label: string; description: string }>;
  questions: Array<{ id: number; title: string; difficulty: string; package: string; topic: string; leetcode: string; gfg: string; }>;
};

export default function PackageWiseDsaPage() {
  const [activePackage, setActivePackage] = useState('all');

  const mappedQuestions = useMemo(() => {
    let q = data.questions;
    if (activePackage !== 'all') {
      q = q.filter(item => item.package === activePackage);
    }

    return q.map((q, i) => ({
      index: i + 1,
      title: q.title,
      tags: [q.topic],
      extraBadge: data.packages.find(p => p.id === q.package)?.label || q.package,
      difficulty: q.difficulty,
      provider: q.leetcode ? 'LeetCode' : q.gfg ? 'GFG' : undefined,
      providerUrl: q.leetcode || q.gfg || undefined,
    }));
  }, [activePackage]);

  const packageTabs = [
    { id: 'all', label: 'All Packages' },
    ...data.packages.map(p => ({ id: p.id, label: p.label })),
  ];

  return (
    <div>
       <div className="container mx-auto px-4 pt-4">
        <FilterTabs tabs={packageTabs} active={activePackage} onChange={setActivePackage} />
       </div>
      <ProblemTable
        title={data.title}
        description={data.description}
        questions={mappedQuestions}
        storageKey={data.storageKey}
        totalQuestions={mappedQuestions.length} // Dynamically update total
        showPopularity={false}
        showProvider={true}
        showTags={true}
        extraBadgeLabel="Package"
      />
    </div>
  );
}
