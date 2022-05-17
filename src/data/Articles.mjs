import StorageApi from '../controllers/StorageApi'
import WpApi from '../controllers/WpApi'
import { logWarn } from '../controllers/Logger'


const Articles = {


	get() {
		return new Promise( ( resolve, reject ) => {

			// first, check local storage
			let articles = StorageApi.articles

			// any saved?
			if( Array.isArray( articles ) && articles.length ) {
				return resolve( articles )
			}

			// otherwise, check server
			this
				.refresh()
				.then( articles => {
					return resolve( articles )
				}).catch( e => {
					return reject( e )
				})
		})
	},


	save( articles ) {

		// save articles to local storage
		if( Array.isArray( articles ) ) {
			StorageApi.articles = articles
		}
	},


	refresh() {
		return new Promise( ( resolve, reject ) => {
			WpApi
				.getArticles()
				.then( res => {
					let { articles } = res

					// save for later usage
					this.save( articles )

					return resolve( articles )

				}).catch( e => {
					logWarn( e )

					return reject( 'Failed to fetch articles from server' )
				})
		})
	}

}


export default Articles