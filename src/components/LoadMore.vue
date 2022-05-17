<template>
	<aside 
		:class="additionalClasses"
		class="load-more"
	>
		<i class="load-more__icon"></i>
	</aside>
</template>


<style lang="scss">
	.load-more {
		$top: &;

		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-top: remCalc( 48 );

		&__icon {
			display: block;
			width: remCalc( 60 );
			height: remCalc( 60 );

			border: solid remCalc( 6 );
			border-radius: 50%;
			border-color: $greenLight transparent;

			opacity: 0;
			visibility: hidden;
			@include transitionSimple;	

			animation: submitSpin 1s linear infinite;

			#{$top}--is-loading & {
				opacity: 1;
				visibility: visible;
			}
		}
	}


	@keyframes submitSpin {
		0% {
			transform: rotateZ( 0 );
		}

		100% {
			transform: rotateZ( 360deg );
		}
	}

</style>


<script>
	export default {
		name: 'LoadMore',


		props: {
			is_loading: {
				type: Boolean,
				required: true
			}
		},


		data() {
			return {
				observer: null
			}
		},


		computed: {
			additionalClasses() {
				const classes = []

				if( this.is_loading ) {
					classes.push( 'load-more--is-loading' )
				}

				return classes
			}
		},


		methods: {
			handleIntersectionEntry( entry ) {
				if( !this.is_loading && entry.isIntersecting ) {
					this.$emit( 'hit_bottom' )
				}
			}
		},


		mounted() {
			this.observer = new IntersectionObserver( entries => {
				entries.forEach( entry => this.handleIntersectionEntry( entry ) )
			}, this.options )

			this.observer.observe( this.$el )
		},


		unmounted() {
			this.observer.disconnect()
		}

	}
	
</script>