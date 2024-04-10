// PurchaseModal.jsx
import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const PurchaseModal = ({ show, handleClose, handlePurchase, recipe }) => {
 const [price, setPrice] = React.useState('');

 const handleSubmit = () => {
    handlePurchase(recipe.recipe_id, price);
    handleClose();
 };

 return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Osta tämä idea</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Mitä hinnalla haluat ostaa tämän idean?</p>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Anna hinta"
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Sulje
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Osta
        </Button>
      </Modal.Footer>
    </Modal>
 );
};

export default PurchaseModal;