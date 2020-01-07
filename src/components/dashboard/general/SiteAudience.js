import React from "react";

import LineIndicator from "./LineIndicator";

const SiteAudience = (props) => {

  const data = props.data;

  console.log(data, 'Data de Edades');

  let total = 0; let edad5 = 0; let edad5A = 0; let edad18 = 0; let edad18A = 0; let edadMas = 0; let edadMasA = 0;

  if (data.length > 1) {
    for (let index = 0; index < data.length; index++) {
      total += data[index];
    }
    for (let index = 0; index < data.length; index++) {
      const element = data[index];
      if (index === 0) {
        edad5A = element;
        edad5 = Math.round((element * 100) / total);
      } else if (index === 1) {
        edad18A = element;
        edad18 = Math.round((element * 100) / total);
      } else if (index === 2) {
        edadMasA = element;
        edadMas = Math.round((element * 100) / total);
      }
    }
  }

  return (
    <div className="gx-site-dash gx-mb-2 gx-pt-3 gx-pt-sm-0 gx-pt-xl-2">
      <h6 className="gx-text-uppercase gx-mb-2 gx-mb-sm-4">EDADES DE PACIENTES ATENDIDOS</h6>
      <ul className="gx-line-indicator">
        <li>
          <LineIndicator width={edad5 + '%'} title={"De 0 a 5 años = " + edad5A} color="cyan" value={edad5 + '%'} />
        </li>
        <li>
          <LineIndicator width={edad18 + '%'} title={"De 5 a 18 años = " + edad18A} color="geekblue" value={edad18 + '%'} />
        </li>
        <li>
          <LineIndicator width={edadMas + '%'} title={"De 18 a más años = " + edadMasA} color="red" value={edadMas + '%'} />
        </li>

      </ul>
    </div>
  )
};
export default SiteAudience;
