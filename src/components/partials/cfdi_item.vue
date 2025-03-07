<template>
<div class="invoice__product" v-if="item">
	<div class="form__container-group">	
		<div class="form__container form__container--smaller">
			<label class="form__label form__label--required" for="name">Producto</label>
			<input-autocomplete :requestParams="productRequestParams" :textField="'name'" placeholderText="Producto" @option="v => setProduct(v)" :optionText="['code', 'name']" />
		</div>
		<div class="form__container form__container--micro">
			<label class="form__label form__label--required" for="qty">Unidades</label>
			<input class="form__input" type="text" name="qty" id="qty" placeholder="Cantidad" v-model="item.qty" @change="updateProductQty()">
		</div>
		<div class="form__container form__container--tinier">
			<label class="form__label" for="price">Valor unitario</label>
			<input class="form__input" type="text" name="price" id="price" placeholder="Valor unitario" v-model="item.price" readonly>
		</div>
		<div class="form__container form__container--micro">
			<label class="form__label" for="taxes">Impuestos</label>
			<input class="form__input" type="text" name="taxes" id="taxes" placeholder="Impuestos" v-model="item.taxes" readonly>
		</div>
		<div class="form__container form__container--micro">
			<label class="form__label" for="percentaje_discount">% descuento</label>
			<input class="form__input" type="text" name="percentaje_discount" id="percentaje_discount" placeholder="% Descuento" v-model="item.percentaje_discount" @change="setCustomDiscount()">
		</div>
		<div class="form__container form__container--micro">
			<label class="form__label" for="total_discount">Descuentos</label>
			<input class="form__input" type="text" name="total_discount" id="total_discount" placeholder="Descuentos" v-model="item.total_discount" readonly>
		</div>
		<div class="form__container form__container--tinier">
			<label class="form__label" for="subtotal">Subtotal</label>
			<input class="form__input" type="text" name="subtotal" id="subtotal" placeholder="subtotal" v-model="item.subtotal" readonly>
		</div>
	</div>
	<div class="invoice__options">
		<button class="btn btn__icon btn__icon--regular">
			<icon-set icon="edit"/>
		</button>

		<button class="btn btn__icon btn__icon--regular" @click.prevent="emits('deleteItem')">
			<icon-set icon="delete"/>
		</button>
	</div>
</div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import inputAutocomplete from './input-autocomplete.vue'

const props = defineProps({
	product: {
		type: Object,
		default() {
			return {
				name: null,
				qty: 1.00,
				description: null,
				price: 0.00,
				discount_price: 0.00,
				taxes: 0.00,
				percentaje_discount: 0.00,
				subtotal: 0.00,
				total_discount: 0.00
			}
		}
	}
})
const emits = defineEmits(['invoiceItem', 'deleteItem'])

const productRequestParams = ref({
	module: 'products/products'
})

const item = ref({})
const invoiceItem = ref({})

onMounted(() => {
	item.value = props.product
})

function updateProduct(p) {
	invoiceItem.value = {
		concepto: {
			Name: p.name,
			Cantidad: p.qty,
			Descripcion: p.description,
			Importe: p.unit_price,
			Subtotal: p.subtotal,
			Descuento: p.total_discount,
			ClaveUnidad: p.clave_unidad,
			CaveProdServ: p.code,
			Unidad: null,
			ValorUnitario: p.price,
			ObjetoImp: null,
		},
		Impuestos: {
			Traslados: {
				iva: {
					Base: p.subtotal,
					Importe: p.taxes.transferred.iva.total,
					Impuesto: p.taxes.transferred.iva.id,
					TasaOCuota: p.taxes.transferred.iva.amount,
					TipoOFactor: p.taxes.transferred.iva.factor
				},
				ieps: {
					Base: p.subtotal,
					Importe: p.taxes.transferred.ieps.total,
					Impuesto: p.taxes.transferred.ieps.id,
					TasaOCuota: p.taxes.transferred.ieps.amount,
					TipoOFactor: p.taxes.transferred.ieps.factor
				}
			}
		}	
	}
	emits('invoiceItem', invoiceItem)
}

function updateProductQty() {
	setProductTotal(item.value).then(response => {
		productDataSet(response)
	})
}

function productDataSet(response) {
	item.value.qty = response.qty
	item.value.amount = response.unit_price
	item.value.subtotal = response.subtotal
	item.value.total_discount = response.total_discount
	item.value.percentaje_discount = response.percentaje_discount
	item.value.taxes = response.total_taxes
	updateProduct(response)
}

function setProduct(p) {
	item.value = p
	setProductTotal(p).then(response => {
		productDataSet(response)
	})	
}

function setCustomDiscount() {
	setProductTotal(item.value).then(response => {
		productDataSet(response)
	})
}

function setProductTotal(p) {
	return new Promise((resolve, reject) => {
		let discount = 0.00
		let iva_trasladado = 0.00
		let ieps_trasladado = 0.00
		let iva_retenido = 0.00
		let qty = !p.qty ? 1.00 : parseFloat(p.qty)
		let percentaje_discount = 0.00

		if(p.discount_price > 0) {
			discount = (p.price - p.discount_price) * qty
			percentaje_discount = (100 / (p.price / (p.price - p.discount_price))) / 100
		}
		
		let unit_price = discount > 0 ? parseFloat(p.discount_price) : parseFloat(p.price)	

		if(p.percentaje_discount > 0) {
			percentaje_discount = parseFloat(p.percentaje_discount) / 100
			unit_price = parseFloat(p.price) * ((1 - percentaje_discount) / 1)
			discount = ((p.price * percentaje_discount) * qty)
		} else if(p.percentaje_discount == 0) {
			discount = 0.00
			unit_price = parseFloat(p.price)
			percentaje_discount = 0.00
		}
	
		let subtotal = unit_price * qty
		if(p.iva_trasladado > 0) {
			iva_trasladado = parseFloat(p.iva_trasladado_amount) * subtotal
		}
		if(p.ieps_trasladado > 0) {
			ieps_trasladado = parseFloat(p.ieps_trasladado_amount) * subtotal
		}
		//if(p.iva_retenido > 0) {
		//	iva_retenido = parseFloat(p.iva_retenido_amount) * subtotal
		//}
		let taxes = iva_trasladado + ieps_trasladado - iva_retenido

		let product = {
			unit_price: parseFloat(unit_price).toFixed(p.currency_decimals),
			total_discount: discount.toFixed(p.currency_decimals),
			subtotal: subtotal.toFixed(p.currency_decimals),
			total_taxes: taxes.toFixed(p.currency_decimals),
			discount_price: parseFloat(p.discount_price).toFixed(p.currency_decimals),
			percentaje_discount: (percentaje_discount * 100).toFixed(p.currency_decimals),
			price: parseFloat(p.price).toFixed(p.currency_decimals),
			qty: qty.toFixed(6),
			name: p.name,
			code: p.code,
			category_id: p.category_id,
			description: p.description,
			clave_unidad: p.unit_code,
			taxes: {
				retained: {

				},
				transferred: {
					iva: {
						amount: p.iva_trasladado_amount,
						factor: p.iva_trasladado_factor,
						type: p.iva_trasladado_type,
						id: p.iva_trasladado,
						total: iva_trasladado
					},
					ieps: {
						amount: p.ieps_trasladado_amount,
						factor: p.ieps_trasladado_factor,
						type: p.ieps_trasladado_type,
						id: p.ieps_trasladado,
						total: ieps_trasladado
					}
				}
			}
		}
		resolve(product)
	})	
}
</script>
