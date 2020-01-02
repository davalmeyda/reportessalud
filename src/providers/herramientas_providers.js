class HerramientasProviders {

    // FUNCION QUE AGREGA CEROS AL INICIO
    PadLeft(value, length) {
        return (value.toString().length < length) ? this.PadLeft("0" + value, length) :
            value;
    }

    fechaActual = (fecha) => {
        let fechaActual = ''     

        const dia = this.PadLeft(fecha.getDate(), 2);
        const mes = this.PadLeft(fecha.getMonth() + 1, 2);
        const año = fecha.getFullYear();

        fechaActual = dia + '/' + mes + '/' + año
        return fechaActual;
    }

    ordenarArray = (data, columna) => {
        data.sort((a, b) => {
            if (a[columna] > b[columna]) {
                return 1;
            }
            if (a[columna] < b[columna]) {
                return -1;
            }
            // SI SON IGUALES
            return 0;

        });
        return data;
    }

    sumaValorColumna = (lista, columna) => {
        let suma = 0;
        lista.forEach(d => {
            suma += parseInt(d[columna]) || 0;
        });
        return this.PadLeft(suma, 4);
    }

    agruparArrayValorColumna = (array, columna) => {
        // SEPARAMOS POR CONSULTORIOS
        const dataAreas = [];
        let servicios = [];
        let servicio = "";
        let inicial = true;
        array.forEach((x, i) => {
            if (x[columna] === servicio) {
                servicios.push(x);
            } else {
                if (inicial) {
                    servicio = x[columna];
                    servicios.push(x);
                    inicial = false;
                } else {
                    const ss = servicios
                    dataAreas.push(ss);
                    servicios = [];
                    servicio = x[columna];
                    servicios.push(x);
                }
            }
            if (i === array.length - 1) {
                const ss = servicios
                dataAreas.push(ss);
            }
        });

        return dataAreas;
    }

}
export default HerramientasProviders;