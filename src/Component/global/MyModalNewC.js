import React,{Component} from 'react';
import {Modal,ModalManager,Effect} from 'react-dynamic-modal';
import './css/DatosCSS.css';
import  URL from './API/API';
import './css/bootstrap.css';
import './css/NewC.css';
import './css/ListarComprobanteNewC.css';
class MyModal extends Component{

    constructor(){
        super();
        this.handlerGuardar=this.handlerGuardar.bind(this);
        this.handleRevisar=this.handleRevisar.bind(this);
        // this.texto=React.createRef();
    }

    componentWillMount(){
        let data;
        const url = URL.url.concat('conceptos');
        const url1 = URL.url.concat('ubicaciones');
        const url2 = URL.url.concat('tipos');        
        fetch(url,{
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }          
        }).then(res => res.json())
        .then(res => {
            if (res.status) { // exito
                //  console.log(res);
                data=res;
                //console.log(data);
                // Llenar select de conceptos
                var x = document.getElementById("concepto");
                for (var i = 0; i < data["data"].length; i++) {
                    var miOption=document.createElement("option");
                    miOption.text = data["data"][i]["concepto"];
                    miOption.setAttribute("value",data["data"][i]["id_concepto"]);
                    x.add(miOption);
                }
            }else{
                alert("Fallo al cargar datos, Intentelo mas tarde");
            }
        });

        fetch(url1,{
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            }
            //body: JSON.stringify(data)
        }).then(res => res.json())
        .then(res => {
            if (res.status){ // exito
                //  console.log(res);
                data=res;
                //console.log(data);
                // Llenar select de conceptos
                var x = document.getElementById("ubicacion");
                for (var i = 0; i < data["data"].length; i++) {
                    var miOption=document.createElement("option");
                    miOption.text = data["data"][i]["descripcion"];
                    miOption.setAttribute("value",data["data"][i]["id_ubicacion"]);
                    x.add(miOption);
                }
            }
            else{
            alert("Fallo al cargar datos, Intentelo mas tarde");
            }
        });

        fetch(url2,{
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              }
            //body: JSON.stringify(data)
        }).then(res => res.json())
        .then(res => {
            if (res.status) { // exito
              //  console.log(res);
                data=res;
                //console.log(data);
                // Llenar select de conceptos
                var x = document.getElementById("tipo");
                for (var i = 0; i < data["data"].length; i++) {
                  var miOption=document.createElement("option");
                  miOption.text = data["data"][i]["descripcion"];
                  miOption.setAttribute("value",data["data"][i]["id_tipo"]);
                  x.add(miOption);
                }
            }else{
                alert("Fallo al cargar datos, Intentelo mas tarde")
            }
        });
    }

    handleRevisar(){
        //WEBADAS
        var data2 = {};
        data2.numero = document.getElementById("recibo").value;

        const url2 = URL.url.concat('verificar');

        fetch(url2,{
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data2)
        })
        .then(res => res.json())
        .then(res => {

            if(res.data[0].verificar === false){
                console.log('Entro al response remaster');
                alert('El numero de recibo ya ha sido ingresado con anterioridad');
                //ModalManager.close();
            }
        });

    }
    handlerGuardar(){

        var verif;
        if(document.getElementById("verificar").value === "true"){
          verif=true;
        }else{
           verif=false;
        }
        var data = {};
        data.id_alum=this.props.id;
        data.id_concepto =document.getElementById("concepto").value;
        data.id_ubicacion =document.getElementById("ubicacion").value;
        data.codigo =document.getElementById("codigo").value;
        data.numero =document.getElementById("recibo").value;
        data.importe =document.getElementById("importe").value;
        data.observacion =document.getElementById("obs").value;
        data.observacion_upg =document.getElementById("obsupg").value;
        data.fecha =document.getElementById("fecha").value;
        data.validado =verif;
        data.tipo =document.getElementById("tipo").value;
        //ModalManager.close();
        console.log("DATA:");
        console.log(data);
        console.log("DATA STRINGIFY:");
        console.log(JSON.stringify(data));

        const url = URL.url.concat('recaudaciones/new');
        //const url= 'https://api-modulocontrol.herokuapp.com/recaudaciones/new';
        fetch(url,{
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        }).then(res => res.json())
        .then(res => {
            if (res.status.localeCompare("succes")) { // exito
                alert('Datos creados exitosamente');
                ModalManager.close();
            }else if (res.status.localeCompare('error')) {//ERROR
                alert("FALLÓ OPERACIÓN " + res.message);
            }
            else{
                alert(res);
            }
        });
    }

    render(){
        let nombre = this.props.nombre;
        let codigo = this.props.codigo;
        return (
            <Modal style={estilonuevo} effect={Effect.SlideFromBottom}>
                <div className="container" id="advanced-search-form">
                    <form>
                        <div className="form-group">
                            <label >Nombres y Apellidos</label>
                            <input type="text" className="form-control" placeholder="Nombres" id="nombre" value={nombre} disabled required/>
                        </div>
                        <div className="form-group">
                            <label >Concepto de Pago</label>
                            <select required id ="concepto" className="form-control"/>
                        </div>
                        <div className="form-group">
                            <label >Código</label>
                            <input type="number" className="form-control" placeholder="Código" id="codigo" value={codigo} disabled required/>
                        </div>
                        <div className="form-group">
                            <label>Recibo</label>
                            <input onBlur = {this.handleRevisar} type="number" min="0" className="form-control" placeholder="Recibo" id="recibo" required/>
                        </div>
                        <div className="form-group">
                            <label>Importe</label>
                            <input type="number" min="0" className="form-control" placeholder="Importe" id="importe" required/>
                        </div>
                        <div className="form-group">
                            <label >Fecha</label>
                            <input type="date" id="fecha" className="form-control" required/>
                        </div>
                        <div className="form-group">
                            <label >Ubicación</label>
                            <select required id ="ubicacion" className="form-control" />
                        </div>
                        <div className="form-group">
                            <label >Tipo</label>
                            <select required id ="tipo" className="form-control" />
                        </div>
                        <div className="form-group">
                            <label >Verificar</label>
                            <select required id ="verificar" className="form-control" >
                                <option value="true" >Validado</option>
                                <option value="false" >No Validado</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label >Observaciones:</label>
                            <textarea rows="2" readOnly cols="30" id="obs"></textarea>
                        </div>
                        <div className="form-group">
                        </div>
                        <div className="form-group">
                            <label >Observaciones upg:</label>
                            <textarea rows="2" cols="30" id="obsupg"></textarea>
                        </div>
                        <button type = "button" className = "btn btn-primary" onClick = {this.handlerGuardar}>REGISTRAR</button>
                        <button type = "button" className = "btn btn-secondary" data-dismiss = "modal" onClick = {ModalManager.close}>Cerrar</button>
                    </form>
                </div>
                <script>
                    window.onload=llenarConceptos;
                </script>
            </Modal>
        );
    }
}

const estilonuevo = {
    overlay: {
        position        : 'fixed',
        top             : 0,
        left            : 0,
        right           : 0,
        bottom          : 0,
        zIndex          : 99999999,
        overflow        : 'hidden',
        perspective     :  1300,
        backgroundColor : 'rgba(0, 0, 0, 0.3)'
    },
    content: {
        position                : 'relative',
        margin                  : '5% auto',
        width                   : '60%',
        border                  : '1px solid rgba(0, 0, 0, .2)',
        background              : '#fff',
        overflow                : 'auto',
        borderRadius            : '4px',
        outline                 : 'none',
        boxShadow               : '0 5px 10px rgba(0, 0, 0, .3)',
    }
}
export default MyModal;
