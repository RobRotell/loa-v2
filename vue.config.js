module.exports = {
	css: {
		loaderOptions: {
			// by default the `sass` option will apply to both syntaxes
			// because `scss` syntax is also processed by sass-loader underlyingly
			// but when configuring the `prependData` option
			// `scss` syntax requires an semicolon at the end of a statement, while `sass` syntax requires none
			// in that case, we can target the `scss` syntax separately using the `scss` option
			scss: {
				prependData: `@import "~@/assets/scss/global.scss";`
			},
		}
	},
	chainWebpack: config => {
		config
			.plugin( 'html' )
			.tap( args => {
				args[0].title = 'Loa'
				args[0].description = 'Simple article tracker made with VueJS and WP\'s REST API and authentication tokens.'
				args[0].coolness = '😎'

				return args
			})
	},
	outputDir: 'build',
}