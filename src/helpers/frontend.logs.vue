<script>
import httpService from '@/core/api/requests'

export default {
	mixins: [httpService],
	methods: {
		logging: function(error, level = 40) {
			let params = {
				module: 'logging/update',
				data: {
					level: level,
					error: error
				}
			}
			this.Put(params)
		}
	}
}
</script>
