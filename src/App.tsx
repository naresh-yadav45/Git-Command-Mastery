import { lazy, Suspense } from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import { Page } from './components/shared';

const Commands = lazy(() => import('./pages/Commands'));
const Categories = lazy(() => import('./pages/Categories'));
const CommandDetail = lazy(() => import('./pages/CommandDetail'));
const Visualizer = lazy(() => import('./pages/Visualizer'));
const Terminal = lazy(() => import('./pages/Terminal'));
const BranchVisualizer = lazy(() => import('./pages/BranchVisualizer'));
const LearningPaths = lazy(() => import('./pages/LearningPaths'));
const Resources = lazy(() => import('./pages/Resources'));
const CheatSheets = lazy(() => import('./pages/CheatSheets'));
const Troubleshooting = lazy(() => import('./pages/Troubleshooting'));
const Glossary = lazy(() => import('./pages/Glossary'));
const Internals = lazy(() => import('./pages/Internals'));
const Workflows = lazy(() => import('./pages/Workflows'));
const BestPractices = lazy(() => import('./pages/BestPractices'));
const About = lazy(() => import('./pages/About'));
const Compare = lazy(() => import('./pages/Compare'));
const Setup = lazy(() => import('./pages/Setup'));
const MyLibrary = lazy(() => import('./pages/MyLibrary'));

function Loading() {
  return <Page><p role="status" className="text-muted">Loading…</p></Page>;
}
function NotFound() {
  return (
    <Page>
      <h1 className="text-3xl font-extrabold">Page not found</h1>
      <p className="mt-2 text-muted">That address does not match any page. Go back to the <Link className="font-semibold text-brand" to="/">overview</Link> or browse <Link className="font-semibold text-brand" to="/commands">all commands</Link>.</p>
    </Page>
  );
}

export default function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="commands" element={<Commands />} />
          <Route path="commands/:slug" element={<CommandDetail />} />
          <Route path="categories" element={<Categories />} />
          <Route path="categories/:id" element={<Commands />} />
          <Route path="visualizer" element={<Visualizer />} />
          <Route path="terminal" element={<Terminal />} />
          <Route path="branches" element={<BranchVisualizer />} />
          <Route path="learn" element={<LearningPaths />} />
          <Route path="learn/:pathId" element={<LearningPaths />} />
          <Route path="resources" element={<Resources />} />
          <Route path="cheatsheets" element={<CheatSheets />} />
          <Route path="troubleshooting" element={<Troubleshooting />} />
          <Route path="glossary" element={<Glossary />} />
          <Route path="internals" element={<Internals />} />
          <Route path="workflows" element={<Workflows />} />
          <Route path="best-practices" element={<BestPractices />} />
          <Route path="about" element={<About />} />
          <Route path="compare" element={<Compare />} />
          <Route path="setup" element={<Setup />} />
          <Route path="library" element={<MyLibrary />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
