import ConexionesProvider from '../conexiones_provider';
import HerramientasProviders from '../herramientas_providers';

class GeneralProvider {

    conexionesProvider = new ConexionesProvider();
    herramientasProvider = new HerramientasProviders();

    suma2 = (lista) => {
        let suma = 0;
        lista.forEach(d => {
            if (d['ESTADO_CITA'] === 'ATENDIDA') {
                suma += 1;
            }
        });
        return suma;
    }

    obtenerPDFDiferimiento = async (fecha) => {
        const fec = fecha.split('/');
        const hoy = fec[2] + fec[1] + fec[0];
        const inicioMes = fec[2] + fec[1] + '01';
        const url = `/sgssgxreport/servlet/orptdifercitas?2,822,01,,,,${inicioMes},${hoy},1`;
        return await this.conexionesProvider._traerdatosSGSSExplota('a', url);
    }

    pdfDiferimientoExplota = async (FECHA_INICIO_DIFERIMIENTO, fechaActual) => {
        const url = '/explotacionDatos/servlet/CtrlControl?opt=diferimiento_1';
        const parametros = {
            CAS: 822,
            ORIGEN: 2,
            actividad: '00',
            fechaFin: fechaActual,
            fechaInicio: FECHA_INICIO_DIFERIMIENTO,
            formatoArchivo: 'pdf',
            servicio: '00',
            subactividad: '00',
            tipoReporte: '01',
        }
        const aaa = await this.conexionesProvider._traerdatosExplota(parametros, url, 'pdf');
        return aaa
    }

    gadgetPacientesCitados = async () => {

        let fecha = this.herramientasProvider.formatFecha(new Date(Date.now()));
        // let fecha = '17/12/2019';

        // PRUEBAS CON PROGRAMACION        
        const citados = await this.pacientesCitados(fecha, fecha);

        // ELIMINAMOS LA ULTIMA FILA
        citados.splice(citados.length - 1, 1);
        // ORDENAMOS LA INFORMACION 
        citados.sort((a, b) => {
            if (a.SERVICIO > b.SERVICIO) {
                return 1;
            }
            if (a.SERVICIO < b.SERVICIO) {
                return -1;
            }
            // SI SON IGUALES
            return 0;

        });
        console.log(citados);

        // SEPARAMOS POR CONSULTORIOS        
        const dataAreas = this.herramientasProvider.agruparArrayValorColumna(citados, 'SERVICIO');

        return dataAreas;
    }

    ///////////////////////////////////////////////////////////////////////////////////////////

    programacionMedicos = async (fechaFin, fechaInicio) => {
        const url = '/explotacionDatos/servlet/CtrlControl?opt=adm119_xls';
        const parametros = {
            CAS: 822,
            ORIGEN: 2,
            area: '00',
            fechaFin,
            fechaInicio,
            formatoArchivo: 'xls',
            servicio: '00',
        }

        return this.conexionesProvider._traerdatosExplota(parametros, url, 'xls');
    }

    mayor = (lista, columna, ref) => {
        let r = 0;
        let mayor = "";
        lista.forEach(d => {
            if (parseInt(d[ref]) > r) {
                r = parseInt(d[ref]);
                mayor = d[columna];
            }
        });
        return mayor;
    }
    menor = (lista, columna, ref) => {
        let r = 9999;
        let menor = "";
        lista.forEach(d => {
            if (parseInt(d[ref]) < r) {
                r = parseInt(d[ref]);
                menor = d[columna];
            }
        });
        return menor;
    }

