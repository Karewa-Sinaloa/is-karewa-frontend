// Navegación por defecto del header público.
// Las vistas públicas aún están en blanco: esta lista es el contrato de datos
// que consume public_header.vue y puede sobreescrierse desde cualquier vista.
export const publicNavLinks = [
	{ label: 'Inicio', to: { name: 'publicHomeView' } },
	{ label: 'Contratos', to: { name: 'publicContractsView' } },
	{ label: 'Proveedores', to: { name: 'publicProvidersView' } },
	{ label: 'Quiénes somos', to: { name: 'publicAboutView' } },
	{ label: 'Unidades administrativas', to: { name: 'publicAdminUnitsView' } },
	{ label: 'Contacto', to: { name: 'publicContactView' } },
];
