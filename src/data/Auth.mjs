import StorageApi from '../controllers/StorageApi'
import WpApi from '../controllers/WpApi'
import { logWarn } from '../controllers/Logger'


const Auth = {


	username:	null,
	authToken:	null,


	async get() {

		// have we already verified?
		if( !this.username || !this.authToken ) {

			// let's check local storage
			const { username, authToken } = this.getCredsFromStorage()
	
			// check creds against WP
			const isValid = await this.validateCreds( username, authToken )
			
			if( isValid ) {
				this.username 	= username
				this.authToken 	= authToken
			}
		}

		if( this.username && this.authToken ) {
			return {
				username: 	this.username,
				authToken:	this.authToken,
			}
		}

		return false
	},


	/**
	 * Get credentials from storage
	 * 
	 * @return	{obj} 	
	 */
	getCredsFromStorage() {
		const creds = {
			username:	'',
			authToken:	'',
		}

		const fromStorage = StorageApi.auth

		if( null !== fromStorage ) {
			const { username, authToken } = fromStorage

			creds.username	= username
			creds.authToken	= authToken
		}

		return creds
	},


	/**
	 * Compare against WP
	 * 
	 * @param	{mixed} username
	 * @param 	{mixed} authToken
	 * 
	 * @return	{bool} True, if creds are valid
	 */
	async validateCreds( username = '', authToken = '' ) {
		if( 
			'string' !== typeof username || !username.length || 
			'string' !== typeof authToken || !authToken.length 
		) {
			return false
		}

		// let's check if these creds are valid
		const req = await WpApi.checkAuth( username, authToken )

		return req.valid ?? false
	},

}


export default Auth