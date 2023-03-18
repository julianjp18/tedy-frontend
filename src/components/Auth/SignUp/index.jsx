import React, { useEffect } from 'react';
import { Row, Col, Form, Input, Button, notification } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';

import logo from '../../../resources/images/tedy-logo.png';

import './signUp.scss';
import { push } from 'connected-react-router';
import { PRODUCTS_LIST } from '../../../routing/paths';

const openNotification = (type, message, description) => {
  notification[type]({
    message,
    description,
  });
};

const SignUp = ({ goToHome, goToAuth }) => {

  useEffect(() => {
    if (localStorage.getItem('reload')) {
      window.location.reload();
      localStorage.clear();
    }
  }, []);

  const onFinish = (values) => {
    const { username, password } = values;
    
    if (username === 'gustavo.colarado' && password === 'Test123!') {
      openNotification('success', 'Bienvenido', '');
      localStorage.setItem('user', JSON.stringify({
        name: 'Gustavo Colarado',
        charge: 'Jefe de Tedy'
      }));
      localStorage.setItem('reload', false);

      goToHome();
    } else {
      openNotification('error', 'Autenticación fallida', 'Usuario y/o contraseña incorrecta');
    }
  };

  return (
    <Row className="sign-up-container">
      <Col xs={24}>
        <img className="logo logo--first" src={logo} alt="Tedy"/>
      </Col>
      <Col xs={24}>
        <div className="sign-up-content">
          <div className="sign-up-form-content">
            <p className="sign-up-title">Iniciar sesión</p>
            <Form
              name="normal_login"
              className="login-form"
              initialValues={{
                remember: true,
              }}
              onFinish={onFinish}
            >
              <Form.Item
                name="username"
                rules={[
                  {
                    required: true,
                    message: 'Por favor inserta un usuario',
                  },
                ]}
              >
                <Input
                  prefix={<UserOutlined className="site-form-item-icon" style={{ fontSize: '20px' }} />}
                  placeholder="Tu usuario"
                  size="large"
                />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[
                  {
                    required: true,
                    message: 'Por favor inserta tu contraseña',
                  },
                ]}
              >
                <Input
                  prefix={<LockOutlined className="site-form-item-icon" style={{ fontSize: '20px' }} />}
                  type="password"
                  size="large"
                  placeholder="Tu contraseña"
                />
              </Form.Item>
              <Form.Item>
                <a className="login-form-forgot" href="">
                  ¿Olvidaste tu contraseña?
                </a>
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" className="login-form-button">
                  Acceder
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </Col>
      <Col xs={24}>
        <div className="footer-content">
          <img className="logo" src={logo} alt="Tedy"/>
          <p className="extra-text">Innovation in logistics 4.0</p>
        </div>
      </Col>
    </Row>
  );
};


function mapStateToProps(state) {
  return {};
};

const mapDispatchToProps = {
  goToHome: () => push(PRODUCTS_LIST),
};

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);
