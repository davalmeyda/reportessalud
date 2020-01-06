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
import { llenarDatos, llenarGraficoCitas, cargandoGraficoF, llenarDatosProgramacion, cargandoDatosProgramacionF, modificarFechaProgramacion } from "appRedux/actions/General";
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
// IMPORTAR TIMELINE
import TimelineBloque from "../../../../components/dashboard/general/timeline/timeline_bloque";
// DATAPICKER PARA LA FECHA
import { DatePicker } from "antd";
import moment from "moment";


class GeneralPage extends Component {
    state = {
        nombre: ''
    }

    generalProvider = new GeneralProvider();
    herramientasProviders = new HerramientasProviders();

    // INFORMACION DE CITAS Y BIENVENIDO
    datosCitas = async () => {

        let fechaActual = this.herramientasProviders.formatFecha(new Date(Date.now()));

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
            const voluntarias = this.herramientasProviders.sumaValorColumna(dataActual, 'VOLUNTARIAS');
            const recitas = this.herramientasProviders.sumaValorColumna(dataActual, 'RECITAS');
            const interconsultas = this.herramientasProviders.sumaValorColumna(dataActual, 'INTERCONSULTAS');
            const linea = this.herramientasProviders.sumaValorColumna(dataActual, 'ESSAENLINEA');

            this.props.llenarDatos({ voluntarias, recitas, linea, interconsultas });
        };

        console.log(dataActual);

        this.props.cargandoGraficoF(true);
        this.props.llenarGraficoCitas(await this.generalProvider.datosGraficoCitas(DIAS_GRAFICO_CITAS));

    }
    datosProgramacion = async () => {
        this.props.cargandoDatosProgramacionF(true);
        const fecha = this.props.fechaProgramacion === '' ? new Date(Date.now()) : this.props.fechaProgramacion;
        const programacion = await this.generalProvider.gadgetProgramacionMedicos(fecha);
        console.log(programacion)
        this.props.llenarDatosProgramacion(programacion);
    }
    // TIMELINE
    componentDidMount = () => {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                this.setState({
                    nombre: user.displayName,
                });
            }
        });
        if (!this.props.cargandoGrafico) {
            this.datosCitas();
        }
        if (!this.props.cargandoDatosProgramacion) {
            this.datosProgramacion();
        }
    }

    cambioFecha = async (value) => {
        this.props.llenarDatosProgramacion([{}]);
        this.props.modificarFechaProgramacion(value._d);
        const programacion = await this.generalProvider.gadgetProgramacionMedicos(value._d);
        console.log(programacion)
        this.props.llenarDatosProgramacion(programacion);
    }

    render() {
        const { voluntarias, recitas, linea, interconsultas, datosGraficos, datosProgramacion } = this.props
        const fecha = this.props.fechaProgramacion === '' ? this.herramientasProviders.formatFecha(new Date(Date.now())) : this.herramientasProviders.formatFecha(this.props.fechaProgramacion);
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
                    <Col xl={16} lg={24} md={24} sm={24} xs={24}>
                        <div className='ant-card gx-card-widget ant-card-bordered'>
                            <div className="ant-card-head">
                                <div className='ant-card-head-wrapper'>
                                    <div className='ant-card-head-title'>
                                        <div className='ant-row'>
                                            <div style={{ margin: 'auto' }} className='ant-col ant-col-md-17'>
                                                Programación de médicos en el día
                                            </div>
                                            <div style={{ margin: 'auto' }} className='ant-col ant-col-md-2'>
                                                <div>Fecha</div>
                                            </div>
                                            <div className='ant-col ant-col-md-5' >
                                                <DatePicker className=" gx-w-100" onChange={value => this.cambioFecha(value)} defaultValue={moment(fecha, 'DD/MM/YYYY')} format={'DD/MM/YYYY'} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='ant-card-body'>
                                {datosProgramacion.length === 1 ? <CircularProgress className='programacion' /> : <TimelineBloque data={datosProgramacion}></TimelineBloque>}
                            </div>
                        </div>
                        {/* <Widget title='Programación de médicos en el día'>
                            {datosProgramacion.length === 1 ? <CircularProgress className='programacion' /> : <TimelineBloque data={datosProgramacion}></TimelineBloque>}
                        </Widget> */}
                    </Col>
                    <Col xl={8} lg={24} md={24} sm={24} xs={24}>
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
                <NotificationContainer />
            </Auxiliary>
        );
    }
}

const mapStateToProps = ({ General }) => {
    return General;
};

const mapDispatchToProps = {
    llenarDatos,
    llenarGraficoCitas,
    cargandoGraficoF,
    llenarDatosProgramacion,
    cargandoDatosProgramacionF,
    modificarFechaProgramacion,
}

export default connect(mapStateToProps, mapDispatchToProps)(GeneralPage);