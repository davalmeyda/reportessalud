import { LLENAR_DATOS, LLENAR_GRAFICO_CITAS } from "../../constants/ActionTypes";

const INIT_STATE = {
    voluntarias: '0000',
    recitas: '0000',
    interconsultas: '0000',
    linea: '0000',
    datosGraficos: []
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case LLENAR_DATOS:
            const { voluntarias, recitas, interconsultas, linea } = action.payload;
            return {
                voluntarias,
                recitas,
                interconsultas,
                linea,
                datosGraficos: state.datosGraficos,
            }
        case LLENAR_GRAFICO_CITAS:
            const datosGraficos = action.payload;
            return {
                voluntarias: state.voluntarias,
                recitas: state.recitas,
                interconsultas: state.interconsultas,
                linea: state.linea,
                datosGraficos,
            }
        default:
            return state;
    }
}