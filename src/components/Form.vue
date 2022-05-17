<template>
	<form 
		@submit.prevent="handleSubmit"
		class="form"
	>
		<div class="form__top">
			<!-- @todo — use "url" for input type? -->
			<input 
				@input="handleInput"
				v-model="articleUrl"
				class="form__input-url"
				placeholder="https://example.com"
				type="text"
				title="Add new article"
			/>
		</div>
		<div class="form__bottom">
			<div class="form__tags">
				<button 
					@click="tag.isActive = !tag.isActive"
					v-for="[ key, tag ] in tags"
					:key="key"
					:title="tag.name"
					:class="{ 'form__tag--active' : tag.isActive }"
					type="button"
					class="form__tag"
				>
					{{ tag.name }}
				</button>
			</div>

			<button
				:class="{ 'is-submitting' : is_submitting }"
				:disabled="true === is_submitting"
				class="form__submit"
			>
				<i class="form__submit__icon"></i>
			</button>
		</div>
	</form>
</template>


<style lang="scss">
	.form {
		margin-bottom: remCalc( 36 );

		&__input-url {
			width: 100%;
			height: remCalc( 75 );
			margin-bottom: remCalc( 18 );
			padding-left: remCalc( 50 );
			padding-right: remCalc( 50 );
			font-size: remCalc( 24 );
			color: $grayText;
			background-color: $grayLight;
		}

		&__submit {
			$top: &;

			display: flex;
			@include flexItem( 0 );
			align-items: center;
			justify-content: center;
			margin-left: auto;
			padding: none !important;
			width: remCalc( 75 );
			height: remCalc( 75 );
			background-color: $greenDark;
			transition: background-color .2s;

			&:hover:not([disabled]) {
				background-color: $greenLight;
			}

			&[disabled] {
				cursor: not-allowed;
			}

			&__icon {
				$iconSize: remCalc( 16 );
				$iconDepth: remCalc( 3 );

				position: relative;
				display: block;
				width: $iconSize;
				height: $iconSize;
				@include transitionSimple;

				#{$top}.is-submitting & {
					animation: submitSpin 1s linear infinite;
				}

				@keyframes submitSpin {
					0% {
						transform: rotateZ( 0 );
					}

					100% {
						transform: rotateZ( 360deg );
					}					
				}

				&:before,
				&:after {
					content: '';
					position: absolute;
					top: 50%;
					left: 50%;
					width: $iconDepth;
					height: $iconSize;
					background-color: #fff;
					@include transitionSimple;
				}

				&:before {
					transform: translate3d( -50%, -50%, 0 );
				}

				&:after {
					transform: translate3d( -50%, -50%, 0 ) rotatez( 270deg );
				}	
				
				#{$top}.is-submitting &:before,
				#{$top}.is-submitting &:after {
					display: block;
					width: $iconSize;
					height: $iconSize;
					background-color: transparent;
					border: $iconDepth solid transparent;
					border-radius: 50%;
				}		

				#{$top}.is-submitting &:before {
					border-top-color: #fff;
				}

				#{$top}.is-submitting &:after {
					border-bottom-color: #fff;
					transform: translate3d( -50%, -50%, 0 ) rotatez( 360deg );
				}				
			}
		}

		&__tags {
			display: flex;
			flex-wrap: wrap;
			min-height: remCalc( 132 );
			padding-right: remCalc( 16 );
		}

		&__tag {
			position: relative;
			display: inline-flex;
			height: remCalc( 32 );
			margin: 0 remCalc( 20 ) remCalc( 12 ) 0;
			padding: remCalc( 9 ) remCalc( 18 ) 0 remCalc( 14 );
			font-size: remCalc( 12 );
			color: $grayText;
			background-color: $grayLight;
			border-top-left-radius: remCalc( 10 );
			border-bottom-left-radius: remCalc( 10 );
			cursor: pointer;
			@include transitionSimple;

			&:before,
			&:after {
				content: '';
				position: absolute;
				display: block;
			}
			
			&:before {
				top: 0;
				right: 0;
				width: 0;
				height: 0;
				border-style: solid;
				border-width: remCalc( 16 ) 0 remCalc( 16 ) remCalc( 16 );
				border-color: transparent transparent transparent $grayLight;
				transform: translateX( 100% );
				@include transitionSimple;
			}
			
			&:after {
				top: 50%;
				right: 0;
				width: remCalc( 8 );
				height: remCalc( 8 );
				border-radius: 50%;
				background-color: white;
				transform: translateY( -50% );
			}		

			&:hover,
			&.form__tag--active {
				color: white;
				background-color: $purple;

				&:before {
					border-left-color: $purple;
				}
			}
		}		

		&__bottom {
			@include flex;
		}
	}
</style>


<script>
	export default {
		name: 'Form',

		props: {
			tags: {
				type: Map,
				required: true
			},

			is_submitting: {
				type: Boolean,
				required: true,
			},

			has_saved: {
				type: Boolean,
				required: true,
			}
		},


		data() {
			return {
				articleUrl: '',
			}
		},


		watch: {
			has_saved() {
				this.resetForm()
			}
		},


		methods: {
			handleInput() {
				if( !this.is_submitting ) {
					this.$emit( 'set_status' )
				}
			},


			handleSubmit() {
				if( !this.is_submitting ) {
					let articleUrl = this.articleUrl.trim()

					if( !articleUrl.length ) {
						return this.$emit( 'set_status', 'error', 'Please input an article URL' )
					}

					const activeTags = []

					this.tags.forEach( tag => {
						if( tag.isActive ) {
							activeTags.push( tag.id )
						}
					})

					this.$emit( 'submit_article', articleUrl, activeTags )
				}
			},


			resetForm() {
				this.articleUrl = ''
				this.tags.forEach( tag => tag.isActive = false )				
			},

		},

	}

</script>