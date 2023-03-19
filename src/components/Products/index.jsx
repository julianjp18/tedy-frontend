import React, { useEffect } from 'react';
import { Row, Col } from 'antd';

import './products.scss';
import ProductsList from './ProductsList';
import CamQR from '../CamQR';
import { read, utils } from 'xlsx';

const Products = () => {

  useEffect(() => {
    readFile();
  }, []);

  const readFile = async () => {
    try {
      let fileName = "./CS-028.xlsx";
      const f = await (await fetch(fileName)).arrayBuffer();
      const wb = read(f);
      console.log(f);
    } catch(e) {
      console.log(e);
    }
  };

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
