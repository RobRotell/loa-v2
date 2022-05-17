<template>
	<article 
		:class="{ 'article--read' : is_read }"
		class="article"
	>
		<div class="article__left">
			<a 
				:href="url"
				:title="title"
				class="article__url"
				target="_blank"
				rel="nofollow noopener noreferrer"
			>
				<span class="article__url__text">
					{{ title }}
				</span>
			</a>

			<div class="article__tags">
				<span class="article__tags__label">Tags:&nbsp;</span>
				<span 
					v-if="displayTags.length"
					class="article__tags__list"
				>
					{{ displayTags }}
				</span>

				<span 
					v-else
					class="article__tags__list article__tags__list__empty"
				>
					<em>(none)</em>
				</span>				

			</div>
		</div>

		<div class="article__right">
			<div class="article__btns">
				<button 
					@click="handleClickRead"
					:class="{ 'is-active': is_read }"
					class="article__btn article__btn--read"
					type="button"
					title="I've read this article"
				>
					<svg class="article__btn__svg" enable-background="new 0 0 296.999 296.999" version="1.1" viewBox="0 0 296.999 296.999" xml:space="preserve" xmlns="http://www.w3.org/2000/svg">
						<path d="m45.432 35.049h-0.025c-2.809 0-5.451 1.095-7.446 3.085-2.017 2.012-3.128 4.691-3.128 7.543v159.36c0 5.844 4.773 10.61 10.641 10.625 24.738 0.059 66.184 5.215 94.776 35.136v-166.78c0-1.981-0.506-3.842-1.461-5.382-23.467-37.792-68.563-43.534-93.357-43.592z"/>
						<path d="m262.17 205.04v-159.37c0-2.852-1.111-5.531-3.128-7.543-1.995-1.99-4.639-3.085-7.445-3.085h-0.026c-24.793 0.059-69.889 5.801-93.357 43.593-0.955 1.54-1.46 3.401-1.46 5.382v166.78c28.592-29.921 70.038-35.077 94.776-35.136 5.867-0.015 10.64-4.781 10.64-10.624z"/>
						<path d="m286.37 71.801h-7.706v133.24c0 14.921-12.157 27.088-27.101 27.125-20.983 0.05-55.581 4.153-80.084 27.344 42.378-10.376 87.052-3.631 112.51 2.171 3.179 0.724 6.464-0.024 9.011-2.054 2.538-2.025 3.994-5.052 3.994-8.301v-168.9c1e-3 -5.859-4.767-10.626-10.626-10.626z"/>
						<path d="m18.332 205.04v-133.24h-7.706c-5.858 0-10.626 4.767-10.626 10.626v168.9c0 3.25 1.456 6.276 3.994 8.301 2.545 2.029 5.827 2.78 9.011 2.054 25.46-5.803 70.135-12.547 112.51-2.171-24.502-23.19-59.1-27.292-80.083-27.342-14.943-0.036-27.101-12.203-27.101-27.124z"/>
					</svg>
				</button>

				<button
					@click="handleClickFavorite"
					:class="{ 'is-active': is_favorite }"
					class="article__btn article__btn--favorite"
					type="button"
					title="I like this article"
				>
					<svg class="article__btn__svg" enable-background="new 0 0 512 512" version="1.1" viewBox="0 0 512 512" xml:space="preserve" xmlns="http://www.w3.org/2000/svg">
						<path d="m448.8 0h-385.6c-8.284 0-15 6.716-15 15v482c0 5.198 2.692 10.026 7.114 12.76 4.423 2.734 9.945 2.981 14.595 0.656l186.09-93.045 186.09 93.045c2.117 1.059 4.415 1.584 6.708 1.584 2.742 0 5.478-0.752 7.887-2.24 4.422-2.733 7.114-7.562 7.114-12.76v-482c-1e-3 -8.284-6.718-15-15.001-15zm-85.929 192.18l-42.551 41.477 9.906 57.751c0.246 1.078 0.376 2.199 0.376 3.352 0 8.274-6.7 14.984-14.972 15h-0.05c-2.388 0-4.783-0.569-6.978-1.723l-52.602-27.648-52.6 27.648c-2.194 1.153-4.591 1.723-6.978 1.723-3.11 0-6.205-0.966-8.819-2.865-4.618-3.357-6.932-9.044-5.966-14.671l10.048-58.566-42.556-41.477c-4.089-3.985-5.561-9.947-3.796-15.377 1.765-5.431 6.459-9.389 12.109-10.209l58.809-8.546 26.296-53.289c2.527-5.12 7.741-8.362 13.451-8.362s10.925 3.241 13.451 8.361l26.301 53.29 58.806 8.546c5.65 0.82 10.345 4.778 12.109 10.208 1.766 5.43 0.294 11.391-3.794 15.377z"/>
					</svg>
				</button>
			</div>
		</div>

	</article>
