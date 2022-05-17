<template>
	<section 
		:class="{ 'articles--is-loading' : is_loading }"
		class="articles"
	>
		<Article
			@update_article="handleUpdateArticle"
			v-for="[ key, article ] in articles"
			:key="key"
			:id="article.id"
			:title="article.title"
			:url="article.url"
			:tags="article.tags"
			:is_favorite="article.is_favorite"
			:is_read="article.is_read"
		/>
		<LoadMore 
			:is_loading="is_loading"
			:is_active="!!articles.length"
			@hit_bottom="handleReachedBottom"
		/>
	</section>
</template>


<style lang="scss">
	.articles {
		overflow-anchor: none;
	}

</style>


<script>
	import Article from './Article.vue'
	import LoadMore from './LoadMore.vue'


	export default {
		name: 'ArticleList',
		components: {
			Article,
			LoadMore
		},


		props: {
			articles: {
				type: Map,
				required: true,
			},

			is_loading: {
				type: Boolean,
				required: true,
			}
		},


		methods: {
			handleUpdateArticle( articleId, attr, newStatus, oldStatus ) {
				this.$emit( 'update_article', articleId, attr, newStatus, oldStatus )
			},

			handleReachedBottom() {
				this.$emit( 'fetch_next_page' )
			}
		},

	}

</script>