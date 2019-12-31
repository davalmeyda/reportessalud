import React from "react";
import {Icon} from "antd";

const BienvenidoCard = () => {

  return (
    <div className="gx-wel-ema gx-pt-xl-2">
      <h1 className="gx-mb-3">Bienvenido David!</h1>
      <p className="gx-fs-sm gx-text-uppercase">Citas realizadas en el dia</p>
      <ul className="gx-list-group">
        <li>
          <Icon type="check"/>
          <span>244 Citas Voluntarias</span>
        </li>
        <li>
          <Icon type="retweet"/>
          <span>006 Recitas</span>
        </li>
        <li>
          <Icon type="fullscreen-exit"/>
          <span>000 Interconsultas</span>
        </li>
        <li>
          <Icon type="cloud"/>
          <span>051 En Linea</span>
        </li>        
      </ul>
    </div>

  );
};

export default BienvenidoCard;
