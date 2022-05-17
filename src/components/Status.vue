<template>
	<div
		:class="containerClasses"
		class="status"
	>
		{{ getMessage }}
	</div>
</template>


<style lang="scss">
	.status {
		min-height: remCalc( 52 );
		margin-bottom: remCalc( 16 );
		padding: remCalc( 16 ) remCalc( 20 );
		font-weight: $fontBold;
		font-size: remCalc( 18 );
		color: white;
		opacity: 0;
		visibility: hidden;
		@include transitionSimple;

		&--error {
			background-color: $red
		}

		&--working {
			background-color: $yellow
		}
		
		&--success {
			background-color: $greenLight
		}	

		&--active {
			opacity: 1;
			visibility: visible;
		}        
	}
</style>


<script>
	export default {
		name: 'Status',

		props: {
			status: {
				type: Object,
				required: true,
			},
		},


		data() {
			return {
				isVisible: false,
				timeoutClearStatus: null,
				observer: null,
			}
		},


		computed: {
			getMessage() {
				let message = ''

				if( 'string' === typeof this.status.message && this.status.message.length ) {
					message = this.status.message
				}

				return message
			},

			containerClasses() {
				const classes = []

				if( this.getMessage.length ) {
					classes.push( 'status--active' )

					if( this.status.isError ) {
						classes.push( 'status--error' )
					}

					if( this.status.isSuccess ) {
						classes.push( 'status--success' )
					}

					if( this.status.isWorking ) {
						classes.push( 'status--working' )
					}
				}

				return classes.join(' ')
			}
		},


		methods: {
			handleUpdatedComponent() {
				this.maybeScrollIntoView()
				this.maybeClearStatus()
			},

			maybeScrollIntoView() {
				if( this.status.isError && this.getMessage.length && !this.isVisible ) {
					window.scrollTo(
						{
							top: window.pageYOffset + this.$el.getBoundingClientRect().top,
							left: 0,
							behavior: 'smooth',
						}
					)
				}
			},

			maybeClearStatus() {
				clearTimeout( this.timeoutClearStatus )

				this.timeoutClearStatus = setTimeout( this.clearStatus, 2000 )
			},

			clearStatus() {

				// don't clear on errors or working status
				if( !this.status.isError && !this.status.isWorking ) {
					this.$emit( 'clear_status' )
				}
			},

			handleObserver( entries ) {
				entries.forEach( entry => {
					this.isVisible = entry.isIntersecting
				})
			}
		},


		updated() {
			this.handleUpdatedComponent()
		},


		mounted() {
			this.observer = new IntersectionObserver( 
				this.handleObserver, 
				{
					threshold: 1
				}
			)

			this.$nextTick( () => {
				this.observer.observe( this.$el )
			})
		},

	}
</script>