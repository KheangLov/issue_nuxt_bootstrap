import Vue from 'vue';
import moment from 'moment';
import axios from 'axios';
import Noty from 'noty';

const mixin = {
  methods: {
    alertNoty(text, type = 'success', timeout = 2000) {
      new Noty({
        text,
        type,
        timeout,
      }).show();
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