</template>


<style lang="scss">
	.article {
		$top: &;

		margin-top: remCalc( 24 );
		margin-bottom: remCalc( 48 );
		border-top: remCalc( 3 ) solid $grayLight;
		@include flex();
		@include transitionSimple;

		&--read {
			opacity: 0.6;
		}

		&__left {
			padding-left: remCalc( 16 );
			@include flex( nowrap, column );
			@include flexItem( 1, 0, 0 );
		}

		&__right {
			border-left: remCalc( 3 ) solid $grayLight;
			align-items: center;
			align-content: center;
		}

		// &:hover {
		// 	transform: translateX( remCalc( 2.5 ) );
		// }

		&--active {
			transform: translateY( 0 );
			opacity: 1;
			visibility: visible;
		}
		
		&__url {
			display: block;
			display: -webkit-box;
			width: 100%;
			margin-bottom: remCalc( 8 );
			padding-top: remCalc( 16 );
			padding-right: remCalc( 32 );
			// line-height: remCalc( 44 );
			font-weight: $fontHeavy;
			font-size: remCalc( 24 );
			text-decoration: none;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 1;
			overflow: hidden;
			visibility: visible;
			color: $grayText;
			word-break: break-all;
			@include transitionSimple;

			// #{$top}--read &:after {
			// 	text-decoration: line-through;
			// }

			&:hover {
				color: $greenLight;
			}

			&:before {
				content: '';
				position: absolute;
				top: 50%;
				left: 0;
				display: block;
				width: 0;
				height: remCalc( 1 );
				background-color: $grayText;
				transform: translate3d( 0, -50%, 0 );
				@include transitionSimple;

				#{$top}--read & {
					width: 100%;
				}
			}

			&__text {
				position: relative;

				&:before {
					content: '';
					position: absolute;
					top: 50%;
					display: block;
					width: 0;
					height: remCalc( 3 );
					background-color: $grayText;
					transform: translate3d( 0, -50%, 0 );
					@include transitionSimple;
					
					#{$top}--read & {
						width: calc( 100% );
					}					
				}
			}
		}

		&__tags {
			@include flex;
			align-items: center;
			// margin-bottom: remCalc( 16 );

			&__label {
				font-weight: $fontBold;
			}
		}

		&__btns {
			height: 100%;
			@include flex( wrap );
		}
		
		&__btn {
			width: remCalc( 60 );
			padding-left: remCalc( 16 );
			padding-right: remCalc( 16 );
			background-color: transparent;
			fill: $teal;
			cursor: pointer;
			@include transitionSimple;

			&:first-of-type {
				border-right: remCalc( 3 ) solid $grayLight;
			}

			&--read:hover,
			&--read.is-active {
				fill: $purple; 
			}   
			
			&--favorite:hover,
			&--favorite.is-active {
				fill: $red;
			} 
		}
	}
</style>


<script>
	export default {
		name: 'Article',

		props: {
			id: {
				type: Number,
				required: true,
			},
			title: {
				type: String,
				required: true,
			},
			url: {
				type: String,
				required: true,
			},
			is_favorite: {
				type: Boolean,
				default: false,
			},
			is_read: {
				type: Boolean,
				default: false,
			},
			tags: {
				type: Array,
				default() { 
					return [] 
				}, 
			}		
		},


		computed: {
			displayTags() {
				let tagNames = this.tags.map( tag => tag.name )

				return tagNames.join( ', ' )
			},
		},


		methods: {
			handleClickRead() {
				const oldStatus = this.is_read
				const newStatus = !this.is_read

				this.$emit( 'update_article', this.id, 'read', newStatus, oldStatus )
			},

			handleClickFavorite() {
				const oldStatus = this.is_favorite
				const newStatus = !this.is_favorite

				this.$emit( 'update_article', this.id, 'favorite', newStatus, oldStatus )
			}
		},

	}
</script>