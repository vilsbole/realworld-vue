<template>
  <div class="editor-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-10 offset-md-1 col-xs-12">
          <rwv-list-errors
            :errors="errors">
          </rwv-list-errors>
          <form v-on:submit="onPublish(article.slug, article)">
            <fieldset :disabled="inProgress">
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
                  v-model="tagInput"
                  placeholder="Enter tags">
                <div class="tag-list">
                  <span
                  class="tag-default tag-pill"
                  v-for="(tag, index) of article.tagList"
                  :key="tag + index">
                  <i
                  class="ion-close-round"
                  v-on:click="removeTag(tag)">
                </i>
                {{ tag }}
              </span>
            </div>
              </fieldset>
            </fieldset>
            <button
              :disabled="inProgress"
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
import RwvListErrors from '@/components/ListErrors'
import { ARTICLE_PUBLISH, ARTICLE_EDIT, FETCH_ARTICLE } from '@/store/actions.type'

export default {
  name: 'RwvArticleEdit',
  components: { RwvListErrors },
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
  data () {
    return {
      article: this.previousArticle,
      tagInput: '',
      inProgress: false,
      errors: {}
    }
  },
  methods: {
    onPublish (slug, article) {
      let action, payload
      this.inProgress = true
      if (!slug) {
        action = ARTICLE_PUBLISH
        payload = article
      } else {
        action = ARTICLE_EDIT
        payload = { slug, article }
      }
      this.$store.dispatch(action, payload)
        .then(({ data }) => {
          this.inProgress = false
          this.$router.push({
            name: 'article',
            params: { slug: data.article.slug }
          })
        })
        .catch(({ response }) => {
          this.errors = response.data.errors
          this.inProgress = false
        })
    },
    setData (article) {
      this.article = article
    },
    removeTag (tag) {
      console.log('removeing')
    }
  }
}
</script>
