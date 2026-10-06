import { Routes, Route, Navigate } from 'react-router-dom';
import PreparationLayout from './layouts/PreparationLayout';

// Pages
import Dashboard from './pages/Dashboard';
import CompanyWiseIndex from './pages/CompanyWiseIndex';
import CompanyDetailPage from './pages/CompanyDetailPage';
import DsaPatternsPage from './pages/DsaPatternsPage';
import PackageWiseDsaPage from './pages/PackageWiseDsaPage';
import SQLSheetPage from './pages/SQLSheetPage';
import SystemDesignSheetPage from './pages/SystemDesignSheetPage';
import RolesIndex from './pages/RolesIndex';
import MostAskedIndex from './pages/MostAskedIndex';
import TechDetailPage from './pages/TechDetailPage';
import HRQuestionsPage from './pages/HRQuestionsPage';
import ColdEmailIndex from './pages/ColdEmailIndex';
import PlaceholderPage from './pages/PlaceholderPage';
import PlaylistsPage from './pages/PlaylistsPage';
import DSASheetsIndex from './pages/DSASheetsIndex';
import DSASheetView from './pages/DSASheetView';

export default function App() {
  return (
    <PreparationLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/preparation" replace />} />
        <Route path="/preparation" element={<Dashboard />} />

        {/* Sheets */}
        <Route path="/preparation/dsa-sheets" element={<DSASheetsIndex />} />
        <Route path="/preparation/dsa-sheets/:sheetId" element={<DSASheetView />} />
        
        <Route path="/preparation/company-wise-dsa-sheet" element={<CompanyWiseIndex />} />
        <Route path="/preparation/company-wise-dsa-sheet/:slug" element={<CompanyDetailPage />} />
        
        <Route path="/preparation/20-essential-dsa-patterns" element={<DsaPatternsPage />} />
        <Route path="/preparation/package-wise-dsa-sheet" element={<PackageWiseDsaPage />} />
        <Route path="/preparation/sql-sheet" element={<SQLSheetPage />} />
        <Route path="/preparation/system-design-sheet" element={<SystemDesignSheetPage />} />

        {/* Learning */}
        <Route path="/preparation/dsa-playlists" element={<PlaylistsPage slug="dsa-playlists" />} />
        <Route path="/preparation/dbms-playlists" element={<PlaylistsPage slug="dbms-playlists" />} />
        <Route path="/preparation/system-design-playlists" element={<PlaylistsPage slug="system-design-playlists" />} />

        {/* Resources */}
        <Route path="/preparation/role-wise" element={<RolesIndex />} />
        
        <Route path="/preparation/most-asked-questions" element={<MostAskedIndex />} />
        <Route path="/preparation/most-asked-questions/:slug" element={<TechDetailPage />} />
        
        <Route path="/preparation/hr-questions" element={<HRQuestionsPage />} />
        <Route path="/preparation/cold-email-templets" element={<ColdEmailIndex />} />
        
        <Route path="/preparation/notes" element={<PlaceholderPage title="Cool Notes" />} />
        <Route path="/preparation/resume-templates" element={<PlaceholderPage title="Resume Templates" />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/preparation" replace />} />
      </Routes>
    </PreparationLayout>
  );
}
