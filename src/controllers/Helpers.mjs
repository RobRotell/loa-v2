import { logInfo } from './Logger.mjs'
// import StorageApi from './StorageApi.mjs'



const getLastModifiedTimestamp = async () => {

	const timeStart = performance.now()

	const options = {}
	options.method = 'POST'
	options.headers = {
		'Content-Type': 'application/x-www-form-urlencoded'
	}
	options.body = new URLSearchParams()
	options.body.set( '_loa', 'timestamp' )

	const req = await fetch( 'https://vril.robr.app', options )
	const res = await req.json()

	const timestamp = res.data

	const timeEnd = performance.now()
	logInfo( `Fetch:: "get-timestamp": ${timeEnd - timeStart}ms` )

	// save timestamp
	// StorageApi.timestamp = timestamp

	// console.log( StorageApi )

	return timestamp
}



const validateUrl = ( arg ) => {
	const urlRegex = new RegExp( '^(?:(?:(?:https?|ftp):)?\\/\\/)(?:\\S+(?::\\S*)?@)?(?:(?!(?:10|127)(?:\\.\\d{1,3}){3})(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z0-9\\u00a1-\\uffff][a-z0-9\\u00a1-\\uffff_-]{0,62})?[a-z0-9\\u00a1-\\uffff]\\.)+(?:[a-z\\u00a1-\\uffff]{2,}\\.?))(?::\\d{2,5})?(?:[/?#]\\S*)?$', 'i' )

	return urlRegex.test( arg )
}



export { getLastModifiedTimestamp, validateUrl }