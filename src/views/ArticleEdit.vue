<template>
  <div class="editor-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-10 offset-md-1 col-xs-12">
          <form v-on:submit="onPublish({}, article)">
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
import { ARTICLE_PUBLISH } from '@/store/actions.type'

export default {
  name: 'RwvArticleEdit',
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
      this.$store.dispatch(ARTICLE_PUBLISH, article)
    }
  }
}
</script>
