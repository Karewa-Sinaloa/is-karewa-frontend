<script>
	import { config } from '@/core/config/init'
	import axios from 'axios'
	import VueAxios from 'vue-axios'

	export default {
		data: function() {
			return {
				axiosUpload: null
			}
		},
		created: function() {
			this.axiosUploadInstance()
		},
		methods: {
			axiosUploadInstance: function () {
				let storedBearer = localStorage.getItem(`${config.lsSuffix}bearer`)
				let bearer = storedBearer === undefined ? null : storedBearer
				let axiosUploadsSettings = {
					baseURL: config.api_url,
					headers: {
						'Content-Type': 'application/json',
						'Accept': 'multipart/form-data',
						'Authorization': bearer,
						'Connection': 'close'
					}
				}
				this.axiosUpload = axios.create(axiosUploadsSettings)
			}
		}
	}
</script>
