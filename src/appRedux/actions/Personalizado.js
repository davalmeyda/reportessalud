import { LLENAR_DATOS } from "../../constants/ActionTypes";

export const llenarDatos = (datos) => {
    return {
        type: LLENAR_DATOS,
        payload: datos,
    }
};