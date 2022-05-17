<template>
	<form 
		@submit.prevent="maybeValidateAuth"
		@keyup.enter="maybeValidateAuth"
		:class="formClasses"
		class="auth"
	>

		<input 
			v-model="username"
			:disabled="inputIsDisabled"
			class="auth__input"
			type="text"
			placeholder="Username"
		>

		<input 
			v-model="password"
			:disabled="inputIsDisabled"
			class="auth__input"
			type="password"
			placeholder="Password"
		>		

		<button 
			@click="handleLipClick"
			class="auth__lip" 
			type="button"
		>
			<svg class="auth__lip__icon" enable-background="new 0 0 350 350" version="1.1" viewBox="0 0 350 350" xml:space="preserve" xmlns="http://www.w3.org/2000/svg">
				<path d="m175 171.17c38.914 0 70.463-38.318 70.463-85.586 0-47.269-10.358-85.587-70.463-85.587s-70.465 38.318-70.465 85.587c0 47.268 31.549 85.586 70.465 85.586z"/>
				<path d="m41.909 301.85c-0.012-2.882-0.024-0.812 0 0z"/>
				<path d="m308.08 304.1c0.038-0.789 0.013-5.474 0 0z"/>
				<path d="m307.94 298.4c-1.305-82.342-12.059-105.8-94.352-120.66 0 0-11.584 14.761-38.584 14.761s-38.586-14.761-38.586-14.761c-81.395 14.69-92.803 37.805-94.303 117.98-0.123 6.547-0.18 6.891-0.202 6.131 5e-3 1.424 0.011 4.058 0.011 8.651 0 0 19.592 39.496 133.08 39.496 113.49 0 133.08-39.496 133.08-39.496 0-2.951 2e-3 -5.003 5e-3 -6.399-0.022 0.47-0.066-0.441-0.149-5.708z"/>
			</svg>
		</button>
	</form>
</template>


<style lang="scss">
	.auth {
		$top: &;
		$height: remCalc( 45 );

		position: absolute;
		top: 0;
		right: remCalc( 20 );
		@include flex( nowrap );

		&__input {
			margin-right: remCalc( 8 );
			padding: remCalc( 8 ) remCalc( 16 );
			color: $grayTextDark;
			border: solid $grayLight;
			border-width: remCalc( 1 );
			background-color: $grayLight;
			outline: none !important;
			opacity: 0;
			visibility: hidden;
			@include transitionSimple;

			&:focus,
			&:active {
				border-color: $grayText;
			}

			#{$top}.is-expanded & {
				opacity: 1;
				visibility: visible;
			}
		}

		&__lip {
			display: flex;
			align-items: center;
			justify-content: center;
			height: $height;
			width: remCalc( 60 );
			fill: white;
			background-color: $yellow;
			@include transitionSimple;

			#{$top}.is-logged-in & {
				background-color: $greenLight;
			}

			&__icon {
				width: remCalc( 24 );
				background-color: transparent;
			}
		}
	}
</style>


<script>
	import WpApi from '../controllers/WpApi'
	import StorageApi from '../controllers/StorageApi'
	import Auth from '../data/Auth'

	
	export default {
		name: 'Signin',

		props: {
			saved_username: {
				type: String,
				default: '',
			},

			logged_in: {
				type: Boolean,
				default: false,
			}
		},


		data() {
			return {
				username: '',
				password: '',

				states: {
					isExpanded:		false,
					isValidating:	false,
				},
			}
		},


		computed: {
			formClasses() {
				const classes = []

				if( this.states.isExpanded ) {
					classes.push( 'is-expanded' )
				}

				if( this.logged_in ) {
					classes.push( 'is-logged-in' )
				}

				return classes.join(' ')
			},

			inputIsDisabled() {
				return ( this.logged_in || this.states.isValidating )
			}
		},


		methods: {
			handleLipClick() {
				if( this.states.isValidating ) {
					return
				}

				if( !this.states.isExpanded ) {
					this.states.isExpanded = true
				} else if( this.logged_in ) {
					this.states.isExpanded = false
				} else {
					this.maybeValidateAuth()
				}
			},

			maybeValidateAuth() {
				if( !this.states.isValidating && !this.logged_in ) {
					this.validateAuth()
				}
			},

			validateAuth() {
				if( 3 > this.username.length ) {
					this.$emit( 
						'set_status', 
						'error', 
						'Username must be at least three characters long.'
					)
				} else if( 5 > this.password.length ) {
					this.$emit( 
						'set_status', 
						'error', 
						'Password must be at least six characters long.'
					)
				} else {
					this.states.isValidating = true

					this.$emit(
						'set_status',
						'working',
						'Validating credentials ...'
					)					

					WpApi
						.getAuthPassword( this.username, this.password )
						.then( result => {
							const { auth_token } = result

							if( 'string' !== typeof auth_token || !auth_token.length ) {
								throw new Error( 'Invalid authorization code!' )
							} else {
								this.$emit(
									'set_status',
									'success',
									'Successfully authorized!'
								)

								this.$emit(
									'save_auth_creds',
									this.username,
									auth_token
								)

								this.password = '********'
								this.states.isExpanded = false
							}

						}).catch( err => {
							this.$emit(
								'set_status',
								'error',
								err.toString()
							)
						
						}).finally( () => {
							this.states.isValidating = false
						})
				}
			},
		},


		beforeMount() {
			if( this.saved_username.length ) {
				this.username = this.saved_username
				this.password = '********'
			}
		},


		mounted() {}

	}

</script>