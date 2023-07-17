import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './styles/index.css';
import './utils/i18n.ts';

createRoot(document.getElementById('root')!).render(<App />);
