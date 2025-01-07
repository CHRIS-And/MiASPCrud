 $(function () {

	loadData();

});

var state = {
	auxId:0,
	editar:false
};

var error = "Ocurrió un error insesperado en el sitio, por favor intentelo mas tarde o pongase en contacto con su administrador.";
var success = "La accion se ralizó con exito";
var datosIncorrectos = "Datos incorrectos, vuelve a intentarlo.";

function loadData(){

	var filtro = $('#select_status').val();

	$.ajax({
		url: SITE_URL +'/Home/TablaPersonas',
		type:'POST',
		data: { Filtro: filtro},
		dataType:'JSON',
		beforeSend: function () {

			LoadingOn("Espere...");
			$("#tbody").empty();
		},
		error: function(error){
			//console.log(error);
			MsgAlerta("Error!", error, 3000, "error");
			LoadingOff();
		},
		success: function(data){
			//console.log(data);
			LoadingOff();

			if(data != ""){

				var TablaPersonas = "";

				for (var i = 0; i < data.length; i++) {
					//Console.log(data[i]);
					TablaPersonas += '<tr>';
					TablaPersonas += '<td>' + data[i].Id + '</td>';
					TablaPersonas += '<td>' + data[i].Nombre + '</td>';
					TablaPersonas += '<td>' + data[i].Direccion + '</td>';
					TablaPersonas += '<td>' + data[i].Telefono + '</td>';
					TablaPersonas += '<td>' + data[i].Estatus + '</td>';
					TablaPersonas += '<td>';
					if (data[i].Estatus == 1) {
						TablaPersonas += `
			   			<button class="btn btn-danger" onclick="eliminar(`+ data[i].Id + `)" title="Eliminar" type="">
							<i class="fa fa-trash" aria-hidden="true"></i>
			   			</button>
			   			<button class="btn btn-primary" onclick="detalles(`+ data[i].Id + `,false)"  title="Ver Detalles" type="">Ver detalles
               	    	</button>
						   <button class="btn btn-primary" onclick="detalles(`+ data[i].Id + `,true)"  title="Ver" type=""><i class="fa fa-eye" aria-hidden="true" ></i>
               	    	</button></tr>`;
					}
					if (data[i].Estatus == 0) {
						TablaPersonas += `
						<button class="btn btn-success" onclick="reactivar(`+ data[i].Id + `)" title="Reactivar">
						<i class="fa fa-check" aria-hidden="true"></i>
						</button></tr>`;
					}
				}

				$('#tbody').html(TablaPersonas);
			}
			else{
				MsgAlerta("Atencion!", "No hay personas para mostrar", 5000, "warning");
			}
		}
	});

}
//Funcion para limpiar el modal
function LimpiarPersonasForm() {
	document.getElementById('lblAddPersonas').innerHTML = "";
	$(".vfper").val("");
	
	$("#btnGuardarPersonas").show();
	state.auxId = 0;
	state.editar = false;
	$(".is-invalid").removeClass('is-invalid');
}
//Abrir Modal para agregar personas
$(document).on('click', '#btn_new', function(e){
	e.preventDefault();
	$("#inputNombre").prop("disabled", false);
	$("#inputApellidoP").prop("disabled", false);
	$("#inputApellidoM").prop("disabled", false);
	$("#inputDireccion").prop("disabled", false);
	$("#inputTelefono").prop("disabled", false);
	LimpiarPersonasForm();
	document.getElementById('lblAddPersonas').innerHTML = "Nuevo Registro";
	$('#ModalAgregarPersonas').modal('show');
});

//Cerrar modal
$(document).on('click', '#btncerrarPersonas', function (e) {
	e.preventDefault();
	$('#ModalAgregarPersonas').modal('hide');
});

//Agregar personas
function guardarPersonas() {
	//validarFormulario('.vfper', function (json) {

		//if (json.bool) {

			let info = {};

			info.Nombre = $("#inputNombre").val();
			info.ApellidoP = $("#inputApellidoP").val();
			info.ApellidoM = $("#inputApellidoM").val();
			info.Direccion = $("#inputDireccion").val();
			info.Telefono = $("#inputTelefono").val();

			if (state.editar == true) {
				info.Id = state.auxId;
				sendPersonaEdit(info);
				console.log("editado");
			}
			else {
				sendPersona(info);
				console.log("guardando");
			}
		/*} else {
			MsgAlerta("Atención!", "Llenar campos faltantes", 3000, "warning");
		}
	});*/
}

