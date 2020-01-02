// IMPORTAMOS EL QUERY QUE COMVERTIRA EL CUERPO DEL POST PARA ENVIARLO POR AXIOS
import qs from 'querystring';
import axios from 'axios';
// CONVERTIDOR DE CSV A JSON
import papaparse from 'papaparse';

class ConexionesProvider {
    _traerdatosSGSSExplota = async (url) => {
        const resp = await axios.get(url,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                withCredentials: true,
                responseType: 'blob',
            }).catch(function (error) {
                console.log(error);
            });
        const blob = resp.data;
        return blob;
    }

    _traerdatosExplota = async (parametros, url) => {
        const resp = await axios.post(url,
            qs.stringify(parametros), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            withCredentials: true,

        }).catch(function (error) {
            console.log(error);
        });

        const txt = resp.data.split("|")[4];        

        const resp1 = await axios.get(`${url}_descarga&fn=${txt}`);
        // DATA EN BRUTO
        // console.log(resp1.data);
        // CONVIRTIENDO A JSON
        const result = papaparse.parse(resp1.data, {
            delimiter: "|",
            header: true,
        });
        const data = result.data;

        // ARCHIVO JSON
        return data;
    }
}
export default ConexionesProvider;