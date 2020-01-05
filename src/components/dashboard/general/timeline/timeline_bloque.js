import React, { Component } from 'react';
import Gantt from './Gantt';

import { DatePicker } from "antd";
import moment from "moment";
// CONECTOR REDUX
import { connect } from "react-redux";
import { modificarFechaProgramacion, llenarDatosProgramacion } from "appRedux/actions/General";
// PROVIDER
import GeneralProvider from '../../../../providers/dashboard/General_provider';
import HerramientasProviders from '../../../../providers/herramientas_providers';


// static data for our gantt chart

class TimeLineBloque extends Component {
  state = {
    currentZoom: 'Hours',
    messages: [],
  };

  addMessage(message) {
    const maxLogLength = 5;
    const newMessate = { message };
    const messages = [
      newMessate,
      ...this.state.messages
    ];

    if (messages.length > maxLogLength) {
      messages.length = maxLogLength;
    }
    this.setState({ messages });
  }

  logDataUpdate = (type, action, item, id) => {
    let text = item && item.text ? ` (${item.text})` : '';
    let message = `${type} ${action}: ${id} ${text}`;
    if (type === 'link' && action !== 'delete') {
      message += ` ( source: ${item.source}, target: ${item.target} )`;
    }
    this.addMessage(message);
  }

  handleZoomChange = (zoom) => {
    this.setState({
      currentZoom: zoom
    });
  }

  generalProvider = new GeneralProvider();
  herramientasProviders = new HerramientasProviders();

  cambio = async (value) => {
    this.props.llenarDatosProgramacion([{}]);
    this.props.modificarFechaProgramacion(value._d);
    const programacion = await this.generalProvider.gadgetProgramacionMedicos(value._d);
    console.log(programacion)
    this.props.llenarDatosProgramacion(programacion);
  }

  render() {
    const { currentZoom } = this.state;
    const fecha = this.props.fechaProgramacion === '' ? this.herramientasProviders.formatFecha(new Date(Date.now())) : this.herramientasProviders.formatFecha(this.props.fechaProgramacion);
    return (
      <div>
        <div className="zoom-bar">
          {/* <Toolbar
            zoom={currentZoom}
            onZoomChange={this.handleZoomChange}
          /> */}
          <div className='ant-row gx-mb-3'>
            <div className='ant-col ant-col-md-18'></div>
            <div style={{margin: 'auto'}} className='ant-col ant-col-md-1'>
              <div>Fecha</div>
            </div>
            <div className='ant-col ant-col-md-5' >
              
              <DatePicker className=" gx-w-100" onChange={value => this.cambio(value)} defaultValue={moment(fecha, 'DD/MM/YYYY')} format={'DD/MM/YYYY'} />
            </div>
          </div>
        </div>
        <div className="gantt-container">
          <Gantt
            data={this.props.data}
            zoom={currentZoom}
            onDataUpdated={this.logDataUpdate}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ General }) => {
  const { fechaProgramacion } = General
  return { fechaProgramacion };
};

export default connect(mapStateToProps, { modificarFechaProgramacion, llenarDatosProgramacion })(TimeLineBloque);