function sendPersona(info) {
	console.log("guardando3");
	$.ajax({
		type: "POST",
		contentType: "application/x-www-form-urlencoded",
		url: SITE_URL + "/Home/CrearClientes",
		data: info,
		dataType: "JSON",
		beforeSend: function () {
			LoadingOn("Espere...");
		},

		success: function (data) {
			if (data) {
				LoadingOff();
				LimpiarPersonasForm();
				MsgAlerta("Realizado!", "Registro guardado", 3000, "success");
				$("#ModalAgregarPersonas").modal("hide");
				loadData();
			} else {
				//ErrorLog("Error", "Error controlado");
				MsgAlerta("Verifica la informacion !!", "Registro No guardado", 3000, "warning");
				LoadingOff();
			}
		},
		error: function (error) {
			ErrorLog(error.responseText, "Error de comunicación, verifica la conexión");
			LoadingOff();
		}
	});
}
function sendPersonaEdit(info) {
	$.ajax({
		type: "POST",
		contentType: "application/x-www-form-urlencoded",
		url: SITE_URL + "/Home/EditarPersona",
		data: info,
		dataType: "JSON",
		beforeSend: function () {
			LoadingOn("Espere...");
		},
		success: function (data) {
			if (data) {
				LoadingOff();
				LimpiarPersonasForm();
				MsgAlerta("Realizado!", "Registro guardado", 3000, "success");
				$("#ModalAgregarPersonas").modal("hide");
				loadData();
			} else {
				//ErrorLog("Error", "Error controlado");
				LoadingOff();
				MsgAlerta("Verifica la informacion !!", "Registro No guardado", 3000, "warning");
				$("#ModalAgregarPersonas").modal("hide");
			}
		},
		error: function (error) {
			ErrorLog(error.responseText, "Error de comunicación, verifica la conexión");
			LoadingOff();
		}
	});
}

function detalles(id, bool){
	$.ajax({
		url: SITE_URL + '/Home/EditarPersona',
		type: 'POST',
		data: { Id: id },
		dataType: 'JSON',
		beforeSend: function () {

			LoadingOn("Espere...");
		
		},
		error: function (error) {
			//console.log(error);
			MsgAlerta("Error!", error, 3000, "error");
			LoadingOff();
		},
		success: function (data) {
			//Conversion del texto plano a JSON
			var data2 = JSON.parse(data);
			var data3 = JSON.parse(data2.json);

			//codigo para detectar mayusculas en Nombre y mostrar en el modal
			let resultado = []
			let palabra = []
			var cadena = data3[0].Nombre;
			for (let i = cadena.length - 1; i >= 0; i--) {
				const letra = cadena[i];
				if (letra === letra.toUpperCase() && isNaN(letra) && letra !== "") {
					if (palabra.trim()) {
						resultado.unshift(letra + palabra.trim());
						palabra = "";
					} else
						palabra = letra;
				}
				else {
					palabra = letra + palabra;
				}

			}

			//condicion en caso de tener 2 nombre, concatenacion de los Nombres
			if (resultado.length == 4) {
				var Nombre = resultado[0] + " " + resultado[1] + " ";
				var ApellidoP = resultado[2] + " ";
				var ApellidoM = resultado[3];
			}
			else{
				var Nombre = resultado[0] + " ";
				var ApellidoP = resultado[1] + " ";
				var ApellidoM = resultado[2];
		}
			LoadingOff();
			$("#ModalAgregarPersonas").modal("hide");
			if (data != "") {
				$("#inputNombre").val(Nombre).prop("disabled",bool);
				$("#inputApellidoP").val(ApellidoP).prop("disabled", bool);
				$("#inputApellidoM").val(ApellidoM).prop("disabled", bool);
				$("#inputDireccion").val(data3[0].Direccion).prop("disabled", bool);
				$("#inputTelefono").val(data3[0].Telefono).prop("disabled", bool);
				state.editar = true;
				state.auxId = id;

				if (bool == true) {
					$("#ModalAgregarPersonas").modal('show');
					$("#btnGuardarPersonas").hide();
				} else {
					$("#ModalAgregarPersonas").modal('show');
					$("#btnGuardarPersonas").show();
				}
			} else {
				MsgAlerta("Atencion!", "No hay personas para mostrar", 5000, "warning");
			}
		}
	});
}

