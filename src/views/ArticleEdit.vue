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
                  placeholder="Enter tags"
                  v-model="tagInput"
                  v-on:keypress.enter.prevent="addTag(tagInput)">
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
import {
  ARTICLE_PUBLISH,
  ARTICLE_EDIT,
  FETCH_ARTICLE,
  ARTICLE_EDIT_ADD_TAG,
  ARTICLE_EDIT_REMOVE_TAG
} from '@/store/actions.type'
import {
  GET_ARTICLE
} from '@/store/getters.type'

export default {
  name: 'RwvArticleEdit',
  components: { RwvListErrors },
  props: {
    previousArticle: {
      type: Object,
      required: false
    }
  },
  async beforeRouteEnter (to, from, next) {
    // SO: https://github.com/vuejs/vue-router/issues/1034
    // If we arrive directly to this url, we need to fetch the article
    if (to.params.slug) {
      await store.dispatch(
        FETCH_ARTICLE,
        to.params.slug,
        to.params.previousArticle
      )
    }
    return next()
  },
  data () {
    return {
      article: this.$store.getters[GET_ARTICLE],
      tagInput: null,
      inProgress: false,
      errors: {}
    }
  },
  methods: {
    onPublish (slug, article) {
      let action = slug ? ARTICLE_EDIT : ARTICLE_PUBLISH
      this.inProgress = true
      this.$store
        .dispatch(action)
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
    removeTag (tag) {
      this.$store.dispatch(ARTICLE_EDIT_REMOVE_TAG, tag)
    },
    addTag (tag) {
      this.$store.dispatch(ARTICLE_EDIT_ADD_TAG, tag)
      this.tagInput = null
    }
  }
}
</script>
