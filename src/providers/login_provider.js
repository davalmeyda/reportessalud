// IMPORTAMOS EL QUERY QUE COMVERTIRA EL CUERPO DEL POST PARA ENVIARLO POR AXIOS
import qs from 'querystring';
import axios from 'axios';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

class LoginProviders {

    static sesionExplota = async (pws, uname)=>{
        const cas = {
            PASS: pws,
            USER: uname,
            centroAsistencial: 822,
            opt: 0,
            upd: 'indexCas',
        }
    
        const resp = await axios.post('/explotacionDatos/servlet/Index',
            qs.stringify(cas),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                withCredentials: true,
    
            }).catch(function (error) {
                // CARGA EL ERROR
                console.log(error);
            });
        console.log(resp);
    }

    static sesionReportesSGSS = async ()=>{
           
        const resp = await axios.get('/sgssgxreport/servlet/hctrlmenu?2,822,47813783,V0000000000',            
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                withCredentials: true,
    
            }).catch(function (error) {
                // CARGA EL ERROR
                console.log(error);
            });
        console.log(resp);
    }

    static registrarUsuario = async (user) => {
        const usuario = await axios({
            method: 'post',
            url: 'https://us-central1-sistema-ventas-dde3f.cloudfunctions.net/crearUsuario',
            data: user
        });
        return usuario;
    }

    static ingresarUsuario = async (nameuser, password) => {

        const db = firebase.firestore().collection('usuarios');
        const usuario = await db.doc(nameuser).get();

        if (usuario.exists) {
            const email = usuario.data().email;
            let err = '';
            await firebase.auth().signInWithEmailAndPassword(email, password).catch(error => {
                err = error.code;
            });
            if (err === '') {
                return;
            } else {
                return err;
            }
        }
        return 'usuario';
    }
}

export default LoginProviders;