<script lang="ts">

import {Constantes} from '@/lib/base/util/Constantes'

import '@/scss/components/alert/alert_general.scss'

/*
 //MENSAJE ALERT GENERAL
tipo_mensaje:String,
mensaje:String
*/
//function AlertComp(props) {
//const AlertComp = forwardRef((props, ref) => {

export let tipo_mensaje: string = ""
export let mensaje: string = ""



//GENERAL
//const [title, setTitle] = useState("ALERT")
//MENSAJE ALERT MOSTRAR OCULTAR
let display = "none" //"none"
let opacity = "1" //"none"
//MENSAJE ALERT TIPO
let isAlertGeneral= true
let isAlertInfo = false
let isAlertSucess = false
let isAlertWarning = false
let isAlertError = false

export const closeAlertGeneral = () => {
    opacity="0"
        
    setTimeout(() => {
        display="none"
    }, 600)
}

export const setMensajeAlerta = () => {
    //Son Parametros
    //this.tipo_mensaje=tipo_mensaje            
    //this.mensaje = mensaje

    //tipo_mensaje,mensaje
    //console.log("setMensajeAlerta,",this.tipo_mensaje,this.mensaje)
    
    //MENSAJE ALERT MOSTRAR OCULTAR
    display="block"
    opacity="1"
    //MENSAJE ALERT TIPO
    isAlertGeneral=true
    isAlertInfo=false
    isAlertSucess=false
    isAlertWarning=false
    isAlertError=false

    if (tipo_mensaje === Constantes.INFO) {
        isAlertInfo=true
    
    } else if (tipo_mensaje ===Constantes.SUCCESS) {
        isAlertSucess=true

    } else if (tipo_mensaje === Constantes.WARNING) {
        isAlertWarning=true

    } else if (tipo_mensaje === Constantes.ERROR) {
        isAlertError=true        
    } 
}       

/*
const getClassAlerta = () => {
    let class1="none"

    if(isAlertGeneral===true) {
        class1="alert_general"

    } else if(isAlertInfo===true) {
        class1="alert_info"

    } else if(isAlertSucess===true) {
        class1="alert_success"

    } else if(isAlertWarning===true) {
        class1="alert_warning"

    } else if(isAlertError===true) {
        class1="alert_error"
    }

    return class1
}
*/

//{getClassAlerta()}

</script>


<div id="div_alert_general" 
    style= "display: {display}; opacity: {opacity};"

    class={isAlertGeneral? 'alert_general' : '' + 
           isAlertInfo? ' alert_info' : '' +
           isAlertSucess? ' alert_success' : '' +
           isAlertWarning? ' alert_warning' : '' +
           isAlertError? ' alert_error' : ''
          }>
        
    <span id="span_close_alert_general" 
        class="close_alert_general" 
        on:click = {closeAlertGeneral}>

        &times;
    </span>

    <p id="p_mensaje_alert_general">
        {mensaje}
    </p>

</div>