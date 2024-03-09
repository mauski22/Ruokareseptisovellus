import React from 'react';
import { Button, Modal } from 'react-bootstrap';

const ConfirmModal = ({ show, handleClose, title, body, confirmAction }) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{body}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="danger" onClick={confirmAction}>
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmModal;
