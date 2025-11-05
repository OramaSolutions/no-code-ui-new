import React from 'react'
import Modal from 'react-bootstrap/Modal';
import { useDispatch, useSelector } from 'react-redux';

import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

function ImageMagnify({url,isZoomModalOpen}) {
    return (
        <Modal
        show={isZoomModalOpen}
        // onHide={closeZoomModal} // Close zoom modal
        style={{
          overlay: { zIndex: 1000 }, // Higher z-index for zoom modal
          content: { zIndex: 1000, background: 'transparent', border: 'none' },
        }}
      >
        <Zoom>
          <img
            src={url}
            alt="Zoomable"
            style={{ maxWidth: '100%', maxHeight: '100vh', cursor: 'zoom-out' }}
          />
        </Zoom>
        <button  style={{ position: 'absolute', top: 20, right: 20 }}>
          Close
        </button>
      </Modal>   
    )
}

export default ImageMagnify
