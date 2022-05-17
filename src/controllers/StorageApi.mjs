import WpApi from './WpApi'
import { logWarn } from './Logger'
// import { getLastModifiedTimestamp } from './Helpers.mjs'



const StorageApi = {

	keyAuth:		'loa_auth',
	keyTimestamp:	'loa_timestamp',
	keyArticles:	'loa_articles',
	keyTags:		'loa_tags',


	/**
	 * Get articles from local storage
	 * 
	 * @return	{array|null}
	 */
	get articles() {
		try {
			return this.getDataFromStorage( this.keyArticles )

		} catch( e ) {
			logWarn( e )

			return null
		}
	},


	/**
	 * Add articles to local storage
	 * 
	 * @return 	void
	 */
	set articles( articles ) {
		const data = this.prepDataForStorage( articles )

		localStorage.setItem( this.keyArticles, data )
	},


	/**
	 * Get tags from local storage
	 * 
	 * @return	{array|null}
	 */
	get tags() {
		try {
			return this.getDataFromStorage( this.keyTags )

		} catch( e ) {
			logWarn( e )

			return null
		}
	},


	/**
	 * Add tags to local storage
	 * 
	 * @return 	void
	 */	
	set tags( tags ) {
		const data = this.prepDataForStorage( tags )

		localStorage.setItem( this.keyTags, data )
	},	


	/**
	 * Get username and app password from local storage
	 * 
	 * @return	{obj|null}
	 */
	get auth() {
		try {
			return this.getDataFromStorage( this.keyAuth )

		} catch( e ) {
			logWarn( e )

			return null
		}
	},
	

	/**
	 * Add username and auth token/app password to local storage
	 * 
	 * @param 	{string} username
	 * @param 	{string} authToken
	 * 
	 * @throws 	{error}  If empty or wrong typed username or auth token
	 * 
	 * @return	{void}
	 */
	setAuthCreds( username, authToken ) {
		if( 'string' !== typeof username || !username.length ) {
			throw new Error( 'Cannot save username as username is empty.' )
		}

		if( 'string' !== typeof authToken || !authToken.length ) {
			throw new Error( 'Cannot save auth token as auth token is empty.' )
		}		

		const data = this.prepDataForStorage({ username, authToken })

		localStorage.setItem( this.keyAuth, data )
	},


	/**
	 * Wrapper for creating basic object for storing data with timestamp
	 * 
	 * @param	{mixed} data
	 * @return	{obj}
	 */
	prepDataForStorage( data ) {
		const storageItem = {
			time: Date.now(),
			data
		}

		return JSON.stringify( storageItem )
	},

	
	/**
	 * Wrapper for getting data from local storage
	 * 
	 * @param	{string} key
	 * @return	{mixed}
	 */
	getDataFromStorage( key ) {
		try {
			const { time, data } = JSON.parse( localStorage.getItem( key ) || '{}' )

			if( undefined === time && undefined === data ) {
				return null
			}

			if( 'number' !== typeof time ) {
				throw new Error( 'Invalid timestamp' )
			}
	
			if( !data ) {
				throw new Error( 'Invalid data' )
			}

			if( this.checkDataExpiration( time ) ) {
				throw new Error( 'Expired data' )
			}

			return data

		} catch( err ) {
			logWarn( `Storage for key: "${key}": ${err}` )

			// prevent further errors
			this.removeStorageByKey( key )

			return null
		}
	},


	/**
	 * Delete data for specific storage key
	 * 
	 * @param	{string} key
	 * @return	void
	 */
	removeStorageByKey( key ) {
		localStorage.removeItem( key )
	},


	/**
	 * All data older than a week should be considered "expired"
	 * 
	 * @param	{number} timestamp
	 * @return	{bool}
	 */
	checkDataExpiration( timestamp ) {
		return timestamp < Date.now() - 604800000 // milliseconds for seven days
	},

}



export default StorageApi