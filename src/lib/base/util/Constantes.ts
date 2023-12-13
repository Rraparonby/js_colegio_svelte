
class Constantes {

	static IS_DEVELOPING=true;
	static LIMIT=10;
	
	static STR_PROTOCOL="http";
    static STR_IP_SERVIDOR="localhost";//"localhost";	"192.168.100.3";
	static STR_PUERTO_SERVIDOR="3000";//"3000";	"80";
	
	//NEST
	static STR_CONTEXTO_APLICACION="api/colegio_relaciones";
	
	//LARAVEL LOCAL
	//static STR_CONTEXTO_APLICACION='laravel_colegio_rels/api/colegio_relaciones';
    //static STR_CONTEXTO_APLICACION="metricas_auto";
	
	static INDEX="index";
	static TODOS="todos";
	static SELECCIONAR="seleccionar";
	static NUEVO="nuevo";
	static ACTUALIZAR="actualizar";
	static ELIMINAR="eliminar";
	static CANCELAR="cancelar";
	static ACTUALIZAR_NUEVO="actualizar_nuevo";
	
	static INFO="info";
	static SUCCESS="success";
	static WARNING="warning";
	static ERROR="error";
	
	static RJ_TODOS = "todos";
    static RJ_BUSCAR = "buscar";
	static RJ_GET_FKS = "get_fks";
	static RJ_SELECCIONAR = 'seleccionar';//'get_select';/*Request Json*/
	static RJ_NUEVO = 'nuevo';//'new';
	static RJ_ACTUALIZAR = 'actualizar';//'update';
	static RJ_ELIMINAR = 'eliminar';//'delete';
	static RJ_NUEVOS = 'news';
	static RJ_ELIMINARS = 'deletes';

	static MENSAJE_INGRESADO="Datos Ingresados Correctamente";
	static MENSAJE_ACTUALIZADO="Datos Actualizados Correctamente";
	static MENSAJE_ELIMINADO="Datos Eliminados Correctamente";

	static MENSAJE_ELIMINAR_SINO="Esta seguro de eliminar?";

	static UPDATE_DATOS_VIEW='updateDatosView';
}

export {Constantes};