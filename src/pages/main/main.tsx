import React from 'react';
import { createRoot } from 'react-dom/client';
import BookmarksPage from '../../App/BookmarksPage';

const node = document.querySelector('#root');
const root = createRoot(node as Element);
root.render(<BookmarksPage />);
