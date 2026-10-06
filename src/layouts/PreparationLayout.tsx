import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  PanelsTopLeft, FileCode, Building2, Fingerprint, BadgeDollarSign,
  Database, Boxes, MonitorPlay, BookOpen, Users, Sparkles, MessageSquare,
  Mail, NotebookText, FileText, ChevronRight, Menu, X, Moon, Sun,
} from 'lucide-react';
import { useTheme } from '../hooks/useStorage';

const iconMap: Record<string, React.ElementType> = {
  PanelsTopLeft, FileCode, Building2, Fingerprint, BadgeDollarSign,
  Database, Boxes, MonitorPlay, BookOpen, Users, Sparkles, MessageSquare,
  Mail, NotebookText, FileText,
};

interface NavItem {
  label: string;
  href: string;
  icon: string;
  children?: NavItem[];
}

interface NavGroup {
  label: string;
  hasIndicator?: boolean;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    label: '',
    items: [
      { label: 'Dashboard', href: '/preparation', icon: 'PanelsTopLeft' },
    ],
  },
  {
    label: 'Sheets',
    items: [
      { label: 'DSA Sheets', href: '/preparation/dsa-sheets', icon: 'FileCode',
        children: [
          { label: 'Striver SDE Sheet', href: '/preparation/dsa-sheets/striver-sde-sheet', icon: 'FileCode' },
          { label: 'Blind 75', href: '/preparation/dsa-sheets/blind-75', icon: 'FileCode' },
        ] },
      { label: 'Company Wise DSA', href: '/preparation/company-wise-dsa-sheet', icon: 'Building2' },
      { label: '20 DSA Patterns', href: '/preparation/20-essential-dsa-patterns', icon: 'Fingerprint' },
      { label: 'Package Wise DSA', href: '/preparation/package-wise-dsa-sheet', icon: 'BadgeDollarSign' },
      { label: 'SQL Sheet', href: '/preparation/sql-sheet', icon: 'Database' },
      { label: 'System Design Sheet', href: '/preparation/system-design-sheet', icon: 'Boxes' },
    ],
  },
  {
    label: 'Start Learning',
    items: [
      { label: 'DSA Playlists', href: '/preparation/dsa-playlists', icon: 'MonitorPlay' },
      { label: 'Core Subjects', href: '/preparation/dbms-playlists', icon: 'BookOpen' },
      { label: 'System Design Playlists', href: '/preparation/system-design-playlists', icon: 'Boxes' },
    ],
  },
  {
    label: 'Resources',
    hasIndicator: true,
    items: [
      { label: 'Role Wise', href: '/preparation/role-wise', icon: 'Users' },
      { label: 'Interview Questions', href: '/preparation/most-asked-questions', icon: 'Sparkles' },
      { label: 'HR Questions', href: '/preparation/hr-questions', icon: 'MessageSquare' },
      { label: 'Cold Email Templates', href: '/preparation/cold-email-templets', icon: 'Mail' },
      { label: 'Cool Notes', href: '/preparation/notes', icon: 'NotebookText' },
      { label: 'Resume Templates', href: '/preparation/resume-templates', icon: 'FileText' },
    ],
  },
];

function NavMenuItem({ item, collapsed }: { item: NavItem; collapsed?: boolean }) {
  const location = useLocation();
  const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + '/');
  const [open, setOpen] = useState(false);
  const Icon = iconMap[item.icon] || PanelsTopLeft;
  const hasChildren = item.children && item.children.length > 0;

  return (
    <li className="relative">
      <Link
        to={item.href}
        onClick={hasChildren ? (e) => { e.preventDefault(); setOpen(!open); } : undefined}
        className={`flex w-full items-center gap-2 rounded-md p-2 text-left text-sm font-[family-name:var(--font-lexend)] transition-colors
          ${isActive
            ? 'bg-gray-100 dark:bg-zinc-800 font-medium text-gray-900 dark:text-white'
            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-gray-900 dark:hover:text-white'
          }
          ${collapsed ? 'justify-center !p-2' : ''}
        `}
      >
        <Icon className="size-5 shrink-0" aria-hidden />
        {!collapsed && (
          <>
            <span className="truncate">{item.label}</span>
            {hasChildren && (
              <ChevronRight className={`ml-auto size-4 transition-transform ${open ? 'rotate-90' : ''}`} />
            )}
          </>
        )}
      </Link>
      {hasChildren && open && !collapsed && (
        <ul className="ml-4 mt-1 space-y-1 border-l border-gray-200 dark:border-gray-700 pl-3">
          {item.children!.map(child => (
            <NavMenuItem key={child.href} item={child} />
          ))}
        </ul>
      )}
    </li>
  );
}

