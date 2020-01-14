import React, { Component } from 'react';
import { gantt } from 'dhtmlx-gantt';
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css';

export default class Gantt extends Component {

  // instance of gantt.dataProcessor
  dataProcessor = null;

  /**
   * applies one of the predefined settings of the time scale
   */
  setZoom(value) {
    switch (value) {
      case 'Hours':
        gantt.config.scale_unit = 'day';
        gantt.config.date_scale = '%d %M';

        gantt.config.scale_height = 60;
        gantt.config.min_column_width = 30;
        gantt.config.subscales = [
          { unit: 'hour', step: 1, date: '%H' }
        ];
        break;
      // case 'Days':
      //   gantt.config.min_column_width = 70;
      //   gantt.config.scale_unit = 'week';
      //   gantt.config.date_scale = '#%W';
      //   gantt.config.subscales = [
      //     { unit: 'day', step: 1, date: '%d %M' }
      //   ];
      //   gantt.config.scale_height = 60;
      //   break;
      default:
        break;
    }
  }

  initGanttDataProcessor() {
    /**
     * type: "task"|"link"
     * action: "create"|"update"|"delete"
     * item: data object object
     */

    const onDataUpdated = this.props.onDataUpdated;
    this.dataProcessor = gantt.createDataProcessor((type, action, item, id) => {
      return new Promise((resolve, reject) => {
        if (onDataUpdated) {
          onDataUpdated(type, action, item, id);
        }

        // if onDataUpdated changes returns a permanent id of the created item, you can return it from here so dhtmlxGantt could apply it
        // resolve({id: databaseId});
        return resolve();
      });
    });
  }

  shouldComponentUpdate(nextProps) {
    return this.props.zoom !== nextProps.zoom;
  }

  componentDidUpdate() {
    gantt.render();
  }

  async componentDidMount() {
    gantt.config.xml_date = "%Y-%m-%d %H:%i";
    // CONFIGURAR EL PASO EN HORAS
    gantt.config.duration_unit = "hour";
    gantt.config.duration_step = 1;
    // SOLO LECTURA
    gantt.config.readonly = true;
    // gantt.config.sort = true; 
    // CONFIGURAR COLUMNAS
    gantt.config.date_scale = "%F, %Y";
    gantt.config.columns = [
      { name: "text", label: "SERVICIOS", width: "350", tree: true },
    ];
    const ttt = {
      data: this.props.data,
    }

    gantt.init(this.ganttContainer);
    this.initGanttDataProcessor();
    // LIMPIAR 
    gantt.clearAll();
    // CARGAR DATA EN TIMELINE
    gantt.parse(ttt);
    // ORDENAR COLUMNAS
    gantt.sort("text", false);
  }

  componentWillUnmount() {
    if (this.dataProcessor) {
      this.dataProcessor.destructor();
      this.dataProcessor = null;
    }
  }

  render() {
    const { zoom } = this.props;
    this.setZoom(zoom);
    return (
      <div
        ref={(input) => { this.ganttContainer = input }}
        style={{ width: '100%', height: '100%' }}
      ></div>
    );

  }
}
