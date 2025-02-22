import React from "react";
import { Modal } from "flowbite-react";

import { labelStyle, inputFieldStyle, modalCancelButtonStyle, modalSaveButtonStyle } from "../../../ui/styles";

const AddFolderModal = ({ isOpen, onClose, onSave }) => {

    return (<>
        <Modal size="md" show={isOpen} onClose={onClose}>
            <Modal.Header className="border-0 bg-gray-800 rounded-t-lg">Add folder</Modal.Header>
            <Modal.Body className="bg-gray-800">
                <div className="space-y-6">
                    <div className='mb-6 flex flex-col'>
                        <label htmlFor="bookmark_name" className={labelStyle}>Folder name</label>
                        <input type="text" id="bookmark_name" className={inputFieldStyle} placeholder="Folder name" required />
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer className="flex justify-end border-0 bg-gray-800 px-6 py-3 rounded-b-lg">
                <button className={modalSaveButtonStyle} onClick={onSave}>Save</button>
                <button className={modalCancelButtonStyle} onClick={() => onClose()}>
                    Cancel
                </button>
            </Modal.Footer>
        </Modal>
    </>)
}

export default AddFolderModal;