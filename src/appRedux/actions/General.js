import {
    LLENAR_DATOS,
    LLENAR_GRAFICO_CITAS,
    CARGANDO_GRAFICO,
    LLENAR_DATOS_PROGRAMACION,
    CARGANDO_DATOS_PROGRAMACION,
    MODIFICAR_FECHA_PROGRAMACION,
    LLENAR_EDADES_CITAS
} from "../../constants/ActionTypes";

export const llenarDatos = (datos) => {
    return {
        type: LLENAR_DATOS,
        payload: datos,
    }
};
export const llenarGraficoCitas = (dataGrafico) => {
    return {
        type: LLENAR_GRAFICO_CITAS,
        payload: dataGrafico,
    }
}
export const cargandoGraficoF = (cargando) => {
    return {
        type: CARGANDO_GRAFICO,
        payload: cargando,
    }
}
export const llenarDatosProgramacion = (datos) => {
    return {
        type: LLENAR_DATOS_PROGRAMACION,
        payload: datos,
    }
}
export const cargandoDatosProgramacionF = (cargando) => {
    return {
        type: CARGANDO_DATOS_PROGRAMACION,
        payload: cargando,
    }
}
export const modificarFechaProgramacion = (fecha)=>{
    return {
        type: MODIFICAR_FECHA_PROGRAMACION,
        payload: fecha,
    }
}
export const llenarEdadesCitas = (data)=>{
    return {
        type: LLENAR_EDADES_CITAS,
        payload: data,
    }
}