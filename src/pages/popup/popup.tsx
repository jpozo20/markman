import React from 'react';
import { createRoot } from 'react-dom/client';
import PopupPage from '../../App/PopupPage';

console.log('popup script');

const node = document.querySelector('#root');
const root = createRoot(node as Element);
root.render(<PopupPage />);
