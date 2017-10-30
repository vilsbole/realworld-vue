<template>
  <!-- Used when user is also author -->
  <span v-if="canModify">
    <button
      class="btn btn-sm btn-outline-secondary"
      v-on:click="editArticle(article.slug, article)">
      <i class="ion-edit"></i> &nbsp;Edit Article
    </button>
    &nbsp;&nbsp;
    <button
      class="btn btn-outline-danger btn-sm"
      v-on:click="deleteArticle(article.slug)">
      <i class="ion-trash-a"></i>&nbsp;Delete Article
    </button>
  </span>
  <!-- Used in ArticleView when not author -->
  <span v-else>
    <button
      class="btn btn-sm btn-outline-secondary">
      <i class="ion-plus-round"></i>
      &nbsp;
      Follow {{article.author.username}} <span class="counter">(10)</span>
    </button>
    &nbsp;&nbsp;
    <button
      class="btn btn-sm"
      v-on:click="toggleFavorite(article.slug)"
      :class="{
        'btn-primary': article.favorited,
        'btn-outline-primary': !article.favorited
      }">
      <i class="ion-heart"></i>&nbsp;
      {{
        article.favorited
        ? 'Unfavorite Article'
        : 'Favorite Article'
      }}
      <span class="counter">
        ({{article.favoritesCount}})
      </span>
    </button>
  </span>
</template>

<script>
import { FAVORITE_ADD, FAVORITE_REMOVE, ARTICLE_DELETE } from '@/store/actions.type'

export default {
  name: 'RwvArticleActions',
  props: {
    article: { type: Object, required: true }
  },
  methods: {
    toggleFavorite (slug) {
      const action = this.article.favorited
        ? FAVORITE_REMOVE
        : FAVORITE_ADD
      this.$store.dispatch(action, slug)
    },
    editArticle (slug, article) {
      this.$router.push({
        name: 'article-edit',
        params: { slug, previousArticle: article }
      })
    },
    deleteArticle (slug) {
      this.$store
        .dispatch(ARTICLE_DELETE, slug)
        .then((res) => {
          this.$router.push('/')
        })
    }
  },
  computed: {
    canModify () {
      return this.$store.state.auth.user.username === this.article.author.username
    }
  }
}
</script>