    gadgetProgramacionMedicosSubActividad = async (fech) => {
        let fecha = this.herramientasProvider.formatFecha(fech);
        let day = fech.getDate()
        let month = fech.getMonth() + 1
        let year = fech.getFullYear()

        // PRUEBAS CON PROGRAMACION        
        const programacion = await this.programacionMedicos(fecha, fecha);
        // ELIMINAMOS LA ULTIMA FILA
        programacion.splice(programacion.length - 1, 1);
        // ORDENAMOS LA INFORMACION POR SERVICIO 
        programacion.sort((a, b) => {
            if (a.SERVICIO > b.SERVICIO) {
                return 1;
            }
            if (a.SERVICIO < b.SERVICIO) {
                return -1;
            }
            // SI SON IGUALES
            return 0;

        });
        // console.log(programacion, 'PROGRAMACION EN BRUTO');

        // SEPARAMOS POR CONSULTORIOS Y CONVERTIMOS LAS HORAS        
        const dataAreas = [];
        let servicios = [];
        let servicio = "";
        let inicial = true;
        programacion.forEach((x, i) => {
            // CONVERTIMOS LAS HORAS A ENTEROS PARA MANIPULARLO MEJOR
            x['HOR_INICIO'] = parseInt(x['HOR_INICIO'].split(':')[0]);
            x['HOR_FIN'] = parseInt(x['HOR_FIN'].split(':')[0]);
            if (x['SERVICIO'] === servicio && x['ESTADO_PROGRAMACION'] === 'APROBADA') {
                servicios.push(x);
            } else {
                if (inicial && x['ESTADO_PROGRAMACION'] === 'APROBADA') {
                    servicio = x['SERVICIO'];
                    servicios.push(x);
                    inicial = false;
                } else if (x['ESTADO_PROGRAMACION'] === 'APROBADA') {
                    const ss = servicios
                    dataAreas.push(ss);
                    servicios = [];
                    servicio = x['SERVICIO'];
                    servicios.push(x);
                }
            }
            if (i === programacion.length - 1) {
                const ss = servicios
                dataAreas.push(ss);
            }
        });

        // ORDENAMOS LA INFORMACION POR SUB ACTIVIDAD
        dataAreas.forEach(x => {
            x.sort((a, b) => {
                if (a.SUBACTIVIDAD > b.SUBACTIVIDAD) {
                    return 1;
                }
                if (a.SUBACTIVIDAD < b.SUBACTIVIDAD) {
                    return -1;
                }
                // SI SON IGUALES
                return 0;
            });
        })
        // console.log(dataAreas, 'DATAAREAS SEPARADO');

        // OBTENEMOS MAYORES Y MENORES DEL ARREGLO
        const mayores = [];
        const menores = [];
        dataAreas.forEach(d => {
            const may = parseInt(this.mayor(d, 'HOR_FIN', 'HOR_FIN'));
            const men = parseInt(this.menor(d, 'HOR_INICIO', 'HOR_INICIO'));
            mayores.push(may);
            menores.push(men);
        });

        // SEPARAMOS POR SUBACTIVIDAD        
        const dataAreasSubactividades = [];
        dataAreas.forEach((d, iiii) => {
            let subActividades = [];
            let subActividad = "";
            let inicial2 = true;
            const dataSubactividad = [];
            d.forEach((x, i) => {
                if (x['SUBACTIVIDAD'] === subActividad) {
                    subActividades.push(x);
                } else {
                    if (inicial2) {
                        subActividad = x['SUBACTIVIDAD'];
                        subActividades.push(x);
                        inicial2 = false;
                    } else {
                        const ss = subActividades
                        dataSubactividad.push(ss);
                        subActividades = [];
                        subActividad = x['SUBACTIVIDAD'];
                        subActividades.push(x);
                    }
                }
                if (i === d.length - 1) {
                    const ss = subActividades
                    dataSubactividad.push(ss);
                }
            });
            dataAreasSubactividades.push(dataSubactividad);
        });

        // ORDENAMOS DE MENOR A MAYOR LAS HORAS
        dataAreasSubactividades.forEach(x => {
            x.forEach(d => {
                d.sort((a, b) => a['HOR_INICIO'] - b['HOR_INICIO']);
            })
        });

        // console.log(dataAreasSubactividades, 'SEPARADO POR SUBACTIVIDAD');

        // CREAMOS LOS DATOS A USAR
        let index2;
        let index1;
        let parent2;
        let parent1;
        const data1 = [];
        let color = '#A0D4F3';

        dataAreasSubactividades.forEach((d, innn) => {

            d.forEach((x, i) => {

                index1 = (innn + 1) * 1000 + i;
                let itemServicio;
                let itemSubActividad;
                let itemProfesional;
                let inicio2 = false;

                const mayor = this.mayor(x, 'HOR_FIN', 'HOR_FIN');

                if (i === 0) {
                    parent1 = index1;
                    itemServicio = {
                        id: index1,
                        text: d[0][0]['SERVICIO'],
                        start_date: `${year}-${month}-${day} ${menores[innn]}:00`,
                        duration: mayores[innn] - menores[innn],
                        open: false,
                        color: 'rgb(3, 143, 222)',
                    }
                    data1.push(itemServicio);
                }

                x.forEach((xx, ii) => {
                    index2 = index1 + (i + 1) * 100 + ii;
                    if (ii === 0) {
                        parent2 = index2;
                        itemSubActividad = {
                            id: index2,
                            text: x[0]['SUBACTIVIDAD'],
                            start_date: `${year}-${month}-${day} ${x[0]['HOR_INICIO']}:00`,
                            duration: mayor - x[0]['HOR_INICIO'],
                            open: false,
                            parent: parent1,
                            color: '#41AAE6',
                        }
                        itemProfesional = {
                            id: index2 + 1,
                            text: xx['PROFESIONAL'],
                            start_date: `${year}-${month}-${day} ${xx['HOR_INICIO']}:00`,
                            duration: xx['HOR_FIN'] - xx['HOR_INICIO'],
                            parent: parent2,
                            color,
                        }
                        inicio2 = true;
                    } else {
                        itemSubActividad = {
                            id: index2 + 1,
                            text: xx['PROFESIONAL'],
                            start_date: `${year}-${month}-${day} ${xx['HOR_INICIO']}:00`,
                            duration: xx['HOR_FIN'] - xx['HOR_INICIO'],
                            parent: parent2,
                            color,
                        }
                        inicio2 = false;
                    }
                    data1.push(itemSubActividad);
                    if (inicio2) {
                        data1.push(itemProfesional);
                    }
                });
            });

        });

        // console.log(data1, 'DATA FINAL');
        return data1;
    }

