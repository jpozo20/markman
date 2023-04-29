import '../index.css';

import React from 'react';
import { Provider } from 'react-redux';

import { store } from './store/store';
import Sidebar from './modules/bookmarks/components/Sidebar/Sidebar';
import NavigationBar from './modules/bookmarks/components/NavigationBar/NavigationBar';
import BookmarksArea from './modules/bookmarks/components/BookmarksArea/BookmarksArea';

const BookmarksPage = (): JSX.Element => {
  return (
    <Provider store={store}>
      <div className="w-full mx-auto max-w-8xl" style={{ height: '100vh' }}>
        <div className="h-full flex flex-col">
          <NavigationBar />
          <div id="main-content" className="h-full flex flex-row">
            <Sidebar />
            <BookmarksArea />
          </div>
        </div>
      </div>
    </Provider>
  );
};

export default BookmarksPage;
