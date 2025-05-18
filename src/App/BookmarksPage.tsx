import '../index.css';

import React, { useEffect } from 'react';
import { Provider } from 'react-redux';

import { store } from './store/store';
import Sidebar from './modules/bookmarks/components/Sidebar/Sidebar';
import NavigationBar from './modules/bookmarks/components/NavigationBar/NavigationBar';
import BookmarksArea from './modules/bookmarks/components/BookmarksArea/BookmarksArea';
import { Flowbite } from 'flowbite-react';

const BookmarksPage = (): JSX.Element => {

  return (
    <Flowbite theme={{mode: 'dark'}}>
      <Provider store={store}>
        <div className="w-full mx-auto max-w-8xl">
          <div className="h-full flex flex-col">
            <NavigationBar />
            <div id="main-content" className="h-full flex flex-row">
              <Sidebar />
              <BookmarksArea />
            </div>
          </div>
        </div>
      </Provider>
    </Flowbite>
  );
};

export default BookmarksPage;