export default function PreparationLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isDark, toggle } = useTheme();
  const location = useLocation();

  // Close mobile sidebar on navigation
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="w-full flex flex-col min-h-screen bg-white dark:bg-[#0a0a0a]">
      <div className="flex w-full flex-1 min-h-0" style={{ '--sidebar-width': '16rem' } as React.CSSProperties}>
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex fixed inset-y-0 left-0 z-10 h-screen w-64 flex-col border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0a0a0a]"
          style={{ top: 0, height: '100vh' }}>
          {/* Logo */}
          <div className="h-16 flex items-center justify-center border-b border-gray-200 dark:border-gray-800 px-4">
            <Link to="/" className="flex items-center gap-0 hover:opacity-80 transition-opacity">
              <span className="font-[family-name:var(--font-josefin)] font-extrabold text-2xl text-gray-900 dark:text-white">
                PrepStack
              </span>
            </Link>
          </div>

          {/* Nav */}
          <nav className="flex-1 overflow-y-auto p-2 space-y-1">
            {navGroups.map((group, gi) => (
              <div key={gi} className="py-1">
                {group.label && (
                  <div className="flex items-center gap-2 h-8 px-2 text-xs font-medium tracking-wide text-gray-400 dark:text-gray-500 uppercase">
                    {group.label}
                    {group.hasIndicator && (
                      <span className="size-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_2px_rgba(59,130,246,0.6)]" />
                    )}
                  </div>
                )}
                <ul className="space-y-0.5">
                  {group.items.map(item => (
                    <NavMenuItem key={item.href} item={item} />
                  ))}
                </ul>
              </div>
            ))}
          </nav>

          {/* Theme Toggle */}
          <div className="p-3 border-t border-gray-200 dark:border-gray-800">
            <button onClick={toggle}
              className="flex items-center gap-2 w-full p-2 rounded-md text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors">
              {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
              <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
          </div>
        </aside>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
            <aside className="absolute inset-y-0 left-0 w-72 bg-white dark:bg-[#0a0a0a] border-r border-gray-200 dark:border-gray-800 flex flex-col z-50 shadow-xl">
              <div className="h-14 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-800">
                <span className="font-[family-name:var(--font-josefin)] font-extrabold text-xl text-gray-900 dark:text-white">PrepStack</span>
                <button onClick={() => setSidebarOpen(false)} className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800">
                  <X className="size-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto p-2 space-y-1">
                {navGroups.map((group, gi) => (
                  <div key={gi} className="py-1">
                    {group.label && (
                      <div className="flex items-center gap-2 h-8 px-2 text-xs font-medium tracking-wide text-gray-400 uppercase">
                        {group.label}
                      </div>
                    )}
                    <ul className="space-y-0.5">
                      {group.items.map(item => (
                        <NavMenuItem key={item.href} item={item} />
                      ))}
                    </ul>
                  </div>
                ))}
              </nav>
              <div className="p-3 border-t border-gray-200 dark:border-gray-800">
                <button onClick={toggle}
                  className="flex items-center gap-2 w-full p-2 rounded-md text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800">
                  {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
                  <span>{isDark ? 'Light' : 'Dark'}</span>
                </button>
              </div>
            </aside>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 md:ml-64 min-h-screen">
          {/* Mobile Top Bar */}
          <div className="md:hidden flex items-center h-14 px-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0a0a0a] sticky top-0 z-30">
            <button onClick={() => setSidebarOpen(true)} className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800 mr-3">
              <Menu className="size-5 text-gray-600 dark:text-gray-400" />
            </button>
            <span className="font-[family-name:var(--font-josefin)] font-bold text-lg text-gray-900 dark:text-white">PrepStack</span>
          </div>

          <div className="min-h-screen">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
