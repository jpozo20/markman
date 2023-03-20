import React from 'react';
import { createRoot } from 'react-dom/client';
import PopupPage from '../../App/PopupPage';

const node = document.querySelector('#root');
const root = createRoot(node as Element);
root.render(<PopupPage />);
