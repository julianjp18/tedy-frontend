import React from 'react';
import { Dropdown, Menu } from 'antd';
import './header.scss';
import { DownOutlined } from '@ant-design/icons';
import logo from '../../resources/images/tedy-logo.png';
import { withRouter } from 'react-router';

const CommonHeader = ({ push }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const sessionDestroy = () => {
    localStorage.setItem('reload', true);
    localStorage.removeItem('user');
    push('/');
  };

  const menu = (
    <Menu>
      <Menu.Item>
        <a rel="noopener noreferrer" onClick={sessionDestroy}>
          Cerrar sesión
        </a>
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <img className="logo" src={logo} alt="logo tedy ai"/>
      <Dropdown overlay={menu}>
        <div className="profile-content">
          <img className="profile-img" src="https://picsum.photos/50/50" alt="profile" />
          <div className="username-container">
            <p>{user?.name ?? 'N/A' }</p>
            <span>{user?.charge ?? 'N/A' }</span>
          </div>
          <DownOutlined />
        </div>
      </Dropdown>
      
    </>
  );
};

export default withRouter(CommonHeader);