function eliminar(id){
	$.ajax({
		url: SITE_URL + '/Home/EliminarPersona',
		type: 'POST',
		data: { Id: id },
		dataType: 'JSON',
		beforeSend: function () {

			LoadingOn("Espere...");

		},
		success: function (data) {
			if (data) {
				LoadingOff();
				MsgAlerta("Realizado!", "Registro Eliminado", 3000, "success");
				loadData();
			} else {
				ErrorLog("Error", "Error controlado");
				LoadingOff();
			}
		},
		error: function (error) {
			//console.log(error);
			MsgAlerta("Error!", error, 3000, "error");
			LoadingOff();
		},
		
	});
}

function reactivar(id) {
	$.ajax({
		url: SITE_URL + '/Home/EliminarPersona',
		type: 'POST',
		data: { Id: id },
		dataType: 'JSON',
		beforeSend: function () {

			LoadingOn("Espere...");

		},
		success: function (data) {
			if (data) {
				LoadingOff();
				MsgAlerta("Realizado!", "Registro Reactivado", 3000, "success");
				loadData();
			} else {
				ErrorLog("Error", "Error controlado");
				LoadingOff();
			}
		},
		error: function (error) {
			//console.log(error);
			MsgAlerta("Error!", error, 3000, "error");
			LoadingOff();
		},

	});
}


function validarFormulario(identif, callback) {
	 
}
$(document).on('change', '#select_status', function(e){
	loadData();
});


$(document).on('keyup', '#txt_busqueda', function (e) {

	$.ajax({
		url: SITE_URL + '/Home/TablaPersonasbusqueda',
		type:'POST',
		async: false,
		data: { Busqueda: $(this).val()},
		dataType:'JSON',
		beforeSend: function () {

			LoadingOn("Espere...");
			$("#tbody").empty();

		},
		error: function(error){
			//console.log(error);
			MsgAlerta("Error!", error, 5000, "error");
			LoadingOff();
		},
		success: function(data){
			console.log(data);
			LoadingOff();

			if (data != "") {

				var TablaPersonas = "";

				for (var i = 0; i < data.length; i++) {
					//Console.log(data[i]);
					TablaPersonas += '<tr>';
					TablaPersonas += '<td>' + data[i].Id + '</td>';
					TablaPersonas += '<td>' + data[i].Nombre + '</td>';
					TablaPersonas += '<td>' + data[i].Direccion + '</td>';
					TablaPersonas += '<td>' + data[i].Telefono + '</td>';
					TablaPersonas += '<td>' + data[i].Estatus + '</td>';
					TablaPersonas += '<td>';
					if (data[i].Estatus == 1) {
						TablaPersonas += `
			   			<button class="btn btn-danger" onclick="eliminar(`+ data[i].Id + `)" title="Eliminar" type="">
							<i class="fa fa-trash" aria-hidden="true"></i>
			   			</button>
			   			<button class="btn btn-primary" onclick="detalles(`+ data[i].Id + `,false)"  title="Ver Detalles" type="">Ver detalles
               	    	</button>
						   <button class="btn btn-primary" onclick="detalles(`+ data[i].Id + `,true)"  title="Ver" type=""><i class="fa fa-eye" aria-hidden="true" ></i>
               	    	</button></tr>`;
					}
					if (data[i].Estatus == 0) {
						TablaPersonas += `
						<button class="btn btn-success" onclick="reactivar(`+ data[i].Id + `)" title="Reactivar">
						<i class="fa fa-check" aria-hidden="true"></i>
						</button></tr>`;
					}

				}

				$('#tbody').html(TablaPersonas);
			}
			else {
				MsgAlerta("Atencion!", "No hay personas para mostrar", 5000, "warning");
			}
		}
	});
});

// validaOnlyNumbers('txt_busqueda');