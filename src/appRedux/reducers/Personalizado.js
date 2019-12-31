import { LLENAR_DATOS } from "../../constants/ActionTypes";

const INIT_STATE = {
    voluntarias: 0,
    recitas: 0,
    interconsultas: 0,
    linea: 0,
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
            }
        default:
            return state;
    }
}