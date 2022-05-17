import { logTime } from './Logger.mjs'



const WpApi = {


	endpointUrl: 'https://vril.robr.app/wp-json/loa/v3',


	async fetch( action, rawParams, method = 'GET', username = '', authToken = '' ) {
		const timeStart = performance.now()

		const options = {}
		const headers = new Headers

		let url 	= `${this.endpointUrl}/${action}`
		let params 	= ''

		if( rawParams instanceof URLSearchParams ) {
			params = rawParams.toString()
		}

		switch( method.toLowerCase() ) {
			case 'get': {
				url += `?${params}`
				break
			}
				
			case 'post': {
				options.body 	= params
				options.method 	= 'POST'

				headers.set( 'Content-Type', 'application/x-www-form-urlencoded' )

				if( username.length && authToken.length ) {
					const auth = window.btoa( `${username}:${authToken}` )
					headers.set( 'Authorization', `Basic ${auth}` )
				}

				break
			}
		}

		options.headers = headers
		let res = await fetch( url, options )

		res = await res.json()

		const timeEnd = performance.now()
		logTime( action, timeStart, timeEnd )

		// valid responses will always have a "data" and "success" property
		if( !res.data || !Object.prototype.hasOwnProperty.call( res, 'success' ) ) {
			console.dir({ action, params, res })
			throw new Error( 'Unknown error occurred interacting with server' )

		} else if( !res.success ) {
			console.dir({ action, params, res })
			throw new Error( res.data.error )

		} else {
			return res.data
		}
	},


	getArticles( page = 1, count = 25 ) {
		const params = new URLSearchParams()

		params.set( 'page', page )
		params.set( 'count', count )

		return this.fetch( 'articles', params )
	},


	getTags() {
		return this.fetch( 'tags' )
	},	


	/**
	 * Get authorization password from WP
	 * 
	 * @param	{string}	username 	WP account username
	 * @param 	{string} 	password 	WP account password
	 * 
	 * @return	{obj}
	 */
	getAuthPassword( username = '', password = '' ) {
		const params = new URLSearchParams()

		params.set( 'username', username )
		params.set( 'password', password )

		return this.fetch( 'auth-token', params, 'POST' )
	},


	checkAuth( username = '', authToken = '' ) {
		const params = new URLSearchParams()

		params.set( 'username', username )
		params.set( 'auth_token', authToken )

		return this.fetch( 'auth-token/validate', params, 'POST' )
	},


	/**
	 * Add new article
	 * 
	 * @param	{string}	username	WP account username
	 * @param 	{string} 	password	WP authorization token
	 * @param 	{string}	url 		URL for article
	 * @param 	{array}		tags  		Categorical tags for article
	 * 
	 * @return	{error|obj}				Fetch error or success response data
	 */	
	saveArticle( username = '', authToken = '', url, tags ) {
		const params = new URLSearchParams()

		params.set( 'url', url )
		params.set( 'tags', tags )

		return this.fetch( 'articles', params, 'POST', username, authToken )
	},


	/**
	 * Update article state (e.g. read or favorited)
	 * 
	 * @param	{string}	username	WP account username
	 * @param 	{string} 	password	WP authorization token
	 * @param 	{number}	articleId	Post ID for article
	 * @param 	{bool}		isRead 		True, if article should be marked as read
	 * @param 	{bool}		isFavorite 	True, if article should be marked as favorited
	 * 
	 * @return	{error|obj}				Fetch error or success response data
	 */	
	updateArticle( username = '', authToken = '', articleId, isRead, isFavorite ) {
		const params = new URLSearchParams()
	
		params.set( 'id', articleId )

		if( undefined !== isRead ) {
			params.set( 'read', isRead )
		}

		if( undefined !== isFavorite ) {
			params.set( 'favorite', isFavorite )
		}

		return this.fetch( `articles/${articleId}`, params, 'POST', username, authToken )
	},

}



export default WpApi