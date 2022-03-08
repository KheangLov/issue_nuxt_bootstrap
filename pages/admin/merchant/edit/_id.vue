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
              id="input-group-branch"
              label="Branch"
              label-for="input-branch"
            >
              <ValidationProvider
                v-slot="{ errors }"
                name="branch"
                type="text"
              >
                <b-form-input
                  id="input-branch"
                  v-model="form.branch"
                  type="text"
                  placeholder="Enter branch"
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
              id="input-group-email"
              label="Email"
              label-for="input-email"
            >
              <ValidationProvider
                v-slot="{ errors }"
                name="email"
                type="email"
                rules="email"
              >
                <b-form-input
                  id="input-email"
                  v-model="form.email"
                  type="email"
                  placeholder="Enter email"
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
              id="input-group-phone"
              label="Phone"
              label-for="input-phone"
            >
              <ValidationProvider
                v-slot="{ errors }"
                name="phone"
                type="text"
              >
                <b-form-input
                  id="input-phone"
                  v-model="form.phone"
                  type="text"
                  placeholder="Enter phone"
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
              id="input-group-website"
              label="Website"
              label-for="input-website"
            >
              <ValidationProvider
                v-slot="{ errors }"
                name="website"
                type="text"
              >
                <b-form-input
                  id="input-website"
                  v-model="form.website"
                  type="text"
                  placeholder="Enter website"
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
              id="input-group-app"
              label="App"
              label-for="input-app"
            >
              <ValidationProvider
                v-slot="{ errors }"
                name="app"
                type="text"
              >
                <b-form-input
                  id="input-app"
                  v-model="form.app"
                  type="text"
                  placeholder="Enter app"
                  :class="errors.length ? 'border-danger' : ''"
                >
                </b-form-input>
                <span v-if="errors.length" class="text-danger">
                  {{ errors[0] }}
                </span>
              </ValidationProvider>
            </b-form-group>
          </b-col>

          <b-col>
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
                <b-form-textarea
                  id="input-description"
                  v-model="form.description"
                  type="text"
                  placeholder="Enter description"
                  :class="errors.length ? 'border-danger' : ''"
                >
                </b-form-textarea>
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
          <b-link href="/admin/merchant" class="btn btn-outline-danger">
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
import { mapGetters, mapActions } from 'vuex';
import { Fragment } from 'vue-fragment';
import _ from 'lodash';
import { ValidationObserver, ValidationProvider } from "vee-validate";

export default {
  middleware: 'auth',
  components: {
    Fragment,
    ValidationObserver,
    ValidationProvider
  },
  computed: {
    ...mapGetters({
      loggedInUser: 'loggedInUser',
      getMerchant: 'merchant/getMerchant',
    })
  },
  async created() {
    await this.showMerchant({ id: this.id, token: this.access_token });
    this.$set(this, 'form', { ..._.omit(this.getMerchant, [
      'id',
      'created_by',
      'created_at',
      'updated_by',
      'updated_at',
      'deleted_by',
      'deleted_at',
    ]) });
  },
  async asyncData({ params: { id }, app }) {
    return {
      id,
      access_token: app.$auth.getToken('local'),
      form: {},
      button_loaded: true,
    };
  },
  methods: {
    ...mapActions({
      updateMerchant: 'merchant/updateMerchant',
      showMerchant: 'merchant/showMerchant',
    }),
    handleSubmit() {
      this.updateMerchant({ id: this.id, token: this.access_token, params: this.form, vue: this });
    },
  },
}
</script>
