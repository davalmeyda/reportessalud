import React, { Component } from "react";
import { connect } from "react-redux";
import { Avatar, Popover } from "antd";
import { userSignOut } from "appRedux/actions/Auth";

import firebase from 'firebase/app';
import 'firebase/auth';

class UserInfo extends Component {

  state = {
    url: '',
  }
  foto = 'https://images.vexels.com/media/users/3/135247/isolated/preview/e70a6296c2a79dc7a56ab05b103f38e8-signo-de-usuario-con-fondo-by-vexels.png';
  componentDidMount = () => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({
          url: user.photoURL,
        })
      }
    });
  }

  render() {
    const userMenuOptions = (
      <ul className="gx-user-popover">
        <li>Mi cuenta</li>
        <li>Configuraciones</li>
        <li onClick={() => this.props.userSignOut()}>Salir
        </li>
      </ul>
    );

    return (
      <Popover overlayClassName="gx-popover-horizantal" placement="bottomRight" content={userMenuOptions}
        trigger="click">
        <Avatar src={this.state.url === null ? this.foto : this.state.url}
          className="gx-avatar gx-pointer" alt="" />
      </Popover>
    )

  }
}

export default connect(null, { userSignOut })(UserInfo);
