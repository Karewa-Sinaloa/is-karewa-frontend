const alertData = {
	NOTFOUND: {
		type: 'error',
		title: 'SIN RESULTADOS',
		text: 'Su consulta no ha generado resultados, puede que no exista información relacionada o los parámetros indicados son incorrectos.'
	},
	'SERVER-ERROR': {
		type: 'error',
		title: 'ERROR DE SERVIDOR',
		text: 'Ha ocurrido un error interno del servidor, por favor intente de nuevo, si el problema persiste, comunicate con el administrador'
	},
	ACCESS001: {
		type: 'error',
		title: 'ACCESSO NO AUTORIZADO',
		text: 'Los datos de acceso proporcionados no son correctos, por favor, verifique la información'
	},
	ACCESS002: {
		type: 'error',
		title: 'ACCESO NO AUTORIZADO',
		text: 'No tienes los permisos suficientes para acceder a este contenido.'
	},
	ACCESS003: {
		type: 'error',
		title: 'SESIÓN EXPIRADA',
		text: 'Tu sesión ha expirado, debes volver a iniciarla con tus datos de acceso.'
	},
	ACCESS004: {
		type: 'error',
		'title': 'ACCESO NO AUTORIZADO',
		'text': 'Los datos proporcionados no son correctos, por favor, verifica la información'
	},
	ACCESS005: {
		type: 'error',
		title: 'TOKEN EXPIRADO',
		text: 'El token para realizar el cambio de contraseña o validacion de usuario ha expirado.'
	},
	ACCESS006: {
		type: 'error',
		title: 'SESIÓN TERMINADA',
		text: 'Solo puede haber una sesión iniciada por usuario, por lo que la sesión creada anteriormente fue cerrrada.'
	},
	ACCESS007: {
		type: 'eror',
		title: 'SESIÓN INVÁLIDA',
		text: 'El token de acceso utilizado ya ha sido deshabilitado, esto puede deberse a varias razones, por favor, vuelve a iniciar sesión'
	},
	MAILER001: {
		type: 'error',
		title: 'MENSAJE NO ENVIADO',
		text: 'No hemos podido enviar por correo electrónico la información solicitada, por favor, vuelve a intentarlo'
	},
	VALIDATION001: {
		type: 'error',
		title: 'ERROR DE VERIFICACIÓN',
		text: 'Uno o varios campos del formulario podrían ser incorrecto o estar vacíos, por favor, revise la información proporcionada.'
	},
	SUCCESS: {
		type: 'success',
		title: 'PETICIÓN PROCESADA',
		text: 'Tu petición ha sido procesada correctamente.'
	},
	NOCHANGE: {
		type: 'warning',
		title: 'SIN CAMBIOS',
		text: 'Tu petición se procesó sin problemas pero no se relizó ningún cambio.'
	},
	UPDATED: {
		type: 'success',
		title: 'INFORMACIÓN ACTUALIZADA',
		text: 'Los cambios solicitados en tu petición han sido procesados correctamente y la información fue actualizada'
	},
	CREATED: {
		type: 'success',
		title: 'NUEVO ELEMENTO CREADO',
		text: 'Se ha agregado correctamente los datos enviados en tu petición'
	},
	DELETED: {
		type: 'success',
		title: 'ELEMENTO BORRADO',
		text: 'Se ha borrado correctamente el elemento solicitado, recuerda que este cambio no se puede revertir'
	},
	'API-ERROR': {
		type: 'error',
		title: 'HA OCURRIDO UN ERROR',
		text: 'No se pudo completar su petición, por favor, vuelve a intentar, si el problema persiste contáctanos'
	},
	'APP-ERROR-001': {
		type: 'error',
		title: 'NO SE PUEDE BORRAR',
		text: 'No es posible borrar el elemento solicitado ya que esta ligado uno no más elementos'
	},
	'TAX-PAYER-001': {
		type: 'error',
		title: 'RFC INCONSISTENTE',
		text: 'El RFC proporcionado no coincide con el certificado proveido, por favor, verifica los datos y archivos enviados'
	},
	'TAX-PAYER-002': {
		type: 'error',
		title: 'CERTIFICADO EXPIRADO',
		text: 'El archivo de certificado proporcionado ha expirado, por favor, sube un certificado vigente'
	},
	'TAX-PAYER-003': {
		type: 'error',
		title: 'LLAVE PRIVADA NO GUARDADA',
		text: 'No se ha podido guardar el archivo de llave privada (.key) proporcionado, por favor, vuelve a intentar subirlo.'
	},
	'TAX-PAYER-004': {
		type: 'error',
		title: 'Ha ocurrido un error al leer el archivo de certificado (.cer), por favor, vuelve a intentar, si el problema persiste, comunicate con nosotros'
	},
	'TAX-PAYER-005': {
		type: 'error',
		title: 'RÉGIMEN FISCAL INCORRECTO',
		text: 'El régimen fiscal seleccionado no es compatible con el tipo de contribuyente'
	},
	'TAX-PAYER-006': {
		type: 'error',
		title: 'ARCHIVO NO GUARDADO',
		text: 'No hemos podido guardar el archivo de certificado (.cer) enviado, por favor, vuelve a subirlo, si el problema persiste, contáctanos'
	},
	'TAX-PAYER-007': {
		type: 'error',
		title: 'CONTRASEÑA INCORRECTA',
		text: 'La contraseña de tu CSD no es correcta, por favor verificala.'
	},
	'HCAPTCHA-001': {
		type: 'warning',
		title: 'Error completando la captcha',
		text: 'Ha ocurrido un error al procesar la validación por Captcha'
	},
	'HCAPTCHA-002': {
		type: 'warning',
		title: 'Error completando la captcha',
		text: 'Ha ocurrido un error al procesar la validacion por Captcha'
	},
	'MEDIA-TYPE-UNSUPPORTED': {
		type: 'error',
		title: 'Formato de archivo no valido',
		text: 'El formato del archivo proporcionado no es válido, por favor, sigue las instrucciones y vuelve a intentar'
	}
}

export function serverMessages(code = 'SERVER-ERROR') {
	let error = alertData[code]
	return {
		type: error.type,
		title: error.title,
		text: error.text,
		time: Date.now()
	}
}
