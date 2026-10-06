import { ProblemTable } from '../components/ProblemTable';
import sqlData from '../data/clean/sql.json';

const data = sqlData as {
  title: string; description: string; totalQuestions: number; storageKey: string;
  questions: Array<{ index: number; title: string; answer: string; difficulty: string; category: string; }>;
};

// Map SQL queries to ProblemTable format
const mappedQuestions = data.questions.map(q => ({
  index: q.index,
  title: q.title,
  tags: [q.category],
  difficulty: q.difficulty,
  popularity: 'Hot', // Default for SQL sheet
  providerUrl: `https://www.google.com/search?q=SQL+${encodeURIComponent(q.title)}`,
}));

export default function SQLSheetPage() {
  return (
    <ProblemTable
      title={data.title}
      description={data.description}
      questions={mappedQuestions}
      storageKey={data.storageKey}
      totalQuestions={data.totalQuestions}
      showPopularity={true}
      showProvider={false}
      showTags={true}
    />
  );
}
