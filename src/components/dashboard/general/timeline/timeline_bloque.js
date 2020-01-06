import React, { Component } from 'react';
import Gantt from './Gantt';

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

  render() {
    const { currentZoom } = this.state;
    return (
      <div style={{ zoom: '0.9' }}>
        <div className="zoom-bar">
          {/* <Toolbar
            zoom={currentZoom}
            onZoomChange={this.handleZoomChange}
          /> */}
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

export default TimeLineBloque;