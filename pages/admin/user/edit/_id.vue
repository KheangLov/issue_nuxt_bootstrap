<template>
  <fragment>
    <b-tabs content-class="mt-3">
      <b-tab title="Info" active>
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
                  id="input-group-email"
                  label="Email"
                  label-for="input-email"
                >
                  <ValidationProvider
                    v-slot="{ errors }"
                    name="email"
                    type="email"
                    rules="required|email"
                  >
                    <b-form-input
                      id="input-email"
                      v-model="form.email"
                      type="email"
                      required
                      placeholder="Enter email"
                      :class="errors.length ? 'border-danger' : ''"
                      :disabled="loggedInUser.email == form.email"
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
                  id="input-group-profile"
                  label="Profile"
                  label-for="input-profile"
                >
                  <b-form-file class="mb-3" id="input-profile" accept="image/jpeg, image/png" @change="handleUpload">
                    <template slot="file-name" slot-scope="{ names }">
                      <b-badge variant="dark">{{ names[0] }}</b-badge>
                      <b-badge v-if="names.length > 1" variant="dark" class="ml-1">
                        + {{ names.length - 1 }} More files
                      </b-badge>
                    </template>
                  </b-form-file>

                  <div class="w-100 text-center">
                    <b-avatar
                      v-if="profile"
                      :src="profile"
                      size="10rem"
                    >
                    </b-avatar>
                  </div>
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
              <b-link href="/admin/user" class="btn btn-outline-danger">
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
      </b-tab>

      <b-tab title="Change Password">
        <ValidationObserver ref="password_form">
          <b-form @submit.prevent="handleChangePassword">
            <b-row>

              <b-col md="6">
                <b-form-group
                  id="input-group-password"
                  label="Password"
                  label-for="input-password"
                >
                  <ValidationProvider
                    v-slot="{ errors }"
                    name="password"
                    type="password"
                    rules="required|min:8|password:@confirm"
                  >
                    <b-form-input
                      id="input-password"
                      v-model="password_form.password"
                      type="password"
                      required
                      placeholder="Enter password"
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
                  id="input-group-con-password"
                  label="Confirm Password"
                  label-for="input-con-password"
                >
                  <ValidationProvider
                    v-slot="{ errors }"
                    name="confirm"
                    type="password"
                    rules="required|min:8"
                  >
                    <b-form-input
                      id="input-con-password"
                      type="password"
                      v-model="password_form.password_confirmation"
                      required
                      placeholder="Enter confirm password"
                      :class="errors.length ? 'border-danger' : ''"
                    >
                    </b-form-input>
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
              <b-link href="/admin/user" class="btn btn-outline-danger">
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
      </b-tab>
    </b-tabs>
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
      getUser: 'user/getUser',
    })
  },
  async created() {
    await this.showUser({ id: this.id, token: this.access_token });
    this.$set(this, 'profile', this.getUser.profile);
    this.$set(this, 'form', { ..._.pick(this.getUser, [
      'name',
      'email',
    ]) });
  },
  async asyncData({ params: { id }, app }) {
    return {
      id,
      access_token: app.$auth.getToken('local'),
      form: {},
      password_form: {},
      profile: '',
      button_loaded: true,
    };
  },
  methods: {
    ...mapActions({
      updateUser: 'user/updateUser',
      showUser: 'user/showUser',
    }),
    handleUpload(e) {
      const reader = new FileReader();
      this.readFileBase64(reader, e.target.files[0], 'profile', 'profile');
    },
    handleSubmit() {
      this.updateUser({ id: this.id, token: this.access_token, params: this.form, vue: this });
    },
    handleChangePassword() {
      this.updateUser({ id: this.id, token: this.access_token, params: this.password_form, vue: this });
    }
  },
}
</script>
