<script>
	export default {
		methods: {
			logOut: function() {
				localStorage.removeItem(`${import.meta.env.VITE_LOCALSTORAGE_SUFFIX}bearer`)
				this.$store.commit('setUserData', null)
				if(this.$route.name !== 'accessView') {
					this.$router.push({name: 'accessView'})
				}
			}
		}
	}
</script>
