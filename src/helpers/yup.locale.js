import { setLocale } from 'yup'

const errorMessages = {
	min: 'Este campo debe contener como mínimo ${min} caracteres',
	max: 'Este campo puede contener como máximo ${max} caracteres',
	required: 'Este campo es obligatorio, El campo ${label} no debe quedar vacío',
	email: 'Esto no parece ser una dirección de correo electrónico',
	url: 'Esto no parece ser un tipo de enlace válido',
	unique: 'Ya existe un elemento ${label} con el mismo valor. El valor en este campo debe ser único',
	exist: 'El valor seleccionado no existe, por favor verifica haber seleccionado el valor correcto',
	date: 'El campo ${label} no tiene un formato de fecha válido',
	oneOf: 'El valor de ${label} debe coincidir en ambos campos, por favor verifica',
	matches: 'El valor del campo ${label} no coincide con el formato requerido',
	length: 'La longitud del campo ${label} debe ser extrictamente de ${length} caracteres',
	integer: '${label} debe ser un número pero se proporciono un ${cast}',
	positive: '${label} debe ser un valor positivo mayor a cero'
}

setLocale({
	mixed: errorMessages,
	string: errorMessages,
	date: errorMessages,
	number: errorMessages,
	boolean: errorMessages
})

export const setFieldMessages = function(errors) {
	let fieldErrors = {}
	if(Object.keys(errors).length === 0) {
		return fieldErrors
	}
	for(const [field, error] of Object.entries(errors)) {
		if(Object.keys(error).length === 0) {
			continue
		}
		let rule = Object.keys(error)[0]
		if(rule in errorMessages) {
			fieldErrors[field] = errorMessages[rule]
		}
	}
	return fieldErrors
}
