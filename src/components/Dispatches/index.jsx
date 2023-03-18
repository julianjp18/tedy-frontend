import React from 'react';
import { Row, Col } from 'antd';

import './products.scss';
import DispatchesList from './DispatchesList';
import CamQR from '../CamQR';

const Dispatches = () => {

  return (
    <Row className="products-container">
      <Col xs={24}>
        <h2>Aduana Despacho</h2>
        <CamQR cameraView='dispatch' />
        <h4>{`LISTADO ORDEN DE COMPRA > ENTRADA POR COMPRA`}</h4>
        <DispatchesList />
      </Col>
    </Row>
  );
};

export default Dispatches;
