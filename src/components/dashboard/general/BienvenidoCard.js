import React from "react";
import { Icon } from "antd";

const BienvenidoCard = (props) => {

  const { voluntarias, recitas, linea, interconsultas, nombre } = props

  return (
    <div className="gx-wel-ema gx-pt-xl-2">
      <h1 className="gx-mb-3">Bienvenido {nombre.split(' ')[0]}!</h1>
      <p className="gx-fs-sm gx-text-uppercase">Citas realizadas en el dia</p>
      <ul className="gx-list-group">
        <li>
          <Icon type="check" />
          <span>{voluntarias} Citas Voluntarias</span>
        </li>
        <li>
          <Icon type="retweet" />
          <span>{recitas} Recitas</span>
        </li>
        <li>
          <Icon type="fullscreen-exit" />
          <span>{interconsultas} Interconsultas</span>
        </li>
        <li>
          <Icon type="cloud" />
          <span>{linea} En Linea</span>
        </li>
      </ul>
    </div>

  );
};

export default BienvenidoCard;
