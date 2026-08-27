import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Game from './pages/Game';
import Leaderboard from './pages/Leaderboard';
import Awards from './pages/Awards';
import Rules from './pages/Rules';

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Game />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/awards" element={<Awards />} />
        <Route path="/rules" element={<Rules />} />
      </Routes>
    </BrowserRouter>
  );
}
