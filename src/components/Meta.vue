<template>
	<section class="meta">
		<div class="filtering">

			<v-select 
				@option:selected="handleSelectedOption"
				:options="selectOptions"
				:searchable="false"
				v-model="selectedOption" 
				placeholder="Select tags ..."
			>
				<!-- <template 
					v-slot:caret
				>
				</template> -->
			</v-select>
		</div>

		<div class="summary">
			<span class="summary__total summary__total--to-read">
				Articles to Read:
				<strong class="summary__total__count">
					{{ total_to_read }}
				</strong>
			</span>

			<span class="summary__total summary__total--read">
				Articles Read:
				<strong class="summary__total__count">
					{{ total_read }}
				</strong>
			</span>			
		</div>

	</section>
</template>


<style lang="scss">
	.meta {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		margin-bottom: remCalc( 48 );

		@media( min-width: #{$mediaTablet} ) {
			& {
				flex-wrap: nowrap;
				justify-content: flex-end;
			}

		}
	}

	.summary {
		display: none;
		margin-left: remCalc( 24 );

		&__total {
			&:first-of-type {
				margin-right: remCalc( 16 );
			}

			&__count {
				font-size: remCalc( 18 );
			}
		}
	}

	@media( min-width: 768px ) {
		.summary {
			display: block;
		}
	}

	.filtering {
		flex: 1 0;
	}

	.v-select {
		--vs-border-width: none;
		--vs-border-style: none;
		--vs-border-color: transparent;
		--vs-border-radius: 0;
		--vs-search-input-color: #b3b3b3;
		--vs-selected-color: #b3b3b3;
		--vs-dropdown-option-padding: 0.75rem 1.5rem;
		--vs-dropdown-option-color: #b3b3b3;
		--vs-dropdown-option--active-bg: #6e6995;
		--vs-dropdown-box-shadow: none;
		background-color: #f2f2f2;
		padding-right: remCalc( 32 );
		// padding-left: remCalc( 50 );
		// padding-right: remCalc( 50 );

		.vs {
			&__selected-options {
				padding: remCalc( 8 ) remCalc( 16 ) !important;
			}

			&__dropdown-option {
				@include transitionSimple;
			}

			&__dropdown-menu {
				--vs-border-width: 1px;
				--vs-border-style: solid;
				--vs-border-color: #f2f2f2;
			}

			&__clear {
				display: none;
				margin-right: remCalc( 32 );
			}
		}
	}

	.multiselect {
		$top: &;

		color: $grayText;
		font-size: remCalc( 16 );

		&__select {
			display: flex;
			height: 100%;
			flex-direction: column;
			align-items: center;
			justify-content: center;

			&:before {
				top: initial;
				right: initial;
				display: block;
				width: remCalc( 8 );
				height: remCalc( 8 );
				border: remCalc( 2 ) solid;
				border-color: $grayText $grayText transparent transparent;
				transform: rotateZ( 135deg );
			}
		}

		&__input {
			display: block;
			min-height: unset;
			margin-bottom: 0;
			padding-left: 0;
			line-height: remCalc( 20 );
			color: $grayText;
			background-color: transparent;
			border-radius: 0;
		}

		&__placeholder {
			margin-bottom: 0;
			padding-top: 0;
			color: $grayText;
			line-height: remCalc( 20 );
		}

		&__tags {
			display: flex;
			align-content: center;
			padding: remCalc( 16 );
			font-size: remCalc( 16 );
			background-color: $grayLight;
			border: none;
			border-radius: 0;
		}

		&__tag {
			position: relative;
			height: remCalc( 32 );
			margin-right: remCalc( 32 );
			margin-bottom: 0;
			padding: remCalc( 9 ) remCalc( 18 ) 0 remCalc( 14 );
			font-size: remCalc( 12 );
			color: #fff;
			background-color: $purple;
			border-radius: remCalc( 10 ) 0 0 remCalc( 10 );
			overflow: visible;

			&:before {
				content: '';
				position: absolute;
				top: 0;
				right: 0;
				width: 0;
				height: 0;
				border-style: solid;
				border-width: remCalc( 16 ) 0 remCalc( 16 ) remCalc( 16 );
				border-color: transparent transparent transparent $purple;
				transform: translateX( 100% );
			}

			&-icon {
				inset: 50% remCalc( -6 ) auto auto;
				transform: translateY( -50% );

				&:after {
					color: #fff;
				}
			}
		}

		&__option {
			$top: &;

			&--highlight,
			&--highlight:after {
				background-color: $greenLight;
			}

			&--selected,
			&--selected:after {
				background-color: $purple;
				color: #fff;
			}

			&--highlight#{$top}--selected,
			&--highlight#{$top}--selected:after {
				background-color: $red;
			}
		}
	}
</style>


<script>
	import 'vue-select/dist/vue-select.css'
	import vSelect from 'vue-select'
	

	export default {
		name: 'Meta',
		components: {
			vSelect
		},		

		props: {
			total_to_read: {
				type: Number,
				required: true,
			},

			total_read: {
				type: Number,
				required: true,
			},

			tags: {
				type: Map,
				required: true,
			},
		},


		data() {
			return {
				selectedOption: [],
			}
		},


		methods: {
			handleSelectedOption( option ) {
				this.$emit( 'selected_tag_filter', option.value )
			},
		},


		computed: {
			selectOptions() {
				const options = []

				options.push({
					value: null,
					label: 'All articles'
				})

				this.tags.forEach( tag => {
					options.push({
						value: tag.id,
						label: tag.name,
					})
				})

				return options
			},
		},

	}
</script>
