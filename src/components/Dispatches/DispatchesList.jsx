import React, { useEffect, useState } from 'react';
import { Table, Tag } from 'antd';
import collections from '../../utils/collections';
import { firestoreDB } from '../../utils/firebase';

const columns = [
  {
    title: 'Pedido',
    dataIndex: 'request',
    key: 'request',
    render: (request, record) => {
      return (
        <div className="request-content">
          <p>{`${request}`}</p>
        </div>
      )
    },
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

const DispatchesList = () => {
  const [products, setproducts] = useState([]);

  const getData = () => {
    const data = firestoreDB.collection(collections.PRODUCTS);

    data.onSnapshot((products) => {
      setproducts([]);
      const newDispatchesList = [];

      products.forEach((product) => {

        if (product.data().request) {
          newDispatchesList.push({
            ...product.data(),
            key: product.id,
          });
        }

      });

      if (newDispatchesList.length > 0) setproducts(newDispatchesList);
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

export default DispatchesList;
