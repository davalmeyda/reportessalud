import {
    LLENAR_DATOS,
    LLENAR_GRAFICO_CITAS,
    CARGANDO_GRAFICO,
    LLENAR_DATOS_PROGRAMACION,
    CARGANDO_DATOS_PROGRAMACION,
    MODIFICAR_FECHA_PROGRAMACION
} from "../../constants/ActionTypes";

const INIT_STATE = {
    voluntarias: '0000',
    recitas: '0000',
    interconsultas: '0000',
    linea: '0000',
    datosGraficos: [],
    cargandoGrafico: false,
    // DATOS DE PROGRAMACION
    datosProgramacion: [{}],
    cargandoDatosProgramacion: false,
    fechaProgramacion: '',
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case LLENAR_DATOS:
            const { voluntarias, recitas, interconsultas, linea } = action.payload;
            return {
                ...state,
                voluntarias,
                recitas,
                interconsultas,
                linea,
            }
        case LLENAR_GRAFICO_CITAS:
            const datosGraficos = action.payload;
            return {
                ...state,
                datosGraficos,
            }
        case CARGANDO_GRAFICO:
            const cargandoGrafico = action.payload;
            return {
                ...state,
                cargandoGrafico,
            }
        case LLENAR_DATOS_PROGRAMACION:
            const datosProgramacion = action.payload;
            return {
                ...state,
                datosProgramacion,
            }
        case CARGANDO_DATOS_PROGRAMACION:
            const cargandoDatosProgramacion = action.payload;
            return {
                ...state,
                cargandoDatosProgramacion,
            }
        case MODIFICAR_FECHA_PROGRAMACION:
            const fechaProgramacion = action.payload;
            return {
                ...state,
                fechaProgramacion,
            }
        default:
            return state;
    }
}