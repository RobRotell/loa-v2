<template>
	<section class="meta">
		<div class="filtering">

			<v-select 
				v-model="filterSelected" 
				:options="filterOptions"
				:multiple="true"
				:close-on-select="false"
				:clear-on-select="false"
				:preserve-search="true"	
				:dropdown-should-open="dropdownShouldOpen"
				label="name"
				track-by="name"
				placeholder="Select tags to filter ..."
			>
				<template 
					v-slot:caret
				>
				</template>
			</v-select>

			<!-- <Filter 
				:tags="tags"
			/> -->

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


<style src="vue-multiselect/dist/vue-multiselect.css"></style>
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

	.filtering {
		flex: 1 0;
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
			// Filter,
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
				filterSelected: [],
				// filterOptions: [],
			}
		},


		methods: {
			dropdownShouldOpen() {
				return false
			}
		},


		computed: {
			filterOptions() {
				const options = []

				this.tags.forEach( tag => {
					options.push({
						id: tag.id,
						name: tag.name,
					})
				})

				return options
			},
		}

	}
</script>
