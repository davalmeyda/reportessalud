import React from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip,XAxis } from "recharts";
import { siteVisit } from "../../../routes/principal/Dashboard/General/data";

const AdmisionChar = () => (
  <div className="gx-site-dash gx-pr-xl-5 gx-pt-3 gx-pt-xl-0 gx-pt-xl-2">
    <h6 className="gx-text-uppercase gx-mb-2 gx-mb-xl-4">Reporte Citas</h6>
    <ResponsiveContainer width="100%" height={150}>
      <AreaChart data={siteVisit}
        margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
        <XAxis dataKey="name" />
        <Tooltip />
        <CartesianGrid horizontal={false} strokeDasharray="3 3" />
        <Area type='monotone' dataKey='Dadas' fillOpacity={1} stroke='#038FDE' fill='#038FDE' />
        <Area type='monotone' dataKey='Atendidas' fillOpacity={1} stroke='#FE9E15' fill='#FE9E15'/>
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

export default AdmisionChar;

