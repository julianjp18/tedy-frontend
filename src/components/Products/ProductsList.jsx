import React, { useEffect, useState } from 'react';
import { Table, Tag } from 'antd';
import collections from '../../utils/collections';
import { firestoreDB } from '../../utils/firebase';
import { COLOR_STATUS } from '../../utils/extras';

const columns = [
  {
    title: 'REC',
    dataIndex: 'rec',
    key: 'rec',
  },
  {
    title: 'Item',
    dataIndex: 'item',
    key: 'item',
  },
  {
    title: 'Línea | Tipo | Marca',
    dataIndex: 'brand',
    key: 'brand',
  },
  {
    title: 'Referencia',
    dataIndex: 'reference',
    key: 'reference',
  },
  {
    title: 'Gráficos',
    dataIndex: 'graphic',
    key: 'graphic',
  },
  {
    title: (
      <>
        <p>EAN</p>
        <p>Cód. de Barras</p>
      </>
    ),
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: 'Cantidades',
    dataIndex: 'stock',
    key: 'stock',
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
    dataIndex: 'read',
    key: 'read',
    render: (read, record) => {
      return (
        <div className="read-content">
          <div className="circle-read" id="box" />
          <div className="circle-read" id="helmet" />
          <div className="circle-read" id="size" />
        </div>
      )
    },
  },
  {
    title: 'Estado',
    key: 'status',
    dataIndex: 'status',
    render: (status) => (
      <Tag color={COLOR_STATUS[status]} key={status}>
        {status.toUpperCase()}
      </Tag>
    ),
  },
];
/*
const columns = [
  {
    title: 'Fecha',
    dataIndex: 'date',
    key: 'date',
  },
  {
    title: 'Producto - Referencia',
    dataIndex: 'product',
    key: 'product',
  },
  {
    title: 'Código/ID',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: 'Cantidades',
    dataIndex: 'stock',
    key: 'stock',
    render: (stock, record) => {
      return (
        <div className="stock-content">
          <p>{`${stock}/${record.units ?? ''}`}</p>
        </div>
      )
    },
  },
  {
    title: 'Estado',
    key: 'status',
    dataIndex: 'status',
    render: (status) => (
      <Tag color='#f50' key={status}>
        {status.toUpperCase()}
      </Tag>
    ),
  },
];
*/

const ProductsList = () => {
  const [products, setproducts] = useState([]);

  const getData = () => {
    const data = firestoreDB.collection(collections.PRODUCTS);

    data.onSnapshot((products) => {
      setproducts([]);
      const newProductsList = [];

      products.forEach((product) => {

        if (product.data().rec) {
          newProductsList.push({
            ...product.data(),
            key: product.id,
          });
        }

      });

      if (newProductsList.length > 0) setproducts(newProductsList);
    });
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="table-container">
      <Table dataSource={products} columns={columns} />
    </div>
  );
};

export default ProductsList;
