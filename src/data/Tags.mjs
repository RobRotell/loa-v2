import StorageApi from '../controllers/StorageApi'
import WpApi from '../controllers/WpApi'
import { logWarn } from '../controllers/Logger'


const Tags = {


	get() {
		return new Promise( ( resolve, reject ) => {

			// first, check local storage
			let tags = StorageApi.tags

			// any saved?
			if( Array.isArray( tags ) && tags.length ) {
				return resolve( tags )
			}

			// otherwise, check server
			this
				.refresh()
				.then( tags => {
					return resolve( tags )
				}).catch( e => {
					return reject( e )
				})
		})
	},


	save( tags ) {

		// save tags to local storage
		if( Array.isArray( tags ) ) {
			StorageApi.tags = tags
		}
	},


	refresh() {
		return new Promise( ( resolve, reject ) => {
			WpApi
				.getTags()
				.then( res => {
					let { tags } = res

					// save for later usage
					this.save( tags )

					return resolve( tags )

				}).catch( e => {
					logWarn( e )

					return reject( 'Failed to fetch tags from server' )
				})
		})
	}

}


export default Tags