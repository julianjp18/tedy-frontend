import React from 'react';
import { Menu } from 'antd';
import { BookOutlined, CarOutlined } from '@ant-design/icons';
import './sider.scss';

const { SubMenu } = Menu;

const Sider = ({ push }) => {

  const handleClick = (e) => {
    push(`/${e.key}`);
  };

  return (
    <Menu
      onClick={handleClick}
      style={{ width: 256 }}
      defaultOpenKeys={['sub1', 'sub2']}
      mode="inline"
    >
      <SubMenu key="sub1" title="Productos">
        <Menu.Item key="products">Proceso Puesta a Punto</Menu.Item>
      </SubMenu>
      <SubMenu key="sub2" title="Aduanas">
        <Menu.Item key="dispatches">Despacho</Menu.Item>
      </SubMenu>
    </Menu>
  );
};

export default Sider;
