import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';

import Library from './pages/Library';
import DocumentDetail from './pages/DocumentDetail';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="library" element={<Library />} />
          <Route path="documents/:id" element={<DocumentDetail />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
