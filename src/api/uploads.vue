<script>
	import uploadsMixin from '@/core/api/axios_uploads'
	import logOutMixin from '@/core/mixins/logout'
	export default {
		mixins: [uploadsMixin, logOutMixin],
		methods: {
			Upload: function(params, _files) {
				this.$store.commit('loading', true)
				return new Promise((resolve, reject) => {
					let formData = new FormData()
					let files = Array.from(_files)
					files.forEach((file, index) => {
						formData.append(`file_${index}`, file)
					})
					this.axiosUpload.post(`${params.module}`, formData)
						.then(response => {
							this.$store.commit('loading', false)
							resolve(response)
						}).catch(error => {
							this.$store.commit('loading', false)
							if(error.request.status === 401) {
								this.logOut()
							}
							reject({
								status: error.request.status,
								data: JSON.parse(error.request.response)
							})
						})
				})
			}
		}
	}
</script>
