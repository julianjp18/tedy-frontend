import React, { useEffect, useState } from 'react';
import { Table, Tag } from 'antd';
import { COLOR_STATUS, STATUS } from '../../utils/extras';

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
    dataIndex: 'graphic',
    key: 'graphic',
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
    dataIndex: 'id',
    key: 'id',
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
      <Tag color={COLOR_STATUS[status]} key={status}>
        {STATUS[status]}
      </Tag>
    ),
  },
];

const ProductsList = () => {
  const [products, setproducts] = useState([]);

  const getData = () => {
    const newProductsList = [];

    newProductsList.push({
      rec: 'REC-000002345',
      item: '123456',
      brand: 'CASCO INTEGRAL SHAFT',
      reference: 'SH-560',
      graphic: 'BEAST',
      id: '7706234234234232',
      stock: '01',
      units: '10',
      box_read: true,
      helmer_read: true,
      size_read: false,
      status: 'pending',
    });

    if (newProductsList.length > 0) setproducts(newProductsList);
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
