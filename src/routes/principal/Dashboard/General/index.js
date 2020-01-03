import React, { Component } from 'react';
// FIREBASE
import firebase from 'firebase'
import 'firebase/auth';
// COMPONENTES
import { Col, Row } from "antd";
import Auxiliary from "util/Auxiliary";
import BienvenidoCard from "components/dashboard/general/BienvenidoCard";
import SiteAudience from "components/dashboard/CRM/SiteAudience";
import AdmisionChar from "components/dashboard/general/AdimisionChar";
import Widget from "components/Widget";
// ESTILOS
import './style.css'
// CONECTOR REDUX
import { connect } from "react-redux";
import { llenarDatos, llenarGraficoCitas } from "appRedux/actions/General";
// BARRA DE PROGRESO
import CircularProgress from "components/CircularProgress";
// IMPORTAMOS EL PROVIDER
import GeneralProvider from "../../../../providers/dashboard/General_provider";
import HerramientasProviders from '../../../../providers/herramientas_providers';
// IMPORTAMOS CONFIGURACIONES
import { DIAS_GRAFICO_CITAS } from "../../../../constants/configuraciones";
// NOTIFICACIONES
import { NotificationContainer, NotificationManager } from "react-notifications";
import IntlMessages from "util/IntlMessages";


class GeneralPage extends Component {
    state = {
        dataGrafico: [],
        nombre: ''
    }

    generalProvider = new GeneralProvider();
    herramientasProvider = new HerramientasProviders();


    datosCitas = async () => {

        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                this.setState({
                    nombre: user.displayName,
                });
            }
        });
        let fechaActual = this.herramientasProvider.fechaActual(new Date(Date.now()));

        const dataActual = await this.generalProvider.citasPorServicios(fechaActual, fechaActual);
        // VALIDAMOS SI HAY DATOS PARA MOSTRAR
        if (dataActual[0].CENTRO === " NO HAY REGISTROS ENCONTRADOS") {
            // NOTIFICACION
            NotificationManager.error(<IntlMessages id="verifique su conexion a internet" />, <IntlMessages
                id="NO HAY SERVIDOR" />, 60000);

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

        if (this.props.datosGraficos.length === 0) {
            this.props.llenarGraficoCitas(await this.generalProvider.datosGraficoCitas(DIAS_GRAFICO_CITAS))
        }
    }

    componentDidMount = async () => {
        await this.datosCitas();
    }

    render() {

        const { voluntarias, recitas, linea, interconsultas, datosGraficos } = this.props

        return (
            <Auxiliary>
                <Row>
                    <Col span={24}>
                        <div className="gx-card">
                            <div className="gx-card-body">
                                <Row>
                                    <Col xl={6} lg={12} md={12} sm={12} xs={24}>
                                        <BienvenidoCard nombre={this.state.nombre} voluntarias={voluntarias} recitas={recitas} linea={linea} interconsultas={interconsultas} />
                                    </Col>

                                    <Col xl={12} lg={24} md={24} sm={24} xs={24} className="gx-visit-col">
                                        {datosGraficos.length === 0 ? <CircularProgress className="heightLoader" /> : <AdmisionChar data={datosGraficos} />}
                                    </Col>

                                    <Col xl={6} lg={12} md={12} sm={12} xs={24} className="gx-audi-col">
                                        <SiteAudience />
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    </Col>
                    <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                        <Widget title='Programación de médicos en el día'>
                            <h1>p</h1>
                        </Widget>
                    </Col>
                    <Col xl={10} lg={24} md={24} sm={24} xs={24}>
                        <Widget title='Atenciones en el día'>
                            <h1>p</h1>
                        </Widget>
                    </Col>
                    <Col xl={14} lg={24} md={24} sm={24} xs={24}>
                        <Widget title=''>
                            <h1>p</h1>
                        </Widget>
                    </Col>
                </Row>
                {/* ESPACIO PARA MOSTRAR LAS NOTIFICACIONES */}
                <NotificationContainer/>
            </Auxiliary>
        );
    }
}

const mapStateToProps = ({ General, auth }) => {
    return { ...General, ...auth };
};

const mapDispatchToProps = {
    llenarDatos,
    llenarGraficoCitas,
}

export default connect(mapStateToProps, mapDispatchToProps)(GeneralPage);