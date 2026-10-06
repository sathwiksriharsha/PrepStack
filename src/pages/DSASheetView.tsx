import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { PageHeader } from '../components/ui';
import { ProblemTable } from '../components/ProblemTable';
import striverData from '../data/clean/striver-a2z-clean.json';

export default function DSASheetView() {
  const { sheetId } = useParams();
  
  const isStriver = sheetId === 'striver-a2z-dsa-sheet';
  const data = isStriver ? striverData : {
    title: sheetId?.split('-').join(' ') + ' (Coming Soon)',
    description: 'We are currently adding this sheet to the local database.',
    totalProblems: 0,
    sections: []
  };

  const [expandedTopic, setExpandedTopic] = useState<string | null>(
    (data.sections[0]?.topic as string) || null
  );
  
  const [expandedSubTopic, setExpandedSubTopic] = useState<string | null>(
    (data.sections[0]?.subTopic as string) || null
  );

  // Group problems by topic and subtopic
  const groupedByTopic = useMemo(() => {
    let globalIndex = 1;
    const groups: { topic: string, totalQuestions: number, subTopics: { subTopic: string, questions: any[] }[] }[] = [];
    
    const topicMap = new Map();
    
    data.sections.forEach(sec => {
      const topic = (sec.topic as string) || 'General';
      const subTopic = (sec.subTopic as string) || 'General Practice';
      
      if (!topicMap.has(topic)) {
        const newGroup = { topic, totalQuestions: 0, subTopics: [] };
        topicMap.set(topic, newGroup);
        groups.push(newGroup);
      }
      
      const group = topicMap.get(topic);
      
      const subQuestions = sec.problems?.map(p => ({
         index: globalIndex++,
         title: p.title as string,
         tags: [subTopic],
         difficulty: p.difficulty as string,
         provider: p.platform === 'tuf' ? 'YouTube' : p.platform as string | undefined,
         providerUrl: (p.platform === 'tuf' ? p.resource || p.problemUrl : p.problemUrl) as string | undefined,
      })) || [];
      
      group.totalQuestions += subQuestions.length;
      group.subTopics.push({ subTopic, questions: subQuestions });
    });
    
    return groups;
  }, [data.sections]);

  const toggleTopic = (topic: string) => {
    setExpandedTopic(expandedTopic === topic ? null : topic);
  };

  const toggleSubTopic = (subTopic: string) => {
    setExpandedSubTopic(expandedSubTopic === subTopic ? null : subTopic);
  };

  return (
    <div className="min-h-screen pt-3 pb-10">
      <div className="container mx-auto px-4">
        <PageHeader 
          title={data.title}
          description={data.description}
          stats={[{ label: 'Total Problems', value: data.totalProblems }]}
        />
        
        {groupedByTopic.length > 0 ? (
          <div className="mt-6 space-y-4">
            {groupedByTopic.map((group, idx) => {
              const isTopicExpanded = expandedTopic === group.topic;
              return (
                <div key={idx} className="flex flex-col">
                  {/* Topic Accordion Header */}
                  <button 
                    className={`w-full flex items-center justify-between p-4 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors ${isTopicExpanded ? 'rounded-t-xl border-b-0' : 'rounded-xl shadow-sm'}`}
                    onClick={() => toggleTopic(group.topic)}
                  >
                    <h3 className="font-semibold text-gray-900 dark:text-white font-[family-name:var(--font-lexend)] text-left flex-1 pr-4">
                      {group.topic}
                    </h3>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded-md">
                        {group.totalQuestions} Problems
                      </span>
                      <svg className={`w-5 h-5 text-gray-400 transition-transform ${isTopicExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </button>
                  
                  {/* Topic Content (SubTopics) */}
                  {isTopicExpanded && (
                    <div className="border border-gray-200 dark:border-gray-800 border-t-0 rounded-b-xl overflow-hidden bg-gray-50/50 dark:bg-black/20 p-4 space-y-3">
                      {group.subTopics.map((sub, sIdx) => {
                        const isSubExpanded = expandedSubTopic === sub.subTopic;
                        return (
                           <div key={sIdx} className="flex flex-col">
                              {/* SubTopic Accordion Header */}
                              <button 
                                className={`w-full flex items-center justify-between p-3 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${isSubExpanded ? 'rounded-t-lg border-b-0' : 'rounded-lg shadow-sm'}`}
                                onClick={() => toggleSubTopic(sub.subTopic)}
                              >
                                <h4 className="font-medium text-sm text-gray-800 dark:text-gray-200 font-[family-name:var(--font-lexend)] text-left flex-1 pr-4">
                                  {sub.subTopic}
                                </h4>
                                <div className="flex items-center gap-2 shrink-0">
                                  <span className="text-[10px] font-semibold text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
                                    {sub.questions.length} / {sub.questions.length}
                                  </span>
                                  <svg className={`w-4 h-4 text-gray-400 transition-transform ${isSubExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                  </svg>
                                </div>
                              </button>
                              
                              {/* SubTopic Content (Problems) */}
                              {isSubExpanded && (
                                <div className="border border-gray-200 dark:border-gray-700 rounded-b-lg overflow-hidden bg-white dark:bg-[#1a1a1a]">
                                  <ProblemTable 
                                    title={sub.subTopic}
                                    questions={sub.questions}
                                    storageKey={`dsa-sheet-${sheetId}`}
                                    totalQuestions={sub.questions.length}
                                    showPopularity={false}
                                    showProvider={true}
                                    showTags={false}
                                  />
                                </div>
                              )}
                           </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
           <div className="flex items-center justify-center min-h-[40vh] border border-dashed border-gray-300 dark:border-gray-700 rounded-xl mt-6">
             <p className="text-gray-500 font-[family-name:var(--font-lexend)]">This sheet's content is not locally available yet.</p>
           </div>
        )}
      </div>
    </div>
  );
}
