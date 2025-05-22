import '../index.css';

import React from 'react';
import { Provider } from 'react-redux';
import { Flowbite } from 'flowbite-react';

import NavigationBar from './modules/bookmarks/components/NavigationBar/NavigationBar';
import MainContent from './modules/bookmarks/components/BookmarksArea/MainContent';
import NoBookmarksMessage from './modules/bookmarks/components/ImportBookmarks/NoBookmarksMessage';

import { store } from './store/store';


const BookmarksPage = (): JSX.Element => {
  return (
    <Flowbite theme={{ mode: 'dark' }}>
      <Provider store={store}>
        <div className="w-full mx-auto max-w-8xl">
          <div id='content-area' className="h-full flex flex-col">
            <NavigationBar />
            <MainContent />
            <NoBookmarksMessage />
          </div>
        </div>
      </Provider>
    </Flowbite >
  );
};

export default BookmarksPage;
