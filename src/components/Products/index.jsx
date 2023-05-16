import React, { useEffect, useRef, useState } from 'react';
import { Row, Col, notification } from 'antd';
import useSound from 'use-sound';
import './products.scss';
import ProductsList from './ProductsList';
import CamQR from '../CamQR';
import { firestoreDB } from '../../utils/firebase';
// audios
import EanDetectedSound from '../../resources/audio/codigo_ean_detectado.mp3';

const Products = () => {
  const videoRef = useRef(null);
  const illustrationRef = useRef(null);
  const [playEanDetected] = useSound(EanDetectedSound, { volume: 1 });
  const [api, contextHolder] = notification.useNotification();

  /*
  useEffect(() => {
    const videoElement = videoRef.current;
    const url = 'http://localhost:5000/video_feed';

    const handleVideoStream = (event) => {
      const reader = new FileReader();
      reader.onloadend = function () {
        const boundary = event.data.split('\r\n')[0];
        const parts = reader.result.split(boundary);

        // const jsonResponse = parts[0].split('Content-Type: application/json\r\n\r\n')[1];
        const resultText = parts[0].split('Content-Type: text/plain\r\n\r\n')[1];
        const imageBlob = parts[1].split('Content-Type: image/jpeg\r\n\r\n')[1];

        const videoResultObj = JSON.parse(jsonResponse);
        showNotification(videoResultObj);

        const imageUrl = URL.createObjectURL(new Blob([imageBlob], { type: 'image/jpeg' }));
        videoElement.src = imageUrl;

        videoElement.play();
      };
      reader.readAsBinaryString(event.data);
    };

    const eventSource = new EventSource(url);
    eventSource.onmessage = handleVideoStream;

    return () => {
      eventSource.close();
    };
  }, []);
  */

  useEffect(() => {
    getDocumentByEanCode('7706234234234232');
  }, []);

  const openNotification = (type = 'info', title = '', description = '') => {
    api[type]({
      message: title,
      description,
    });
  };

  const showNotification = (action) => {
    if (action === 'EAN_CODE') {
      openNotification('success', 'Código EAN detectado', '');
    }
    if (action === 'EAN_CODE_ERROR') {
      openNotification('error', 'Código EAN no corresponde a REC', '');
    }
    if (action === 'HELMET_READ_ERROR') {
      openNotification('error', 'Casco no corresponde a la caja', '');
    }
    if (action === 'HELMET_READ') {
      openNotification('success', 'Casco detectado', '');
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

  const getDocumentByEanCode = async (eanCode) => {
    const reference = await getDocumentByField('ean_code', eanCode);
    if (reference.length > 0) {
      updateDoc(
        reference[0].id,
        {
          box_read: true,
        },
        'EAN_CODE',
        playEanDetected
      );
      console.log('doc.id', reference);
    }
  }

  const updateDoc = async (productId, valuesUpdated, action, audio) => {
    const document = firestoreDB.collection("products").doc(productId);
    
    await document.update(valuesUpdated)
    .then(() => {
      showNotification(action);
      audio();
    })
    .catch((error) => {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
    });
    
  };

  return (
    <Row className="products-container">
      {contextHolder}
      <Col xs={24}>
        <h2>Proceso Puesta a Punto / Mezzanine</h2>
        <CamQR
          cameraView='box'
          videoRef={videoRef}
          illustrationRef={illustrationRef}
        />
        <h2 className="list-title">LISTADO DE ENTRADA POR COMPRA </h2>
        <ProductsList />
      </Col>
    </Row>
  );
};

export default Products;
