<script>
	import httpService from '@/core/api/requests.vue'

	export default {
		mixins: [httpService],
		created: function () {
			this.getSiteConfig()
		},
		methods: {
			getSiteConfig: function () {
				let params = {
					module: 'config',
				}
				this.Get(params)
					.then(response => {
						let configData = response.data.data.results
						this.$store.commit('addSiteConfig', {
							timezone: configData[0].data,
							sitename: configData[1].data,
							session_expiration: configData[2].data,
							fb_page_profile: JSON.parse(configData[3].data),
							locales: JSON.parse(configData[4].data)
						})
					})
					.catch(error => {
						console.log(error)
					})
			}
		}
	}
</script>
