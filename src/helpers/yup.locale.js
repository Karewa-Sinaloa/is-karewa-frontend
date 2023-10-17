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
	length: 'La longitud del campo ${label} debe ser extrictamente de ${length} caracteres'
}

setLocale({
	mixed: errorMessages,
	string: errorMessages,
	date: errorMessages
})

export const setFieldMessages = function(errors) {
	let fieldErrors = {}
	errors.forEach(error => {
		if(error.rule in errorMessages) {
			fieldErrors[error.field] = errorMessages[error.rule]
		}
	})
	console.log(fieldErrors)
	return fieldErrors
}
