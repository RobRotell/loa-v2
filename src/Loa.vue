<template>
	<main class="main">

		<Signin 
			@set_status="setStatus"
			@save_auth_creds="saveAuthCreds"
			:saved_username="user.username"
			:logged_in="states.userIsLoggedIn"
		/>
		
		<Status 
			@clear_status="clearStatus"
			:status="status"
		/>
		
		<Form 
			@set_status="setStatus"
			@submit_article="submitArticle"
			:is_submitting="states.isSubmitting"
			:has_saved="states.hasSaved"
			:tags="tags"
		/>

		<Meta
			:total_to_read="meta.articles.totalUnread"
			:total_read="meta.articles.totalRead"
			:tags="tags"
			@selected_tag_filter="handleSelectTagFilter"
		/>

		<ArticleList
			@fetch_next_page="fetchNextPageArticles"
			@update_article="handleUpdateArticle"
			:is_loading="states.isLoadingArticles"
			:articles="articles"		
		/>

	</main>
</template>


<style lang="scss">
	@import './assets/scss/normalize.scss';

	*,
	::before,
	::after {
		box-sizing: border-box;
	}

	html,
	body {
		min-height: 100vh;
		color: $grayText;
		text-rendering: optimizeLegibility;
		text-rendering: geometricPrecision;
		font-smooth: always;
		font-smoothing: antialiased;
		-moz-font-smoothing: antialiased;
		-webkit-font-smoothing: antialiased;
		-webkit-font-smoothing: subpixel-antialiased;
	}

	body {
		font-family: 'Figtree', sans-serif;
		font-weight: $fontReg;
		font-size: remCalc(16);
	}

	.main {
		position: relative;
		width: 100%;
		max-width: remCalc(1024);
		margin-left: auto;
		margin-right: auto;
		padding: remCalc( 72 ) remCalc( 20 ) remCalc( 100 );
		z-index: 1;

		&.is-loading:before {
			content: '';
			position: fixed;
			top: 0;
			left: 0;
			display: block;
			width: 100%;
			height: 100%;
			background-color: white;
			cursor: wait;
			transition: opacity .75s linear;
			z-index: 1000;

		}

		&.is-loaded:before {
			opacity: 0;
		}

		&.is-finished:before {
			display: none;
		}
	}

	input,
	textarea,
	button {
		border: none;
		-webkit-appearance: none;
	}

	button {
		cursor: pointer;
	}
</style>


