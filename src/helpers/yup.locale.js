import { setLocale } from 'yup'

const errorMessages = {
	min: 'Este campo debe contener como mínimo ${min} caracteres',
	max: 'Este campo puede contener como máximo ${max} caracteres',
	required: 'Este campo es obligatorio, El campo ${label} no debe quedar vacío',
	email: 'Esto no parece ser una dirección de correo electrónico',
	url: 'Esto no parece ser un tipo de enlace válido',
	unique: 'Ya existe un elemento ${lable} con el mismo valor. El valor en este campo debe ser único',
	exist: 'El valor seleccionado no existe, por favor verifica haber seleccionado el valor correcto',
	date: 'El campo ${label} no tiene un formato de fecha válido'
}

setLocale({
	mixed: errorMessages,
	string: errorMessages,
	date: errorMessages
})

export const setFieldMessages = function(data) {
	let fieldErrors = {}
	for(let field in data) {
		for(let error in data[field]) {
			if(error in errorMessages) {
				fieldErrors[field] = errorMessages[error]
			}
		}
	}
	return fieldErrors
}