    gadgetProgramacionMedicos = async (fech) => {

        let fecha = this.herramientasProvider.formatFecha(fech);
        let day = fech.getDate()
        let month = fech.getMonth() + 1
        let year = fech.getFullYear()
        // console.log(day, month, year)

        // PRUEBAS CON PROGRAMACION        
        const programacion = await this.programacionMedicos(fecha, fecha);
        // ELIMINAMOS LA ULTIMA FILA
        programacion.splice(programacion.length - 1, 1);
        // ORDENAMOS LA INFORMACION POR SERVICIO 
        programacion.sort((a, b) => {
            if (a.SERVICIO > b.SERVICIO) {
                return 1;
            }
            if (a.SERVICIO < b.SERVICIO) {
                return -1;
            }
            // SI SON IGUALES
            return 0;

        });
        // console.log(programacion, 'PROGRAMACION EN BRUTO');

        // SEPARAMOS POR CONSULTORIOS Y CONVERTIMOS LAS HORAS        
        const dataAreas = [];
        let servicios = [];
        let servicio = "";
        let inicial = true;
        programacion.forEach((x, i) => {
            // CONVERTIMOS LAS HORAS A ENTEROS PARA MANIPULARLO MEJOR
            x['HOR_INICIO'] = parseInt(x['HOR_INICIO'].split(':')[0]);
            x['HOR_FIN'] = parseInt(x['HOR_FIN'].split(':')[0]);
            if (x['SERVICIO'] === servicio && x['ESTADO_PROGRAMACION'] === 'APROBADA') {
                servicios.push(x);
            } else {
                if (inicial && x['ESTADO_PROGRAMACION'] === 'APROBADA') {
                    servicio = x['SERVICIO'];
                    servicios.push(x);
                    inicial = false;
                } else if (x['ESTADO_PROGRAMACION'] === 'APROBADA') {
                    const ss = servicios
                    dataAreas.push(ss);
                    servicios = [];
                    servicio = x['SERVICIO'];
                    servicios.push(x);
                }
            }
            if (i === programacion.length - 1) {
                const ss = servicios
                dataAreas.push(ss);
            }
        });

        // ORDENAMOS MAYOR Y EL MENOR DE LAS HORAS
        dataAreas.forEach(x => {
            x.sort((a, b) => a['HOR_INICIO'] - b['HOR_INICIO']);
        });

        // CREAMOS LOS DATOS A USAR
        let index;
        let parent;
        const data1 = [];
        let color = 'rgb(254, 158, 21)';
        // const colores = ['green', 'red', 'blue'];
        dataAreas.forEach((x, i) => {
            let item;
            let item1;
            let inicio = false;
            // inicio

            const mayor = this.mayor(x, 'HOR_FIN', 'HOR_FIN');

            x.forEach((xx, ii) => {
                index = (i + 1) * 100 + ii;
                if (ii === 0) {
                    parent = index;
                    // color = "#" + ((1 << 24) * Math.random() | 0).toString(16);
                    item = {
                        id: index,
                        text: x[0]['SERVICIO'],
                        start_date: `${year}-${month}-${day} ${x[0]['HOR_INICIO']}:00`,
                        duration: mayor - x[0]['HOR_INICIO'],
                        open: false,
                        color: 'rgb(3, 143, 222)',
                    }
                    item1 = {
                        id: index + 1,
                        text: xx['PROFESIONAL'],
                        start_date: `${year}-${month}-${day} ${xx['HOR_INICIO']}:00`,
                        duration: xx['HOR_FIN'] - xx['HOR_INICIO'],
                        parent: parent,
                        color,
                    }
                    inicio = true;
                } else {
                    item = {
                        id: index + 1,
                        text: xx['PROFESIONAL'],
                        start_date: `${year}-${month}-${day} ${xx['HOR_INICIO']}:00`,
                        duration: xx['HOR_FIN'] - xx['HOR_INICIO'],
                        parent: parent,
                        color,
                    }
                    inicio = false;
                }
                data1.push(item);
                if (inicio) {
                    data1.push(item1);
                }
            });
        });
        return data1;
    }

