import React from 'react';
import { Row, Col } from 'antd';

import './products.scss';
import ProductsList from './ProductsList';
import CamQR from '../CamQR';

const Products = () => {

  return (
    <Row className="products-container">
      <Col xs={24}>
        <h2>Proceso Puesta a Punto / Mezzanine</h2>
        <CamQR cameraView='box' />
        <h2 className="list-title">LISTADO DE ENTRADA POR COMPRA </h2>
        <ProductsList />
      </Col>
    </Row>
  );
};

export default Products;
