<template>
  <fragment>
    <ValidationObserver ref="form">
      <b-form @submit.prevent="handleSubmit">
        <b-row>
          <b-col md="6">
            <b-form-group
              id="input-group-name"
              label="Name"
              label-for="input-name"
            >
              <ValidationProvider
                v-slot="{ errors }"
                name="name"
                type="text"
                rules="required"
              >
                <b-form-input
                  id="input-name"
                  v-model="form.name"
                  type="text"
                  required
                  placeholder="Enter name"
                  :class="errors.length ? 'border-danger' : ''"
                >
                </b-form-input>
                <span v-if="errors.length" class="text-danger">
                  {{ errors[0] }}
                </span>
              </ValidationProvider>
            </b-form-group>
          </b-col>

          <b-col md="6">
            <b-form-group
              id="input-group-merchant"
              label="Merchant"
              label-for="input-merchant"
            >
              <ValidationProvider
                v-slot="{ errors }"
                name="merchant_id"
                type="text"
                rules="required"
              >
                <Select2
                  id="input-group-merchant-select2"
                  v-model="form.merchant_id"
                  :options="opt_merchants"
                  :settings="select2_setting_merchant"
                />
                <span v-if="errors.length" class="text-danger">
                  {{ errors[0] }}
                </span>
              </ValidationProvider>
            </b-form-group>
          </b-col>

          <b-col md="4">
            <b-form-group
              id="input-group-issue-type"
              label="Issue Type"
              label-for="input-issue-type"
            >
              <ValidationProvider
                v-slot="{ errors }"
                name="issue_type"
                type="text"
                rules="required"
              >
                <Select2
                  id="input-group-issue-type-select2"
                  v-model="form.issue_type"
                  :options="opt_issued_type"
                  :settings="select2_setting_share"
                />
                <span v-if="errors.length" class="text-danger">
                  {{ errors[0] }}
                </span>
              </ValidationProvider>
            </b-form-group>
          </b-col>

          <b-col md="4">
            <b-form-group
              id="input-group-status"
              label="Issued Type"
              label-for="input-status"
            >
              <ValidationProvider
                v-slot="{ errors }"
                name="status"
                type="text"
                rules="required"
              >
                <Select2
                  id="input-group-status-select2"
                  v-model="form.status"
                  :options="opt_status"
                  :settings="select2_setting_share"
                />
                <span v-if="errors.length" class="text-danger">
                  {{ errors[0] }}
                </span>
              </ValidationProvider>
            </b-form-group>
          </b-col>

          <b-col md="4">
            <b-form-group
              id="input-group-api-type"
              label="Issued Type"
              label-for="input-api-type"
            >
              <ValidationProvider
                v-slot="{ errors }"
                name="api_type"
                type="text"
                rules="required"
              >
                <Select2
                  id="input-group-api-type-select2"
                  v-model="form.api_type"
                  :options="opt_api_types"
                  :settings="select2_setting_share"
                />
                <span v-if="errors.length" class="text-danger">
                  {{ errors[0] }}
                </span>
              </ValidationProvider>
            </b-form-group>
          </b-col>

          <b-col md="6">
            <b-form-group
              id="input-group-issued-at"
              label="Issued At"
              label-for="input-issued-at"
            >
              <ValidationProvider
                v-slot="{ errors }"
                name="issued_at"
                type="text"
              >
                <b-row>
                  <b-col md="7">
                    <b-form-datepicker
                      id="input-issued-at"
                      v-model="issued_date"
                      class="mb-2"
                      today-button
                      reset-button
                      close-button
                    >
                    </b-form-datepicker>
                  </b-col>
                  <b-col md="5">
                    <b-form-timepicker
                      v-model="issued_time"
                      now-button
                      reset-button
                    >
                    </b-form-timepicker>
                  </b-col>
                </b-row>
                <span v-if="errors.length" class="text-danger">
                  {{ errors[0] }}
                </span>
              </ValidationProvider>
            </b-form-group>
          </b-col>

          <b-col md="6">
            <b-form-group
              id="input-group-resolved-at"
              label="Resolved At"
              label-for="input-resolved-at"
            >
              <ValidationProvider
                v-slot="{ errors }"
                name="resolved_at"
                type="text"
              >
                <b-row>
                  <b-col md="7">
                    <b-form-datepicker
                      id="input-resolved-at"
                      v-model="resolved_date"
                      class="mb-2"
                      today-button
                      reset-button
                      close-button
                    >
                    </b-form-datepicker>
                  </b-col>
                  <b-col md="5">
                    <b-form-timepicker
                      v-model="resolved_time"
                      now-button
                      reset-button
                    >
                    </b-form-timepicker>
                  </b-col>
                </b-row>
                <span v-if="errors.length" class="text-danger">
                  {{ errors[0] }}
                </span>
              </ValidationProvider>
            </b-form-group>
          </b-col>

          <b-col md="12">
            <b-form-group
              id="input-group-resolution"
              label="Resolution"
              label-for="input-resolution"
            >
              <ValidationProvider
                v-slot="{ errors }"
                name="resolution"
                type="text"
              >
                <b-form-textarea
                  id="input-resolution"
                  v-model="form.resolution"
                  type="text"
                  placeholder="Enter resolution"
                  :class="errors.length ? 'border-danger' : ''"
                >
                </b-form-textarea>
                <span v-if="errors.length" class="text-danger">
                  {{ errors[0] }}
                </span>
              </ValidationProvider>
            </b-form-group>
          </b-col>

          <b-col md="12">
            <b-form-group
              id="input-group-description"
              label="Description"
              label-for="input-description"
            >
              <ValidationProvider
                v-slot="{ errors }"
                name="description"
                type="text"
              >
                <ckeditor-nuxt v-model="form.description" :config="editor_config" />
                <span v-if="errors.length" class="text-danger">
                  {{ errors[0] }}
                </span>
              </ValidationProvider>
            </b-form-group>
          </b-col>
        </b-row>

        <div class="text-left">
          <b-button type="submit" variant="outline-primary" :disabled="!button_loaded" class="mr-2">
            <b-icon
              icon="arrow-right-square"
              aria-hidden="true"
            >
            </b-icon>
            Submit
          </b-button>
          <b-link href="/admin/issue" class="btn btn-outline-danger">
            <b-icon
              icon="x-circle"
              aria-hidden="true"
            >
            </b-icon>
            Cancel
          </b-link>
        </div>
      </b-form>
    </ValidationObserver>
  </fragment>
