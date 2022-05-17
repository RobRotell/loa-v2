<template>
	<div 
		@click="handleDropdownClick"
		:class="{ 'filter-dropdown--active' : dropdownIsOpen }"
		class="filter-dropdown"
	>
		<div class="filter-dropdown__selected">
			{{ activeFilter }}
		</div>

		<button 
			:class="{ 'filter-dropdown__chevron--active' : dropdownIsOpen }"
			class="filter-dropdown__chevron"
		>
			<svg enable-background="new 0 0 407.437 407.437" version="1.1" viewBox="0 0 407.437 407.437" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"><polygon points="386.26 91.567 203.72 273.51 21.179 91.567 0 112.82 203.72 315.87 407.44 112.82"/></svg>
		</button>

		<ul 
			:class="{ 'filter-dropdown__options--active' : dropdownIsOpen }"
			class="filter-dropdown__options"
		>
			<li 
				@click="handleOptionClick( tag )"
				v-for="[ key, tag ] in tags"
				:key="key"
				:class="{ 'filter-dropdown__option--active' : tagIsActive( key ) }"
				class="filter-dropdown__option"
			>
				{{ tag.name }}
			</li>
		</ul>
	</div>
</template>


<style lang="scss">
	.filter-dropdown {
		position: relative;
		display: flex;
		align-items: center;
		padding: remCalc( 16 );
		background-color: $grayUltraLight;
		z-index: 10;
		cursor: pointer;

		&__selected {
			flex-grow: 1;
		}

		&__chevron {
			position: relative;
			display: block;
			width: remCalc( 18 );
			height: remCalc( 18 );
			margin-left: remCalc( 24 );
			background-color: transparent;

			& svg {
				fill: $grayText;
			}
		}

		&__options {
			position: absolute;
			top: 100%;
			left: 0;
			display: none;
			width: 100%;
			max-height: remCalc( 320 );
			margin: 0;
			padding: 0;
			background-color: $grayLight;
			overflow-y: scroll;
			transform: translate3d( 0, remCalc( 6 ), 0 );

			&--active {
				display: block;
			}
		}

		&__option {
			padding: remCalc( 12 ) remCalc( 18 ) remCalc( 12 ) remCalc( 16 );
			list-style-type: none;

			&--active {
				color: #fff;
				background-color: $purple;
			}
		}
	}
</style>


<script>
	export default {
		name: 'Filter',

		props: {
			tags: {
				type: Map,
				required: true,
			}
		},


		data() {
			return {
				activeTags: new Map(),
				dropdownIsOpen: false,
				isOutsideListening: null,
			}
		},


		computed: {
			activeFilter() {
				let activeTagNames = []

				this.activeTags.forEach( tag => {
					activeTagNames.push( tag.name )
				})

				activeTagNames.sort( ( a, b ) => {
					return a.toLowerCase() > b.toLowerCase()
				})

				if( activeTagNames.length ) {
					return activeTagNames.join( ', ' )
				} else {
					return 'Select tags to filter ...'
				}
			}

		},


		methods: {
			handleDropdownClick( e ) {
				const target = e.target

				// if clicking parent dropdown or chevron, change dropdown state
				if( e.currentTarget === this.$el || target.classList.contains( 'filter-dropdown__chevron' ) ) {
					this.toggleDropdown()

				// otherwise, assume clicking dropdown option
				} else {
					this.handleTagClick( target )
				}
			},

			toggleDropdown() {

				// show/hide dropdown
				this.dropdownIsOpen = !this.dropdownIsOpen

				this.maybeAddOutsideClickListener()
			},

			maybeAddOutsideClickListener() {
				if( !this.isOutsideListening ) {
					document.addEventListner( 'click', this.handleOutsideClick )
				}
			},

			handleOutsideClick( e ) {
				this.isOutsideListening = true

				if( !this.$el.contains( e.target ) ) {
					this.dropdownIsOpen = false

					document.removeEventListener( 'click', this.handleOutsideClick )

					this.isOutsideListening = false
				}
			},

			maybeCloseDropdown() {
				const listener = document.addEventListener( 'click', e => {

					// check if element is within dropdown. If outside of dropdown, close dropdown
					console.log( e.target )
					console.log( this.$el.contains( e.target ) )

					if( !this.$el.contains( e.target ) ) {
						this.dropdownIsOpen = false

						document.removeEventListener( listener )
					}
				})
			},

			handleOptionClick( targetTag ) {
				if( this.activeTags.has( targetTag.id ) ) {
					this.activeTags.delete( targetTag.id )
				} else {
					this.activeTags.set( targetTag.id, targetTag )
				}
			},

			tagIsActive( tagId ) {
				return this.activeTags.has( tagId )
			}			
		},

	}
</script>
