import React, { Component } from 'react';

import { Col, Row } from "antd";
import Auxiliary from "util/Auxiliary";
import BienvenidoCard from "components/dashboard/general/BienvenidoCard";
import SiteAudience from "components/dashboard/CRM/SiteAudience";
import AdmisionChar from "components/dashboard/general/AdimisionChar";
import Widget from "components/Widget";

import './style.css'
// CONECTOR REDUX
import { connect } from "react-redux";
import { llenarDatos, llenarGraficoCitas } from "appRedux/actions/General";
// BARRA DE PROGRESO
import CircularProgress from "components/CircularProgress";
// IMPORTAMOS EL PROVIDER
import GeneralProvider from "../../../../providers/dashboard/General_provider";
import LoginProvider from "../../../../providers/login_provider";
import HerramientasProviders from '../../../../providers/herramientas_providers';

class GeneralPage extends Component {
    state = {
        dataGrafico: [],
    }

    generalProvider = new GeneralProvider();
    herramientasProvider = new HerramientasProviders();


    datosCitas = async () => {
        let fechaActual = this.herramientasProvider.fechaActual(new Date(Date.now()));

        await LoginProvider.sesionExplota('Khronos92', '47813783');
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

        if (this.props.datosGraficos.length === 0) {
            this.props.llenarGraficoCitas(await this.generalProvider.datosGraficoCitas(15))
        }
    }

    componentDidMount = async () => {

        await this.datosCitas();
    }

    render() {

        const { voluntarias, recitas, linea, interconsultas } = this.props

        return (
            <Auxiliary>
                <Row>
                    <Col span={24}>
                        <div className="gx-card">
                            <div className="gx-card-body">
                                <Row>
                                    <Col xl={6} lg={12} md={12} sm={12} xs={24}>
                                        <BienvenidoCard voluntarias={voluntarias} recitas={recitas} linea={linea} interconsultas={interconsultas} />
                                    </Col>

                                    <Col xl={12} lg={24} md={24} sm={24} xs={24} className="gx-visit-col">
                                        {this.props.datosGraficos.length === 0 ? <CircularProgress className="heightLoader" /> : <AdmisionChar data={this.props.datosGraficos} />}
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
}

export default connect(mapStateToProps, mapDispatchToProps)(GeneralPage);