<script>
	import Signin from './components/Signin.vue'
	import Status from './components/Status.vue'
	import Form from './components/Form.vue'
	import Meta from './components/Meta.vue'
	import ArticleList from './components/ArticleList.vue'

	import Articles from './data/Articles.mjs'
	import Tags from './data/Tags'
	import Auth from './data/Auth'

	import WpApi from './controllers/WpApi.mjs'
	import StorageApi from './controllers/StorageApi.mjs'
	import { validateUrl } from './controllers/Helpers.mjs'
	import { logInfo } from './controllers/Logger.mjs'


	export default {

		name: 'Loa',
		components: {
			ArticleList,
			Form,
			Meta,
			Signin,
			Status,
		},


		data() {
			return {
				articles:		new Map(),
				articlesMain: 	new Map(), // used for filtering
				tags: 			new Map(),

				status: {
					message: 	'',
					isError: 	false,
					isSuccess: 	false,
					isWorking: 	false,
				},

				meta: {
					articles: {
						totalCount:		0,
						totalRead: 		0,
						totalUnread:	0,
					},
					pages: {
						perPage:	25,
						current: 	1,
						total: 		0,
					},
				},

				states: {
					isSubmitting:		false,
					isLoadingArticles:	false,
					hasSaved: 			false,
					userIsLoggedIn: 	false,
					canFetchNextPage: 	true,
				},

				user: {
					username:	'',
					authToken:	'',
				},
			}
		},


		computed: {
		},


		methods: {
			clearStatus() {
				this.status = {
					message: '',
					isError: false,
					isSuccess: false,
					isWorking: false,
				}
			},


			setStatus( statusType, msg = '' ) {
				if( null === statusType || undefined === statusType ) {
					this.clearStatus()
				} else if( 'success' === statusType ) {
					this.setStatusSuccess( msg )
				} else if( 'error' === statusType ) {
					this.setStatusError( msg )
				} else if( 'working' === statusType ) {
					this.setStatusWorking( msg )
				} else {
					throw Error( `Invalid status type: "${statusType}"` )
				}
			},


			setStatusError( msg = '' ) {
				this.clearStatus()

				if( 'string' === typeof msg && msg.length ) {
					this.status.message = msg
					this.status.isError = true

					return true
				}

				return false
			},


			setStatusSuccess( msg = '' ) {
				this.clearStatus()

				if( 'string' === typeof msg && msg.length ) {
					this.status.message = msg
					this.status.isSuccess = true
				}
			},


			setStatusWorking( msg = '' ) {
				this.clearStatus()

				if( 'string' === typeof msg && msg.length ) {
					this.status.message = msg
					this.status.isWorking = true
				}
			},


			saveAuthCreds( username = '', authToken = '' ) {
				if( 'string' === typeof username && username.length && 'string' === typeof authToken && authToken.length ) {
					StorageApi.setAuthCreds( username, authToken )

					this.states.userIsLoggedIn = true
					this.user.username 	= username
					this.user.authToken = authToken

					return true
				}

				return false
			},


			getAuthStatus() {
				return !!( this.states.userIsLoggedIn && this.user.username.length && this.user.authToken.length )
			},


			submitArticle( url, tags ) {
				const self = this

				self.states.hasSaved = false
				self.states.isSubmitting = true

				return new Promise( ( resolve, reject ) => {

					// check user can save article
					if( !self.getAuthStatus() ) {
						return reject( 'You must be logged in to save an article!' )
					}

					// check that URL IS a URL
					if( !validateUrl( url ) ) {
						return reject( `Input is not a valid URL: "${url}"` )
					}

					self.setStatusWorking( `Saving article: "${url}"` )

					const { username, authToken } = this.user

					WpApi
						.saveArticle( username, authToken, url, tags )
						.then( response => {
							return resolve( response )
						}).catch( err => {
							return reject( err.message )
						})					
						
				}).then( data => {
					self.handleSavedArticle( data )

				}).catch( err => {
					self.setStatusError( err )

				}).finally( () => self.states.isSubmitting = false )
			},


			handleSavedArticle( data ) {

				// update article count
				this.meta.articles.totalCount = data.meta.total_articles
				this.meta.articles.totalRead = data.meta.total_read_articles				

				// resets form
				this.states.hasSaved = true

				this.setStatusSuccess( `Successfully saved article: "${data.article.title}"!` )
			},


			handleUpdateArticle( articleId, attr, newStatus, oldStatus ) {
				if( !this.getAuthStatus() ) {
					return this.setStatusError( 'You must be logged in to update an article\'s status!' )
				}

				const article = this.articles.get( articleId )

				// keep UI persistent (e.g. they clicked "Read", show as "Read" while updating backend)
				if( 'read' === attr ) {
					article.is_read = newStatus
				} else if( 'favorite' === attr ) {
					article.is_favorite = newStatus
				}

				WpApi
					.updateArticle(
						this.user.username,
						this.user.authToken,
						article.id,
						( 'read' === attr ) ? newStatus : undefined,
						( 'favorite' === attr ) ? newStatus : undefined
					
					// update article count
					).then( data => {
						
						// refresh meta values
						this.getMeta()
						
					// if error, reset status to previous state
					}).catch( err => {
						console.warn( err )

						if( 'read' === attr ) {
							article.is_read = oldStatus
						} else if( 'favorite' === attr ) {
							article.is_favorite = oldStatus
						}

						this.setStatusError( err.essage )
					})
			},


			fetchNextPageArticles() {
				if( !this.states.canFetchNextPage ) {
					return
				}

				++this.meta.pages.current

				if( this.meta.pages.total && this.meta.pages.current >= this.meta.pages.total ) {
					return
				}

				this.fetchArticles( true )
			},


			handleSelectTagFilter( tagId ) {
				if( null === tagId ) {
					this.states.canFetchNextPage = true

					this.articles.clear()
					for( const [ key, value ] of this.articlesMain ) {
						this.articles.set( key, value )
					}
					
					this.articlesMain.clear()
					
				} else {
					this.states.canFetchNextPage	= false
					this.states.isLoadingArticles 	= true
	
					for( const [ key, value ] of this.articles ) {
						this.articlesMain.set( key, value )
					}
	
					this.articles.clear()
	
					WpApi
						.getArticlesByTag( tagId )
						.then( data => {
							data.articles.forEach( article => {
								this.articles.set( article.id, article )
							})
	
						}).catch( err => {
							this.setStatusError( err.message )
	
						}).finally( () => {
							this.getMeta()
							this.states.isLoadingArticles = false
					})
				}
			},			


			fetchArticles( skipStorage = false ) {
				this.states.isLoadingArticles = true

				WpApi
					.getArticles( this.meta.pages.current, this.meta.pages.perPage )
					.then( data => {
						this.meta.pages.total = data.meta.total_pages

						data.articles.forEach( article => {
							this.articles.set( article.id, article )
						})

						// only save first page of articles
						if( !skipStorage ) {
							StorageApi.articles = this.articles
						}
					}).then( () => {
						this.getMeta()
					}).catch( err => {
						this.setStatusError( err.message )
					}).finally( () => {
						this.states.isLoadingArticles = false 
					})
			},			


			/**
			 * Wrapper for getting articles. First, check localstorage, then check server
			 */
			async getArticles() {

				// loading animation
				this.states.isLoadingArticles = true

				const articles = await Articles.get()

				articles.forEach( article => {
					this.articles.set( article.id, article )
				})

				this.states.isLoadingArticles = false
			},


			/**
			 * Wrapper for getting tags. First, check localstorage, then check server
			 */
			async getTags() {
				const tags = await Tags.get()

				tags.forEach( tag => {
					this.tags.set( tag.id, tag )
				})
			},


			/**
			 * Wrapper for getting meta. We'll always fetch this from the server to ensure we're using the most up-to-date info
			 */
			async getMeta() {
				const { meta } = await WpApi.getMeta()

				this.meta.articles.totalCount 	= meta.total_articles
				this.meta.articles.totalRead 	= meta.total_articles_read
				this.meta.articles.totalUnread 	= meta.total_articles_unread
			},			


			/**
			 * Determine if user is logged in (Auth will handle fetching and validating date from local storage)
			 */
			async parseUserStatus() {
				const { username, authToken } = await Auth.get()

				if( username && authToken ) {
					this.user.username 	= username
					this.user.authToken = authToken

					this.states.userIsLoggedIn = true
				}
			}			


		},


		// earliest point we can kick off requests
		created() {
			this.getArticles()
			this.getTags()
			this.getMeta()
			this.parseUserStatus()
		},


		mounted() {},

	}

</script>