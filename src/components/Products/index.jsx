import React, { useEffect, useRef, useState } from 'react';
import { Row, Col, notification } from 'antd';
import useSound from 'use-sound';
import './products.scss';
import ProductsList from './ProductsList';
import CamQR from '../CamQR';
import { firestoreDB } from '../../utils/firebase';
// audios
import EanDetectedSound from '../../resources/audio/codigo_ean_detectado.mp3';
import HelmetErrorSound from '../../resources/audio/casco_no_corresponde_a_la_caja.mp3';

const HELMET_URL = 'http://localhost:5000/helmet-classification';
const GRAYSCALE_URL = 'http://localhost:5000/grayscale-detection';
const BARCODE_URL = 'http://localhost:5001/barcode-detection';

const INIT_CHECKBOXES_VALUES = {
  ean_code: false,
  helmet: false,
  pantons: false,
  size: false,
};

const Products = () => {
  const helmetRef = useRef(null);
  const illustrationRef = useRef(null);
  const grayScaleVideoRef = useRef(null);
  const barCodeRef = useRef(null);
  const [valueReaded, setValueReaded] = useState('--');
  const [checkboxes, setCheckboxes] = useState(INIT_CHECKBOXES_VALUES);
  const [playEanDetected] = useSound(EanDetectedSound, { volume: 1 });
  const [playHelmetError] = useSound(HelmetErrorSound, { volume: 1 });
  const [api, contextHolder] = notification.useNotification();

  /** helmet illustration */
  useEffect(() => {
    const videoElement = illustrationRef.current;

    const eventSource = new EventSource(HELMET_URL);
    eventSource.onmessage = (event) => {
      const response = JSON.parse(event.data);
      console.log(response,"response1");
      const imageSrc = `data:image/jpeg;base64, ${response.frame}`;
        if (videoElement) {
          videoElement.src = imageSrc;
        }
        if (response.ean !== '' && !localStorage.getItem('ean_helmet')) {
          if (!response.ean) setValueReaded(`--`);
          else localStorage.setItem('ean_helmet', response.ean);
          if (response.ean && response.size === '') {
            if (response.ean === localStorage.getItem('ean_box')) {
              setValueReaded(`Código casco ${response.ean}`);
              getDocumentByEanCode(response.ean, response.size || '');
              setCheckboxes({
                ...INIT_CHECKBOXES_VALUES,
                helmet: true,
                size: true,
              })
              localStorage.clear();
            } else {
              showNotification('HELMET_READ_ERROR');
              playHelmetError();
            }
          }
        }
    };
    return () => {
      eventSource.close();
    };
  }, []);
  
  /** barcode detection */
  useEffect(() => {
    const videoElement = barCodeRef.current;

    const eventSource = new EventSource(BARCODE_URL);
    eventSource.onmessage = (event) => {
      const response = JSON.parse(event.data);
      console.log(response,"response2");
      const imageSrc = `data:image/jpeg;base64, ${response.frame}`;
        if (videoElement) {
          videoElement.src = imageSrc;
        }
        if (response.ean !== '' && !localStorage.getItem('ean_box')) {
          setValueReaded(`Código de barras: ${response.ean}`);
          localStorage.setItem('ean_box', response.ean);
          showNotification('EAN_CODE');
          playEanDetected();
          setCheckboxes({
            ...INIT_CHECKBOXES_VALUES,
            ean_code: true,
          })
          changeProductStatus(response.ean,'IN_PROGRESS');
        } else {
          setValueReaded('--');
        }
    };
    return () => {
      eventSource.close();
    };
  }, []);

  const onChange = (e, fieldName) => {
    const newCheckboxes = checkboxes;
    newCheckboxes[fieldName] = e.target.checked;
    setCheckboxes(newCheckboxes);
  };

  const openNotification = (type = 'info', title = '', description = '') => {
    api[type]({
      message: title,
      description,
    });
  };

  const showNotification = (action) => {
    let type = 'warning';
    let title = '';
    let body = '';
    if (action === 'EAN_CODE') {
      type = 'success';
      title = 'Código EAN detectado';
    }
    if (action === 'EAN_CODE_ERROR') {
      type = 'error';
      title = 'Código EAN no corresponde a REC';
    }
    if (action === 'HELMET_READ_ERROR') {
      type = 'error';
      title = 'Casco no corresponde a la caja';
    }
    if (action === 'HELMET_READ') {
      type = 'success';
      title = 'Caso detectado';
    }
    if (action !== '') {
      openNotification(type, title, body);
    }
  };

  const getDocumentByField = async (field, value) => {
    const docRef = firestoreDB.collection("products").where(field, "==", value);
    const reference = [];
    await docRef.get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            reference.push({
              id: doc.id,
              ...doc.data(),
            });
            console.log(doc.id, " => ", doc.data());
        });
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    });

    return reference;
  };

  const getDocumentByEanCode = async (eanCode, size = '') => {
    const reference = await getDocumentByField('ean_code', eanCode);
    if (reference.length > 0) {
      const payload = {
        box_read: true,
        helmet_read: true,
        size: reference[0].size,
        size_read: true,
      };
      updateDoc(
        reference[0].id,
        payload,
        'HELMET_READ'
      );
      console.log('doc.id', reference);
    }
  }

  const changeProductStatus = async (eanCode, status) => {
    const reference = await getDocumentByField('ean_code', eanCode);
      if (reference.length > 0) {
        const payload = {
          status,
        };
        updateDoc(
          reference[0].id,
          payload,
          ''
        );
      }
  };

  const updateDoc = async (productId, valuesUpdated, action) => {
    const document = firestoreDB.collection("products").doc(productId);
  
    if(valuesUpdated) {  
      await document.update(valuesUpdated)
      .then(() => {
        showNotification(action);
      })
      .catch((error) => {
          // The document probably doesn't exist.
          console.error("Error updating document: ", error);
      });
    }  
  };

  return (
    <Row className="products-container">
      {contextHolder}
      <Col xs={24}>
        <h2>Proceso Puesta a Punto / Mezzanine</h2>
        <CamQR
          helmetRef={helmetRef}
          illustrationRef={illustrationRef}
          grayScaleVideoRef={grayScaleVideoRef}
          barCodeRef={barCodeRef}
          valueReaded={valueReaded}
          onChange={onChange}
          checkboxes={checkboxes}
        />
        <h2 className="list-title">LISTADO DE ENTRADA POR COMPRA </h2>
        <ProductsList />
      </Col>
    </Row>
  );
};

export default Products;