    pacientesCitados = async (fechaFin, fechaInicio) => {
        const url = '/explotacionDatos/servlet/CtrlControl?opt=adm116_xls';
        const parametros = {
            CAS: 822,
            ORIGEN: 2,
            fechaFin,
            fechaInicio,
            formatoArchivo: 'xls',
            servicio: '00',
            subactividad: '00',
            tipoDocumento: '00',
            actividad: '00',
        }
        return this.conexionesProvider._traerdatosExplota(parametros, url, 'xls');
    }

    citasPorServicios = async (fechaFin, fechaInicio) => {
        const url = '/explotacionDatos/servlet/CtrlControl?opt=adm13_xls';
        const parametros = {
            CAS: 822,
            ORIGEN: 2,
            fechaFin,
            fechaInicio,
            formatoArchivo: 'xls',
            servicio: '00',
        }
        return this.conexionesProvider._traerdatosExplota(parametros, url, 'xls');
    }

    datosGraficoCitas = async (cantidadDias, FECHAACTUAL) => {
        const dataGraficoTotal = [];
        const milisegundosPorDia = 86400000;
        let contMilisegundos = 0;
        const dias = ["Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"];
        // HACERMOS UN FOR CON LAS X CANTIDADES DE DATOS
        for (let index = 0; index < cantidadDias; index++) {
            const fffff = new Date(FECHAACTUAL - contMilisegundos);
            const fechaDiaAnterior = this.herramientasProvider.formatFecha(new Date(fffff));
            // OBTENERMOS LOS DIAS DE LA SEMANA Y SOLO TOMAMOS LOS 3 PRIMERO CARACTERES
            const dia = dias[fffff.getDay()].substr(0, 3) + ' ' + fffff.getDate();
            // TODO: PROGRAMANDO CITAS DADAS
            const dataGraficoDadas = await this.citasPorServicios(fechaDiaAnterior, fechaDiaAnterior);
            // SUMAMOS LOS VALORES DE LAS CITAS
            const voluntarias = parseInt(this.herramientasProvider.sumaValorColumna(dataGraficoDadas, 'VOLUNTARIAS'));
            const recitas = parseInt(this.herramientasProvider.sumaValorColumna(dataGraficoDadas, 'RECITAS'));
            const interconsultas = parseInt(this.herramientasProvider.sumaValorColumna(dataGraficoDadas, 'INTERCONSULTAS'));
            const linea = parseInt(this.herramientasProvider.sumaValorColumna(dataGraficoDadas, 'ESSAENLINEA'));

            const total = voluntarias + recitas + interconsultas + linea;

            // TODO: PROGRAMANDO CITAS ATENDIDAS
            const dataGraficoAtendidas = await this.pacientesCitados(fechaDiaAnterior, fechaDiaAnterior);

            const temp = [];
            dataGraficoAtendidas.forEach(d => {
                if (d['ESTADO_CITA'] === 'ATENDIDA') {
                    temp.push(d);
                }
            });

            // AGREGAMOS EL ARRAY QUE UTILIZARA EL CHAR
            const data = {
                name: dia,
                'Se Dieron': total,
                'Se Atendieron': temp.length,
            };
            dataGraficoTotal.unshift(data);

            contMilisegundos += milisegundosPorDia;
        }
        console.log(dataGraficoTotal);
        return dataGraficoTotal;
    }

    edadesCitas = async (fecha) => {
        const fechaDia = this.herramientasProvider.formatFecha(fecha);
        // TODO: PROGRAMANDO CITAS ATENDIDAS
        const dataGraficoAtendidas = await this.pacientesCitados(fechaDia, fechaDia);

        const temp = [];
        dataGraficoAtendidas.forEach(d => {
            if (d['ESTADO_CITA'] === 'ATENDIDA') {
                temp.push(d);
            }
        });
        let edad5 = 0;
        let edad18 = 0;
        let edadmas = 0;
        temp.forEach(d => {
            if (parseInt(d['EDAD']) <= 5) {
                edad5 += 1;
            } else if (parseInt(d['EDAD']) <= 18) {
                edad18 += 1;
            } else if (parseInt(d['EDAD']) > 18) {
                edadmas += 1;
            }
        });
        const edades = [edad5, edad18, edadmas];
        return edades;
    }


    odonto = async (fecha, inicio) => {
        const url = '/explotacionDatos/servlet/CtrlControl?opt=cext13_v3';
        const parametros = {
            CAS: 822,
            ORIGEN: 2,
            actividad: 91,
            fechaFin: fecha,
            fechaInicio: inicio === true ? '16/10/2019' : '16/01/2020',
            formatoArchivo: 'xls',
            numeroDocumento: '',
            servicio: 'E11',
            subactividad: '074',
            tipo: 2,
            tipoDocumento: 1,
            tipoReporte: 4,
        }
        const data = await this.conexionesProvider._traerdatosExplota(parametros, url, 'otroxls');
        return data;
    }

}

export default GeneralProvider;