</template>

<script>
import _ from 'lodash';
import { mapGetters, mapActions } from 'vuex';
import { Fragment } from 'vue-fragment';
import { ValidationObserver, ValidationProvider } from "vee-validate";
import Select2 from 'v-select2-component';
import CkeditorNuxt from '@blowstack/ckeditor-nuxt';

export default {
  middleware: 'auth',
  components: {
    Fragment,
    ValidationObserver,
    ValidationProvider,
    Select2,
    CkeditorNuxt,
  },
  watch: {
    resolved_date() {
      this.form.resolved_at = this.resolved_at;
    },
    resolved_time() {
      this.form.resolved_at = this.resolved_at;
    },
    issued_date() {
      this.form.issued_at = this.issued_at;
    },
    issued_time() {
      this.form.issued_at = this.issued_at;
    }
  },
  computed: {
    ...mapGetters({
      loggedInUser: 'loggedInUser',
      getIssue: 'issue/getIssue',
    }),
    opt_merchants: {
      get() {
        return this.$store.state.merchant.getSelect2Merchants;
      },
      set(val) {
        this.$store.commit('merchant/setSelect2Merchants', val);
      }
    },
    resolved_at() {
      let { resolved_date, resolved_time } = this;
      if (!resolved_date) {
        return '';
      }

      if (!resolved_time) {
        resolved_time = '00:00:00';
      }

      return `${resolved_date} ${resolved_time}`;
    },
    issued_at() {
      let { issued_date, issued_time } = this;
      if (!issued_date) {
        return '';
      }

      if (!issued_time) {
        issued_time = '00:00:00';
      }

      return `${issued_date} ${issued_time}`;
    },
  },
  async created() {
    await this.showIssue({ id: this.id, token: this.access_token });
    let issued_obj = { ...this.getIssue };
    const { id, name: text } = issued_obj.merchant;
    this.opt_merchants = [{id, text}];
    Object.keys(issued_obj).forEach(key => {
      if (key.includes('_at') && issued_obj[key] === 'N/A') {
        issued_obj[key] = '';
      }
    })
    this.$set(this, 'form', { ..._.omit(issued_obj, [
      'id',
      'merchant',
      'created_by',
      'created_at',
      'updated_by',
      'updated_at',
      'deleted_by',
      'deleted_at',
    ]) });
    this.form.merchant_id = this.getIssue.merchant.id;
    $('#input-group-merchant-select2').append(`<option value="${id}" selected="selected">${text}</option>`);
  },
  async asyncData({ params: { id }, app }) {
    const url = 'https://issue-app-api.herokuapp.com/api/v1';
    const select2_setting_share = {
      placeholder: 'Select',
      allowClear: true,
      width: 'resolve',
    };

    return {
      id,
      access_token: app.$auth.getToken('local'),
      form: {},
      button_loaded: true,
      redirect_url: '/admin/issue',
      select2_setting_share,
      resolved_date: '',
      resolved_time: '',
      issued_date: '',
      issued_time: '',
      select2_setting_merchant: {
        ...select2_setting_share,
        ajax: {
          headers: {
            "Accept": "application/json",
            "Content-Type" : "application/json",
          },
          url: `${url}/ajax/merchants`,
          data: ({ term, page }) => {
            return {
              search: term,
              page: page || 1
            };
          },
          processResults: ({ data, meta: { total } }, { page }) => {
            return {
              results: data,
              pagination: {
                more: (page * 10) < total
              }
            };
          }
        }
      },
      opt_issued_type: [
        {
          id: 'bug',
          text: 'Bug',
        },
        {
          id: 'improvement',
          text: 'Improvement'
        },
      ],
      opt_status: [
        {
          id: 'issued',
          text: 'Issued',
        },
        {
          id: 'resolved',
          text: 'Resolved'
        },
      ],
      opt_api_types: [
        {
          id: 'sandbox',
          text: 'Sandbox',
        },
        {
          id: 'production',
          text: 'Production'
        },
      ],
      editor_config: {
        simpleUpload: {
          uploadUrl: `${url}/upload/ckeditor`,
        }
      },
    };
  },
  methods: {
    ...mapActions({
      updateIssue: 'issue/updateIssue',
      showIssue: 'issue/showIssue',
    }),
    handleSubmit() {
      this.updateIssue({ id: this.id, token: this.access_token, params: this.form, vue: this });
    },
  },
}
</script>
