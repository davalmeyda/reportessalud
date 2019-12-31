import React, { Component } from "react";
import { connect } from "react-redux";
import { Avatar, Popover } from "antd";
import { userSignOut } from "appRedux/actions/Auth";
import firebase from 'firebase/app';
import 'firebase/auth';

class UserProfile extends Component {

  state = {
    nombre: '',
    url: '',
  }

  foto ='https://images.vexels.com/media/users/3/135247/isolated/preview/e70a6296c2a79dc7a56ab05b103f38e8-signo-de-usuario-con-fondo-by-vexels.png';

  componentDidMount = () => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        console.log(user)
        this.setState({
          nombre: user.displayName,
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
        <li onClick={() => this.props.userSignOut()}>
          Salir
        </li>
      </ul>
    );
    const nnn = this.state.nombre.split(' ');
    return (
      <div className="gx-flex-row gx-align-items-center gx-mb-4 gx-avatar-row">
        <Popover placement="bottomRight" content={userMenuOptions} trigger="click">
          <Avatar src={this.state.url === null ? this.foto : this.state.url}
            className="gx-size-40 gx-pointer gx-mr-3" alt="" />
          <span className="gx-avatar-name">{nnn.length > 2 ? nnn[0] + ' ' + nnn[2] : this.state.nombre}<i
            className="icon icon-chevron-down gx-fs-xxs gx-ml-2" /></span>
        </Popover>
      </div>

    )

  }
}

export default connect(null, { userSignOut })(UserProfile);
