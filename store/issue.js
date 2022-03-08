import { list, create, destroy, update, show, restore } from '~/api/issue-api';
import _ from 'lodash';

export const state = () => ({
  issue: {},
  issues: [],
  page: 1,
  pages: 1,
  total: 0,
});

export const mutations = {
  setIssue(s, l) {
    s.issue = l;
  },
  setIssues(s, l) {
    s.issues = l;
  },
  setEditIssues(s, { id, updated_at, updated_by }) {
    const index = _.findIndex(s.issues, ['id', id]);
    if (index > -1) {
      s.issues[index].updated_at = updated_at;
      s.issues[index].updated_by = updated_by;
    }
  },
  setDeleteIssues(s, { id }) {
    s.issues = _.filter(s.issues, o => o.id != id);
  },
  setPages(s, l) {
    s.pages = l;
  },
  setPage(s, l) {
    s.page = l;
  },
  setTotal(s, l) {
    s.total = l;
  },
};

export const actions = {
  listIssues({ commit }, { token, params }) {
    return list(token, params)
      .then(({ data: { data, meta: { current_page, last_page, total } } }) => {
        commit("setIssues", data);
        commit("setPages", last_page);
        commit("setPage", current_page);
        commit("setTotal", total);
      })
      .catch(err => console.error(err));
  },

  showIssue({ commit }, { id, token, params }) {
    return show(id, token, params)
      .then(({ data: { data } }) => commit('setIssue', data))
      .catch(err => console.error(err));
  },

  async createIssue({ commit }, { token, params, vue }) {
    vue.$set(vue, 'button_loaded', false);
    await vue.$refs.form.validate()
      .then(async success => {
        if (!success) {
          vue.alertNoty('Invalid form input!', 'error');
          vue.$set(vue, 'button_loaded', true);
          return false;
        }

        await create(token, params)
          .then(({ data: { message } }) => {
            vue.alertNoty(message);
            vue.$nextTick(() => vue.$refs.form.reset());
            setTimeout(() => window.location.href = '/admin/issue', 1000);
          })
          .catch(err => {
            if (err.response) {
              const { data: { errors, message } } = err.response;
              if (errors && errors.length) {
                vue.$refs.form.setErrors(errors);
              }
              vue.alertNoty(message, 'error');
              vue.$set(vue, 'button_loaded', true);
            }
          });
      });
  },

  async updateIssue({ commit }, { id, token, params, vue }) {
    vue.$set(vue, 'button_loaded', false);
    await vue.$refs.form.validate()
      .then(async success => {
        if (!success) {
          vue.alertNoty('Invalid form input!', 'error');
          vue.$set(vue, 'button_loaded', true);
          return false;
        }

        await update(id, token, params)
          .then(({ data: { message } }) => {
            vue.alertNoty(message);
            vue.$nextTick(() => vue.$refs.form.reset());
            setTimeout(() => window.location.href = '/admin/issue', 1000);
          })
          .catch(err => {
            if (err.response) {
              const { data: { errors, message } } = err.response;
              if (errors && errors.length) {
                vue.$refs.form.setErrors(errors);
              }
              vue.alertNoty(message, 'error');
              vue.$set(vue, 'button_loaded', true);
            }
          });
      });
  },

  destroyIssue({ commit }, { id, token, params, vue }) {
    return destroy(id, token, params)
      .then(({ data: { message } }) => {
        vue.alertNoty(message);
        commit('setDeleteIssues', { id });
      })
      .catch(err => {
        if (err.response) {
          const { data: { message } } = err.response;
          vue.alertNoty(message, 'error');
        }
      });
  },

  restoreIssue({ commit }, { id, token, params, vue }) {
    return restore(id, token, params)
      .then(({ data: { message } }) => {
        vue.alertNoty(message);
        commit('setDeleteIssues', { id });
      })
      .catch(err => {
        if (err.response) {
          const { data: { message } } = err.response;
          vue.alertNoty(message, 'error');
        }
      });
  },
};

export const getters = {
  getIssue(s) {
    return s.issue;
  },
  getIssues(s) {
    return s.issues;
  },
  getPage(s) {
    return s.page;
  },
  getPages(s) {
    return s.pages;
  },
  getTotal(s) {
    return s.total;
  },
};
