import React, { Component } from "react";
import { Layout, Popover } from "antd";
import { Link } from "react-router-dom";

import CustomScrollbars from "util/CustomScrollbars";
import languageData from "./languageData";
import { switchLanguage, toggleCollapsedSideNav } from "../../appRedux/actions/Setting";
import SearchBox from "components/SearchBox";
import UserInfo from "components/UserInfo";
import AppNotification from "components/AppNotification";
import MailNotification from "components/MailNotification";
import Auxiliary from "util/Auxiliary";

import { NAV_STYLE_DRAWER, NAV_STYLE_FIXED, NAV_STYLE_MINI_SIDEBAR, TAB_SIZE } from "../../constants/ThemeSetting";
import { connect } from "react-redux";
// BOTON DE CARGA
import { Button } from "antd";
// PROVIDERS
import HerramientasProviders from "../../providers/herramientas_providers";
import GeneralProvider from "../../providers/dashboard/General_provider";
// REDUX
import { llenarDatos, llenarGraficoCitas } from "appRedux/actions/General";
// CONSTANTES
import { DIAS_GRAFICO_CITAS } from "../../constants/configuraciones";

const { Header } = Layout;

class Topbar extends Component {

  state = {
    searchText: '',
    textActualizar: 'Actualizar',
    loadingActualizar: false,
  };

  herramientasProvider = new HerramientasProviders();
  generalProvider = new GeneralProvider();

  datosCitas = async () => {

    let fechaActual = this.herramientasProvider.formatFecha(new Date(Date.now()));

    const dataActual = await this.generalProvider.citasPorServicios(fechaActual, fechaActual);
    // VALIDAMOS SI HAY DATOS PARA MOSTRAR
    if (dataActual[0].CENTRO === " NO HAY REGISTROS ENCONTRADOS") {
      this.props.llenarDatos({
        voluntarias: '0000',
        recitas: '0000',
        linea: '0000',
        interconsultas: '0000',
      });
    } else {
      const voluntarias = this.herramientasProvider.sumaValorColumna(dataActual, 'VOLUNTARIAS');
      const recitas = this.herramientasProvider.sumaValorColumna(dataActual, 'RECITAS');
      const interconsultas = this.herramientasProvider.sumaValorColumna(dataActual, 'INTERCONSULTAS');
      const linea = this.herramientasProvider.sumaValorColumna(dataActual, 'ESSAENLINEA');

      this.props.llenarDatos({ voluntarias, recitas, linea, interconsultas });
    };
    console.log(dataActual);

    this.props.llenarGraficoCitas(await this.generalProvider.datosGraficoCitas(DIAS_GRAFICO_CITAS));
  }


  actualizar = async () => {
    this.setState({
      textActualizar: 'Actualizando...',
      loadingActualizar: true,
    })
    await this.datosCitas();
    this.setState({
      textActualizar: 'Actualizar',
      loadingActualizar: false,
    })
  }

  languageMenu = () => (
    <CustomScrollbars className="gx-popover-lang-scroll">
      <ul className="gx-sub-popover">
        {languageData.map(language =>
          <li className="gx-media gx-pointer" key={JSON.stringify(language)} onClick={(e) =>
            this.props.switchLanguage(language)
          }>
            <i className={`flag flag-24 gx-mr-2 flag-${language.icon}`} />
            <span className="gx-language-text">{language.name}</span>
          </li>
        )}
      </ul>
    </CustomScrollbars>);

  updateSearchChatUser = (evt) => {
    this.setState({
      searchText: evt.target.value,
    });
  };


  render() {
    const { width, navCollapsed, navStyle } = this.props;
    return (
      <Auxiliary>
        <Header>
          {navStyle === NAV_STYLE_DRAWER || ((navStyle === NAV_STYLE_FIXED || navStyle === NAV_STYLE_MINI_SIDEBAR) && width < TAB_SIZE) ?
            <div className="gx-linebar gx-mr-3">
              <i className="gx-icon-btn icon icon-menu"
                onClick={() => {
                  this.props.toggleCollapsedSideNav(!navCollapsed);
                }}
              />
            </div> : null}
          <Link to="/" className="gx-d-block gx-d-lg-none gx-pointer">
            <img alt="" src={require("assets/images/w-logo.png")} /></Link>

          <SearchBox styleName="gx-d-none gx-d-lg-block gx-lt-icon-search-bar-lg"
            placeholder="buscar en la aplicacion..."
            onChange={this.updateSearchChatUser.bind(this)}
            value={this.state.searchText} />
          <ul className="gx-header-notifications gx-ml-auto">
            <li className="gx-notify gx-notify-search gx-d-inline-block gx-d-lg-none">
              <Popover overlayClassName="gx-popover-horizantal" placement="bottomRight" content={
                <SearchBox styleName="gx-popover-search-bar"
                  placeholder="buscar en la aplicacion..."
                  onChange={this.updateSearchChatUser.bind(this)}
                  value={this.state.searchText} />
              } trigger="click">
                <span className="gx-pointer gx-d-block"><i className="icon icon-search-new" /></span>
              </Popover>
            </li>
            {width >= TAB_SIZE ? null :
              <Auxiliary>
                <li className="gx-notify">
                  <Popover overlayClassName="gx-popover-horizantal" placement="bottomRight" content={<AppNotification />}
                    trigger="click">
                    <span className="gx-pointer gx-d-block"><i className="icon icon-notification" /></span>
                  </Popover>
                </li>

                <li className="gx-msg">
                  <Popover overlayClassName="gx-popover-horizantal" placement="bottomRight"
                    content={<MailNotification />} trigger="click">
                    <span className="gx-pointer gx-status-pos gx-d-block">
                      <i className="icon icon-chat-new" />
                      <span className="gx-status gx-status-rtl gx-small gx-orange" />
                    </span>
                  </Popover>
                </li>
              </Auxiliary>
            }
            <li>
              <Button style={{ margin: '0px' }} onClick={this.actualizar} type="primary" loading={this.state.loadingActualizar}>
                {this.state.textActualizar}
              </Button>
            </li>
            {/* <li className="gx-language">
              <Popover overlayClassName="gx-popover-horizantal" placement="bottomRight" content={this.languageMenu()}
                       trigger="click">
                <span className="gx-pointer gx-flex-row gx-align-items-center">
                  <i className={`flag flag-24 flag-${locale.icon}`}/>
                  <span className="gx-pl-2 gx-language-name">{locale.name}</span>
                  <i className="icon icon-chevron-down gx-pl-2"/>
                </span>
              </Popover>
            </li> */}
            {width >= TAB_SIZE ? null :
              <Auxiliary>
                <li className="gx-user-nav"><UserInfo /></li>
              </Auxiliary>
            }
          </ul>
        </Header>
      </Auxiliary>
    );
  }
}

const mapStateToProps = ({ settings }) => {
  const { locale, navStyle, navCollapsed, width } = settings;
  return { locale, navStyle, navCollapsed, width }
};

// const mapDispatchToProps = {
//   llenarDatos,
//   llenarGraficoCitas,
//   toggleCollapsedSideNav,
//   switchLanguage
// }

export default connect(mapStateToProps, { toggleCollapsedSideNav, switchLanguage, llenarGraficoCitas, llenarDatos })(Topbar);
