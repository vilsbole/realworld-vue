import { ArticlesService, CommentsService, FavoriteService } from '@/common/api.service'
import {
  FETCH_ARTICLE,
  FETCH_COMMENTS,
  COMMENT_CREATE,
  COMMENT_DESTROY,
  FAVORITE_ADD,
  FAVORITE_REMOVE,
  ARTICLE_PUBLISH,
  ARTICLE_EDIT,
  ARTICLE_EDIT_ADD_TAG,
  ARTICLE_EDIT_REMOVE_TAG,
  ARTICLE_DELETE } from './actions.type'
import {
  SET_ARTICLE,
  SET_COMMENTS,
  TAG_ADD,
  TAG_REMOVE,
  UPDATE_ARTICLE_IN_LIST } from './mutations.type'

export const state = {
  article: {},
  comments: []
}

export const actions = {
  [FETCH_ARTICLE] (context, articleSlug) {
    return ArticlesService.get(articleSlug)
      .then(({ data }) => {
        context.commit(SET_ARTICLE, data.article)
        return data
      })
  },
  [FETCH_COMMENTS] (context, articleSlug) {
    return CommentsService.get(articleSlug)
      .then(({ data }) => {
        context.commit(SET_COMMENTS, data.comments)
      })
  },
  [COMMENT_CREATE] (context, payload) {
    return CommentsService
      .post(payload.slug, payload.comment)
      .then(() => { context.dispatch(FETCH_COMMENTS, payload.slug) })
  },
  [COMMENT_DESTROY] (context, payload) {
    return CommentsService
      .destroy(payload.slug, payload.commentId)
      .then(() => {
        context.dispatch(FETCH_COMMENTS, payload.slug)
      })
  },
  [FAVORITE_ADD] (context, payload) {
    return FavoriteService
      .add(payload)
      .then(({ data }) => {
        // Update list as well. This allows us to favorite an article in the Home view.
        context.commit(
          UPDATE_ARTICLE_IN_LIST,
          data.article,
          { root: true }
        )
        context.commit(SET_ARTICLE, data.article)
      })
  },
  [FAVORITE_REMOVE] (context, payload) {
    return FavoriteService
      .remove(payload)
      .then(({ data }) => {
        // Update list as well. This allows us to favorite an article in the Home view.
        context.commit(
          UPDATE_ARTICLE_IN_LIST,
          data.article,
          { root: true }
        )
        context.commit(SET_ARTICLE, data.article)
      })
  },
  [ARTICLE_PUBLISH] (context, payload) {
    return ArticlesService.create(payload)
  },
  [ARTICLE_DELETE] (context, slug) {
    return ArticlesService.destroy(slug)
  },
  [ARTICLE_EDIT] (context, { slug, article }) {
    return ArticlesService.update(slug, article)
  },
  [ARTICLE_EDIT_ADD_TAG] (context, tag) {
    context.commit(TAG_ADD, tag)
  },
  [ARTICLE_EDIT_REMOVE_TAG] (context, tag) {
    context.commit(TAG_REMOVE, tag)
  }
}

/* eslint no-param-reassign: ["error", { "props": false }] */
export const mutations = {
  [SET_ARTICLE] (state, article) {
    state.article = article
  },
  [SET_COMMENTS] (state, comments) {
    state.comments = comments
  },
  [TAG_ADD] (state, tag) {
    state.article.tagList = state.article.tagList.concat([tag])
  },
  [TAG_REMOVE] (state, tag) {
    state.article.tagList = state.article.tagList.filter(t => t !== tag)
  }
}

export default {
  state,
  actions,
  mutations
}
