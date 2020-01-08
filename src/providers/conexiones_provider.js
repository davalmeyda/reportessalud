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

    _traerdatosExplota = async (parametros, url, tipo) => {
        const resp = await axios.post(url,
            qs.stringify(parametros), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            withCredentials: true,
        }).catch(function (error) {
            console.log(error);
        });

        if (resp === undefined) {
            console.log('NO HAY ACCESO AL SERVIDOR');
            return [{
                CENTRO: " NO HAY REGISTROS ENCONTRADOS",
            }]
        } else {

            const txt = resp.data.split("|")[4];
            let resp1;
            if (tipo === 'xls') {
                resp1 = await axios.get(`${url}_descarga&fn=${txt}`);
                // DATA EN BRUTO
                // console.log(resp1.data);
                // CONVIRTIENDO A JSON
                const result = papaparse.parse(resp1.data, {
                    delimiter: "|",
                    header: true,
                    withCredentials: true
                });
                const data = result.data;
                // console.log(data);
                // ARCHIVO JSON
                return data;
            } else if (tipo === 'pdf') {
                resp1 = await axios.get(`${url}_2&fn=${txt}`, {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    withCredentials: true,
                    responseType: 'blob',
                });
                console.log(resp1.data)
                const blob = new Blob([resp1.data], {
                    type: 'application/pdf',
                })
                console.log(blob);
                return resp1.data;
            } else if (tipo === 'otroxls'){
                resp1 = await axios.get(`${url}_xls&fn=${txt}`);
                // DATA EN BRUTO
                // console.log(resp1.data);
                // CONVIRTIENDO A JSON
                const result = papaparse.parse(resp1.data, {
                    delimiter: "|",
                    header: true,
                    withCredentials: true
                });
                const data = result.data;
                // console.log(data);
                // ARCHIVO JSON
                return data;
            }
        }

    }
}
export default ConexionesProvider;