import React from 'react';
import { Row, Col, Checkbox } from 'antd';

import './camqr.scss';
  
const CamQR = ({
  helmetRef,
  illustrationRef = null,
  grayScaleVideoRef = null,
  barCodeRef = null,
  valueReaded,
  onChange,
  checkboxes,
}) => {
  return (
    <div className="camqr-container">
      <Row className="camqr-content">
        <Col xs={24} sm={16} lg={8}>
          <div className="info-qr">
            <p className="title">Indicaciones</p>
            <div className="image-description-content">
              <img className="my-camera" ref={illustrationRef} alt="Illustration" />
            </div>
            <p className="read">Lectura: <b>{valueReaded}</b></p>
          </div>
        </Col>
        <Col xs={24} sm={16} lg={8}>
          <img className="my-camera" ref={helmetRef} alt="Helmet camera" />
        </Col>
        <Col xs={24} sm={16} lg={8}>
          <div className="response-content">
            <p className="title">Criterios</p>
            <div className="response-view-content">
              <div className="aligments-content">
                <div className="aligment-item">
                  <Checkbox onChange={(e) => onChange(e, 'reference')} checked={checkboxes.ean_code}> 1. Referencia</Checkbox>
                </div>
                <div className="aligment-item">
                  <Checkbox onChange={(e) => onChange(e, 'paint')} checked={checkboxes.helmet}>2. Gráfico (dibujo)</Checkbox>
                </div>
                <div className="aligment-item">
                  <Checkbox onChange={(e) => onChange(e, 'colors')} checked={checkboxes.pantons}>3. Color(es)</Checkbox>
                </div>
                <div className="aligment-item">
                  <Checkbox onChange={(e) => onChange(e, 'size')} checked={checkboxes.size}>4. Talla</Checkbox>
                </div>
              </div>
            </div>
          </div>
        </Col>
        <Col xs={24} sm={16} lg={8}>
          <img className="my-camera" ref={grayScaleVideoRef} alt="gray Scale Video ref" />
        </Col>
        <Col xs={24} sm={16} lg={8}>
          <img className="my-camera" ref={barCodeRef} alt="Bar code camera" />
        </Col>
        <Col xs={0} sm={0} lg={8} />
      </Row>
    </div>
  );
};

export default CamQR;
