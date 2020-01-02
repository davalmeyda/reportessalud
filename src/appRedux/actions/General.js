import { LLENAR_DATOS, LLENAR_GRAFICO_CITAS} from "../../constants/ActionTypes";

export const llenarDatos = (datos) => {
    return {
        type: LLENAR_DATOS,
        payload: datos,
    }
};
export const llenarGraficoCitas =(dataGrafico)=>{
    return {
        type: LLENAR_GRAFICO_CITAS,
        payload: dataGrafico,
    }
}