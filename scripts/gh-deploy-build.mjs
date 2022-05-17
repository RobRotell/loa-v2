import { execa } from 'execa'
import fs from 'fs'

( async () => {

	console.log( 'Running ...' )

	try {
		const buildDir 		= 'build'
		const buildBranch 	= 'live-build'

		await execa( 'git', [ 'checkout', '--orphan', buildBranch ] )

		console.log( 'Building ...' )

		await execa( 'npm', [ 'run', 'build' ] )
		await execa( 'git', [ '--work-tree', buildDir, 'add', '--all' ] )
		await execa( 'git', [ '--work-tree', buildDir, 'commit', '-m', buildBranch ] )
		
		console.log( 'Pushing to build ...' )

		await execa( 'git', [ 'push', 'origin', `HEAD:${buildBranch}`, '--force' ] )
		await execa( 'rm', [ '-r', buildDir ] )
		await execa( 'git', [ 'checkout', '-f', 'main' ] )
		await execa( 'git', [ 'branch', '-D', buildBranch ] )

		console.log( 'Deployed!' )

	} catch( err ) {
		console.log( 'Encountered error ...' )
		console.warn( err.message )
		console.log( 'Exiting ...' )
		process.exit( 1 )
	}

}) ()
