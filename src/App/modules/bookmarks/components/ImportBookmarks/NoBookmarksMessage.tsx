import React, { useState } from 'react'
import { mainPageButtonStyle } from '../../../ui/styles';

import { useAppSelector } from '../../../../store/store';
import ImportBookmarksModal from './ImportBookmarksModal';

const NoBookmarksMessage = () => {
    const appSelector = useAppSelector
    const hasBookmarks = appSelector((state) => state.appState.hasBookmarks);

    const [showImportModal, setOpenImportkModal] = useState(false);

     const emptyMessage = (
        <div id='empty-message' className='h-full self-center justify-center content-center flex flex-col' style={{ height: '80vh' }}>
          <div className="text-white text-base text-center">
            <p>No bookmarks found in the database</p>
            <p>Import them from the current Browser</p>
          </div>
          
          <button onClick={()=>setOpenImportkModal(true)} type='button' className={mainPageButtonStyle}>Import bookmarks</button>
          <ImportBookmarksModal isOpen={showImportModal} onClose={() => setOpenImportkModal(false)} onSave={()=>{}} />
        </div>
      );

      return hasBookmarks ? null : emptyMessage;
      
}
export default NoBookmarksMessage;