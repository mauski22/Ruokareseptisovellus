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
          Ei
        </Button>
        <Button variant="danger" onClick={confirmAction}>
          Kyllä
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmModal;
