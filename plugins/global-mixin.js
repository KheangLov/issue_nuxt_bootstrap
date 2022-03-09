import Vue from 'vue';
import moment from 'moment';
import Noty from 'noty';
import pluralize from 'pluralize';
import _ from 'lodash';

const mixin = {
  methods: {
    alertNoty(text, type = 'success', timeout = 2000) {
      new Noty({
        text,
        type,
        timeout,
      }).show();
    },
    pluralizeAndCapitalize(text, plu = true, cap = true) {
      if (!text) {
        return text;
      }
      if (plu) {
        text = pluralize(text);
      }
      if (cap) {
        text = _.capitalize(text);
      }
      return text;
    },
    deletePopup(vue, text = 'Do you really want to delete this record?') {
      const dialog = new Noty({
        text,
        type: 'error',
        buttons: [
          Noty.button('YES', 'btn btn-secondary', async () => {
            await vue.destroy({
              id: vue.req_id,
              token: vue.access_token,
              params: { force_delete: vue.req_force_delete },
              vue
            });
            dialog.close();
          }, { id: 'button1', 'data-status': 'ok' }),
          Noty.button('NO', 'btn btn-link text-white text-decoration-none', () => dialog.close())
        ]
      });
      dialog.show();
    },
    readFileBase64(reader, file, field = '', form_field = '') {
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (field) {
          this.$set(this, field, reader.result);
        }
        if (form_field) {
          this.$set(this.form, form_field, reader.result);
        }
      };
      reader.onerror = error => {
        console.log('Error: ', error);
      };
    },
    handleErrorMessage(vue, err) {
      const { data: { errors, message } } = err;
      if (errors && Object.keys(errors).length) {
        vue.$refs.form.setErrors(errors);
      }
      vue.alertNoty(message, 'error');
      vue.$set(vue, 'button_loaded', true);
    },
    paddString(str, len = 6, prefix = '0') {
      return str.toString().padStart(len, prefix);
    },
    formatNumber(val, option = {}) {
      if (val == 'N/A') {
        return val;
      }
      return new Intl.NumberFormat('en-US', option).format(val);
    },
    formatDatetime(val) {
      if (val == 'N/A') {
        return val;
      }
      return moment(moment.utc(val)).local().format("dddd, MMMM Do YYYY, h:mm:ss A");
    },
  }
};

Vue.mixin(mixin);
