import { list, create, destroy, update, show, disable, restore } from '~/api/user-api';
import _ from 'lodash';

export const state = () => ({
  user: {},
  users: [],
  page: 1,
  pages: 1,
  total: 0,
});

export const mutations = {
  setUser(s, l) {
    s.user = l;
  },
  setUsers(s, l) {
    s.users = l;
  },
  setEditUsers(s, { id, is_disabled, updated_at, updated_by }) {
    const index = _.findIndex(s.users, ['id', id]);
    if (index > -1) {
      s.users[index].is_disabled = is_disabled;
      s.users[index].updated_at = updated_at;
      s.users[index].updated_by = updated_by;
    }
  },
  setDeleteUsers(s, { id }) {
    s.users = _.filter(s.users, o => o.id != id);
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
  listUsers({ commit }, { token, params }) {
    return list(token, params)
      .then(({ data: { data, meta: { current_page, last_page, total } } }) => {
        commit("setUsers", data);
        commit("setPages", last_page);
        commit("setPage", current_page);
        commit("setTotal", total);
      })
      .catch(err => console.error(err));
  },

  showUser({ commit }, { id, token, params }) {
    return show(id, token, params)
      .then(({ data: { data } }) => commit('setUser', data))
      .catch(err => console.error(err));
  },

  async createUser({ commit }, { token, params, vue }) {
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
            setTimeout(() => window.location.href = '/admin/user', 1000);
          })
          .catch(err => {
            if (err.response) {
              vue.handleErrorMessage(vue, err.response);
            }
          });
      });
  },

  disabledUser({ commit }, { id, token, vue }) {
    return disable(id, token)
      .then(({ data: { message, data } }) => {
        vue.alertNoty(message);
        commit('setEditUsers', data);
      })
      .catch(err => {
        if (err.response) {
          const { data: { message } } = err.response;
          vue.alertNoty(message, 'error');
        }
      });
  },

  async updateUser({ commit }, { id, token, params, vue }) {
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
            setTimeout(() => window.location.href = '/admin/user', 1000);
          })
          .catch(err => {
            if (err.response) {
              vue.handleErrorMessage(vue, err.response);
            }
          });
      });
  },

  destroyUser({ commit }, { id, token, params, vue }) {
    return destroy(id, token, params)
      .then(({ data: { message } }) => {
        vue.alertNoty(message);
        commit('setDeleteUsers', { id });
      })
      .catch(err => {
        if (err.response) {
          const { data: { message } } = err.response;
          vue.alertNoty(message, 'error');
        }
      });
  },

  restoreUser({ commit }, { id, token, params, vue }) {
    return restore(id, token, params)
      .then(({ data: { message } }) => {
        vue.alertNoty(message);
        commit('setDeleteUsers', { id });
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
  getUser(s) {
    return s.user;
  },
  getUsers(s) {
    return s.users;
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
