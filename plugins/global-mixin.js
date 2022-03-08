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
      return new Intl.NumberFormat('en-US', option).format(val);
    },
    formatDatetime(val) {
      return moment(moment.utc(val)).local().format("dddd, MMMM Do YYYY, h:mm:ss A");
    },
    getAddressByLatLng(lat, lng) {
      axios.get(`${process.env.Z1_DATA_URL ? process.env.Z1_DATA_URL : 'https://mapapi.zillennium.com/'}v1/communes?lat=${lat}&lng=${lng}`)
        .then(({ data: { data: { commune_code } } }) => {
          this.$set(this, 'city', commune_code.substring(0, 2));
          this.$set(this, 'district', commune_code.substring(0, 4));
          this.$set(this, 'commune', commune_code.substring(0, 6));
          this.setAddressCode(commune_code);
        })
        .catch(err => {
          console.log(err);
          new Noty({
              text: 'Can not get data!',
              type: 'error'
          }).show();
        });
    },
    getLatLngByAnyLevel(code) {
      axios.get(`${process.env.Z1_DATA_URL ? process.env.Z1_DATA_URL : 'https://mapapi.zillennium.com/'}v1/administrations/${code}?boundary=true`)
        .then(async response => {
            const {
              data: {
                data: {
                  center: {
                    geometry: {
                      coordinates
                    }
                  },
                }
              }
            } = response;

            if (this.marker) {
              this.marker.setMap(null);
            }
            this.marker = new google.maps.Marker({
              position: { lat: coordinates[1], lng: coordinates[0] },
              map: this.$refs.gMap.map,
            });
            this.$refs.gMap.map.setCenter(this.marker.position);
            this.$set(this.form, 'latitude', coordinates[1]);
            this.$set(this.form, 'longitude', coordinates[0]);
        })
        .catch(err => {
          console.log(err);
          new Noty({
            text: 'Can not get data!',
            type: 'error'
          }).show();
        });
    },
    getAddress(code = '') {
      const vm = this;
      let url = `${process.env.API_URL ? process.env.API_URL : 'https://fastapi-kheanglov.cloud.okteto.net'}/kh_address`;
      if (code) {
        url += `?code=${code}`;
      }
      axios.get(url)
        .then(res => {
          let key = '';

          if (!code) {
            key = 'cities';
          } else if (code.length === 2) {
            key = 'districts';
          } else if (code.length === 4) {
            key = 'communes';
          } else if (code.length === 6) {
            key = 'villages';
          }

          if (!key.length) {
            return false;
          }

          vm.$set(vm, key, res.data.map(({ code: c, name_en }) => ({ value: c, text: name_en })));
        });
    }
  }
};

Vue.mixin(mixin);
