import React, { useEffect } from 'react';
import { Row, Col } from 'antd';
import readXlsxFile from 'read-excel-file';

import './products.scss';
import ProductsList from './ProductsList';
import CamQR from '../CamQR';

const Products = () => {

  useEffect(() => {
    readFile();
  }, []);

  const readFile = () => {
    fetch('https://example.com/spreadsheet.xlsx')
      .then(response => response.blob())
      .then(blob => readXlsxFile(blob))
      .then((rows) => {
        console.log(rows);
      });
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
