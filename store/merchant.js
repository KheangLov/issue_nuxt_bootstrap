import { list, create, destroy, update, show, restore } from '~/api/merchant-api';
import _ from 'lodash';

export const state = () => ({
  merchant: {},
  merchants: [],
  page: 1,
  pages: 1,
  total: 0,
});

export const mutations = {
  setMerchant(s, l) {
    s.merchant = l;
  },
  setMerchants(s, l) {
    s.merchants = l;
  },
  setEditMerchants(s, { id, updated_at, updated_by }) {
    const index = _.findIndex(s.merchants, ['id', id]);
    if (index > -1) {
      s.merchants[index].updated_at = updated_at;
      s.merchants[index].updated_by = updated_by;
    }
  },
  setDeleteMerchants(s, { id }) {
    s.merchants = _.filter(s.merchants, o => o.id != id);
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
  listMerchants({ commit }, { token, params }) {
    return list(token, params)
      .then(({ data: { data, meta: { current_page, last_page, total } } }) => {
        commit("setMerchants", data);
        commit("setPages", last_page);
        commit("setPage", current_page);
        commit("setTotal", total);
      })
      .catch(err => console.error(err));
  },

  showMerchant({ commit }, { id, token, params }) {
    return show(id, token, params)
      .then(({ data: { data } }) => commit('setMerchant', data))
      .catch(err => console.error(err));
  },

  async createMerchant({ commit }, { token, params, vue }) {
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
            setTimeout(() => window.location.href = '/admin/merchant', 1000);
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

  async updateMerchant({ commit }, { id, token, params, vue }) {
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
            setTimeout(() => window.location.href = '/admin/merchant', 1000);
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

  destroyMerchant({ commit }, { id, token, params, vue }) {
    return destroy(id, token, params)
      .then(({ data: { message } }) => {
        vue.alertNoty(message);
        commit('setDeleteMerchants', { id });
      })
      .catch(err => {
        if (err.response) {
          const { data: { message } } = err.response;
          vue.alertNoty(message, 'error');
        }
      });
  },

  restoreMerchant({ commit }, { id, token, params, vue }) {
    return restore(id, token, params)
      .then(({ data: { message } }) => {
        vue.alertNoty(message);
        commit('setDeleteMerchants', { id });
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
  getMerchant(s) {
    return s.merchant;
  },
  getMerchants(s) {
    return s.merchants;
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
