import React, { useEffect, useState } from 'react';
import { Table, Tag } from 'antd';
import { COLOR_STATUS, STATUS } from '../../utils/extras';
import { firestoreDB } from '../../utils/firebase';

const columns = [
  {
    title: 'REC',
    dataIndex: 'rec',
    key: 'rec',
    align: 'center',
  },
  {
    title: 'Item',
    dataIndex: 'item',
    key: 'item',
    align: 'center',
  },
  {
    title: 'Línea | Tipo | Marca',
    dataIndex: 'brand',
    key: 'brand',
    align: 'center',
  },
  {
    title: 'Referencia',
    dataIndex: 'reference',
    key: 'reference',
    align: 'center',
  },
  {
    title: 'Gráficos',
    dataIndex: 'graphics',
    key: 'graphics',
    align: 'center',
  },
  {
    title: (
      <>
        <p>EAN</p>
        <p>Cód. de Barras</p>
      </>
    ),
    align: 'center',
    dataIndex: 'ean_code',
    key: 'ean_code',
  },
  {
    title: 'Cantidades',
    dataIndex: 'stock',
    key: 'stock',
    align: 'center',
    render: (stock, record) => {
      return (
        <div className="stock-content">
          <p>{`${stock}/${record.units ?? ''}`}</p>
        </div>
      )
    },
  },
  {
    title: (
      <>
        <p>LECTURA</p>
        <p>Caja | Casco | Talla</p>
      </>
    ),
    dataIndex: 'box_read',
    key: 'box_read',
    align: 'center',
    render: (box_read, record) => {
      return (
        <div className="read-content">
          <div className={`circle-read${box_read ? ' circle-read--active' : ''}`} id="box" />
          <div className={`circle-read${record.helmer_read ? ' circle-read--active' : ''}`} id="helmet" />
          <div className={`circle-read${record.size_read ? ' circle-read--active' : ''}`} id="size" />
        </div>
      )
    },
  },
  {
    title: 'Estado',
    key: 'status',
    dataIndex: 'status',
    align: 'center',
    render: (status) => (
      <Tag color={COLOR_STATUS[status.toLowerCase()]} key={status}>
        {STATUS[status.toLowerCase()]}
      </Tag>
    ),
  },
];

const ProductsList = () => {
  const [products, setproducts] = useState([]);

  const getData = async () => {
    const newProductsList = [];

    newProductsList.push({
      rec: 'REC-000002346',
      item: '123456',
      brand: 'CASCO INTEGRAL SHAFT',
      reference: 'SH-560',
      graphics: 'BEAST',
      ean_code: '7706234234234232',
      stock: '01',
      units: '10',
      box_read: true,
      helmer_read: true,
      size_read: false,
      status: 'IN_PROGRESS',
    });

    await firestoreDB.collection("products")
    .get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const {
            rec,
            item,
            brand,
            reference,
            graphics,
            ean_code,
            stock,
            units,
            box_read,
            helmer_read,
            size_read,
            status,
          } = doc.data();

          newProductsList.push({
            id: doc.id,
            rec,
            item,
            brand,
            reference,
            graphics,
            ean_code,
            stock,
            units,
            box_read,
            helmer_read,
            size_read,
            status,
          });
        });
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    });

    if (newProductsList.length > 0) setproducts(newProductsList);
  };

  useEffect(() => {
    getData();
    // getProductChanges();
  }, []);

  /*
  const getProductChanges = () => {
    firestoreDB.collection("products")
    .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
            if (change.type === "modified") {
              const {
                action
              } = change.doc.data();

              if (action === 'EAN_CODE') {
                openNotification('success', 'Código EAN detectado', '');
                play();
              }
              if (action === 'HELMER_READ') {
                openNotification('success', 'Casco detectado', '');
                play();
              }
            }
            if (change.type === "added") {
              console.log("New city: ", change.doc.data());
            }
            if (change.type === "removed") {
              console.log("Removed city: ", change.doc.data());
            }
        });
    });
  };
  */

  return (
    <div className="table-container">
      <Table dataSource={products} columns={columns} />
    </div>
  );
};

export default ProductsList;
