import React, { useState, useEffect } from 'react';
import { Row, Col, Checkbox } from 'antd';
import { openNotification } from '../../utils/extras';

import './camqr.scss';

const server = 'https://server1.proyectohorus.com.ar';
const user = 'TrekingSAS';
const password = 'TrekingSAS2021*';
const profileuuid = '1b6e0e167ee111eb9c3300155d714f00';

const INIT_CHECKBOXES_VALUES = {
  object: false,
  color: false,
  tag: false,
  size: false,
  qr_code: false,
  tir: false,
};

const INIT_RESPONSE_VALUES = {
  object: '',
  color: '',
  tag: '',
  size: '',
  qr_code: '',
  tir: '',
};
  
const CamQR = ({ cameraView = '' }) => {
  const [cameraSection, setCameraSection] = useState(cameraView);  
  const [checkboxes, setCheckboxes] = useState(INIT_CHECKBOXES_VALUES);
  const [responseValues, setResponseValues] = useState(INIT_RESPONSE_VALUES);
  const [position, setposition] = useState([]);
  const [vehicle, setvehicle] = useState([]);

  let token = "";
  let instance = "";

  // CONVIERTE LA IMAGEN DE BASE64 A BYTE
  const base64toBlob = (base64Data, contentType) => {
    contentType = contentType || '';
    const sliceSize = 1024;
    const byteCharacters = atob(base64Data);
    const bytesLength = byteCharacters.length;
    const slicesCount = Math.ceil(bytesLength / sliceSize);
    const byteArrays = new Array(slicesCount);

    for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
      var begin = sliceIndex * sliceSize;
      var end = Math.min(begin + sliceSize, bytesLength);

      var bytes = new Array(end - begin);
      for (var offset = begin, i = 0; offset < end; ++i, ++offset) {
        bytes[i] = byteCharacters[offset].charCodeAt(0);
      }
      byteArrays[sliceIndex] = new Uint8Array(bytes);
    }
    return new Blob(byteArrays, { type: contentType });
  }
  
  // OBTIENE EL TOKEN
  const getToken = () => {
    const form = new FormData();
    form.append('user', user);
    form.append('password', password);
    form.append('profileuuid', profileuuid);

    const GetToken = new XMLHttpRequest();

    GetToken.open('POST', server + '/api/v2/functions/login?responseformat=json', true);

    GetToken.onload = function () {
      if (GetToken.status == 200) {
        if (this.response) {
          var data = JSON.parse(this.response);

          token = data.token;
          instance = data.instance;
        }
      }
    };

    GetToken.send(form);
  };

  // LLAMADA A ENDPOINT DE CODEBAR DECODER PARA OBTENER LOS DATOS DE UN QR O CODIGO DE BARRAS
  const Recognition = () => {
    window.Webcam.snap(function (data_uri) {
      fetch('/funcion_python.py', {
        method: 'POST',
        headers: {
          'Content-Type': 'image/jpeg;application/json;application/x-www-form-urlencoded;charset=utf-8'
        },
        body: 'image=' + encodeURIComponent(data_uri)
      })
      .then(function(response) {
        /* AQUI SE DEBE OBTENER EL TEXTO QUE RESPONDE LA FUNCIÓN DE PYTHON */

        // SI LA LECTURA ES UNA CAJA
        // SE DEBE VALIDAR SI LA RESPUESTA ES UNA CAJA
        // if (response.ALGO === 'CAJA')
        setCheckboxes({
          ...INIT_CHECKBOXES_VALUES,
          object: true,
          tag: true,
          QR: true,
        });
        setResponseValues({
          ...INIT_RESPONSE_VALUES,
          object: 'Caja',
          tag: '8004645645',
          qr_code: 'CÓDIGO QR'
        });
        // FIN SI LA LECTURA ES UNA CAJA

        // SI LA LECTURA ES UN CASCO
        // SE DEBE VALIDAR SI LA RESPUESTA ES UN CASCO
        // if (response.ALGO === 'CASCO')
        setCheckboxes({
          ...INIT_CHECKBOXES_VALUES,
          color: true,
          tag: true,
          size: true,
        });
        setResponseValues({
          ...INIT_RESPONSE_VALUES,
          color: 'Negro - Rojo',
          tag: '8004645645',
          size: 'M'
        });
        // FIN SI LA LECTURA ES UN CASCO

        // SI LA LECTURA ES ADUANA DESPACHO
        if (cameraView === 'dispatch') {
          setCheckboxes({
            ...INIT_CHECKBOXES_VALUES,
            object: true,
            tag: true,
            tir: true,
          });
          setResponseValues({
            ...INIT_RESPONSE_VALUES,
            object: 'Caja',
            tag: '8004645645',
            tir: '726'
          });
        }
        // FIN SI LA LECTURA ES ADUANA DESPACHO
      });
    });
  }

  // ACTIVA EL RECONOCIMIENTO
  const start = () => {
    getToken();
    setInterval(Recognition, 2000);
  }

  useEffect(() => {
    setTimeout(start, 5000);
  }, []);

  const onChange = (e, fieldName) => {
    const newCheckboxes = checkboxes;
    newCheckboxes[fieldName] = e.target.checked;
    setCheckboxes(newCheckboxes);
  };

  return (
    <div className="camqr-container">
      <Row className="camqr-content">
        <Col xs={8}>
          <div className="info-qr">
            <p className="title">Indicaciones</p>
            <div className="image-description-content">
              {/* <img className="image-description" src={} alt="description" /> */}
            </div>
            <p className="read">Lectura: <b>CAJA - SHATD123</b></p>
          </div>
        </Col>
        <Col xs={8}>
          <div className="my-camera" id="my_camera"></div>
        </Col>
        <Col xs={8}>
          <div className="response-content">
            <p className="title">Criterios</p>
            <div className="response-view-content">
              <div className="aligments-content">
                <div className="aligments-left">
                  {['box', 'dispatch'].includes(cameraView) && (
                    <div className="aligment-item">
                      <Checkbox onChange={(e) => onChange(e, 'object')} checked={checkboxes.object}>Objeto</Checkbox>
                    </div>
                  )}
                  {cameraView === 'helmet' && (
                    <div className="aligment-item">
                      <Checkbox onChange={(e) => onChange(e, 'color')} checked={checkboxes.color}>Color</Checkbox>
                    </div>
                  )}
                  {['box', 'helmet', 'dispatch'].includes(cameraView) && (
                    <div className="aligment-item">
                      <Checkbox onChange={(e) => onChange(e, 'tag')} checked={checkboxes.tag}>Etiqueta</Checkbox>
                    </div>
                  )}
                  {cameraView === 'helmet' && (
                    <div className="aligment-item">
                      <Checkbox onChange={(e) => onChange(e, 'size')} checked={checkboxes.size}>Talla</Checkbox>
                    </div>
                  )}
                  {cameraView === 'box' && (
                    <div className="aligment-item">
                      <Checkbox onChange={(e) => onChange(e, 'qr_code')} checked={checkboxes.qr_code}>QR</Checkbox>
                    </div>
                  )}
                  {cameraView === 'dispatch' && (
                    <div className="aligment-item">
                      <Checkbox onChange={(e) => onChange(e, 'tir')} checked={checkboxes.tir}>Guia TIR</Checkbox>
                    </div>
                  )}
                </div>
                <div className="aligments-right">
                  <div className="aligment-item">
                    <p>{['box', 'dispatch'].includes(cameraView) ? 'CAJA' : cameraView !== '' ? 'Negro - Rojo' : '' }</p>
                  </div>
                  <div className="aligment-item">
                    <p>8004645645</p>
                  </div>
                  <div className="aligment-item">
                    {cameraView === 'box' && 'SI'}
                    {cameraView === 'helmet' && 'M'}
                    {cameraView === 'dispatch' && '726'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default CamQR;
