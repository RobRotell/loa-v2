const isProduction = process.env.NODE_ENV === 'production'


function logInfo( msg, ...args ) {
	if( !isProduction ) {
		console.info( msg )

		if( args.length ) {
			args.forEach( arg => {
				console.info( arg )
			})
		}
	}
}


function logTime( action, start, end ) {
	const styles = [
		'padding: 2px 4px',
		'color: #fff',
		'background-color: #6e6995',
		'border-radius: 3px'
	]

	if( !isProduction ) {
		console.info( `%cACTION:%c "${action}" (${end - start}ms)`, styles.join( ';' ) )
	}
}


function logError( err ) {
	if( !isProduction ) {
		console.error( err )
	}
}


function logWarn( warning ) {
	if( !isProduction ) {
		console.warn( warning )
	}
}



export { logInfo, logTime, logError, logWarn }