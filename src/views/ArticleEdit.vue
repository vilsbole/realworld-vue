<template>
  <div class="editor-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-10 offset-md-1 col-xs-12">
          <form v-on:submit="onPublish(article.slug, article)">
            <fieldset>
              <fieldset class="form-group">
                <input
                  type="text"
                  class="form-control form-control-lg"
                  v-model="article.title"
                  placeholder="Article Title">
              </fieldset>
              <fieldset class="form-group">
                <input
                  type="text"
                  class="form-control"
                  v-model="article.description"
                  placeholder="What's this article about?">
              </fieldset>
              <fieldset class="form-group">
                <textarea
                  class="form-control"
                  rows="8"
                  v-model="article.body"
                  placeholder="Write your article (in markdown)">
                </textarea>
              </fieldset>
              <fieldset class="form-group">
                <input
                  type="text"
                  class="form-control"
                  v-model="article.tagList"
                  placeholder="Enter tags">
                <div class="tag-list"></div>
              </fieldset>
            </fieldset>
            <button
              class="btn btn-lg pull-xs-right btn-primary"
              type="submit">
              Publish Article
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import store from '@/store'
import { ARTICLE_PUBLISH, ARTICLE_EDIT, FETCH_ARTICLE } from '@/store/actions.type'

export default {
  name: 'RwvArticleEdit',
  beforeRouteEnter (to, from, next) {
    // SO: https://github.com/vuejs/vue-router/issues/1034
    // If we arrive directly to this url, the prop is not set.
    // So we fetch the article, then set the compoents data attribute.
    if (!to.params.previousArticle && to.params.slug) {
      return store
      .dispatch(FETCH_ARTICLE, to.params.slug)
      .then((res) => { return next(vm => vm.setData(res.article)) })
    } else {
      return next()
    }
  },
  props: {
    previousArticle: {
      type: Object,
      required: false,
      default: () => {
        return {
          title: '',
          description: '',
          body: '',
          tagList: []
        }
      }
    }
  },
  data () {
    return {
      article: this.previousArticle
    }
  },
  methods: {
    onPublish (slug, article) {
      let action, payload
      if (!slug) {
        action = ARTICLE_PUBLISH
        payload = article
      } else {
        action = ARTICLE_EDIT
        payload = { slug, article }
      }
      this.$store.dispatch(action, payload)
        .then(({ data }) => {
          this.$router.push({
            name: 'article',
            params: { slug: data.article.slug }
          })
        })
    },

    setData (article) {
      this.article = article
    }
  }
}
</script>
