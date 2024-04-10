import React from 'react';
import { Form, Button } from 'react-bootstrap';
import SearchBar from './SearchBar';

const Sidebar = () => {
  return (
    <div className="d-flex flex-column flex-shrink-0 p-3 bg-light" style={{ width: '280px' }}>
      <hr />
      <h2>Julkiset idea</h2>
             <h5>Suodatin</h5>
      <h6>Järjestys</h6>
      <div className="mb-3">
        <Form.Check label="Uusimmat" />
        <Form.Check label="Vanhimmat" />
        <Form.Check label="Tykätyimmät" />
        <Form.Check label="Aikajärjestys" />
      </div>
      <hr />
      <h6>Toimialat</h6>
      {/* You will likely want to map over your sectors/categories here */}
      <Form.Check label="Ihmisten perushyödykkeet" />
      <Form.Check label="Työmenetelmät ja kuljetus" />
      <Form.Check label="Kemia ja metallurgia" />

      <Form.Check label="Tekstiilit ja paperi" />
      <Form.Check label="Rakennustekniikka" />
      <Form.Check label="Koneenrakennus, valaistus, lämmitys, aseet, räjäyttäminen" />
      <Form.Check label="Fysiikka" />
      <Form.Check label="Sähkö" />

      {/* ... other sectors/categories */}
    </div>
  );
};

export default Sidebar;
