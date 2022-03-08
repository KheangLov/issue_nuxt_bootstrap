<template>
  <fragment>
    <ValidationObserver ref="form">
      <b-form @submit.prevent="handleCreate" enctype="multipart/form-data">
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
                  v-model="form.password"
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
                  v-model="form.password_confirmation"
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
  </fragment>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { Fragment } from 'vue-fragment';
import { ValidationObserver, ValidationProvider } from "vee-validate";

export default {
  middleware: 'auth',
  components: {
    Fragment,
    ValidationObserver,
    ValidationProvider,
  },
  computed: {
    ...mapGetters({
      loggedInUser: 'loggedInUser',
    }),
  },
  asyncData({ app }) {
    return {
      access_token: app.$auth.getToken('local'),
      form: {
        is_disabled: false,
      },
      profile: '',
      button_loaded: true,
      redirect_url: '/admin/user'
    };
  },
  methods: {
    ...mapActions({
      createUser: 'user/createUser'
    }),
    handleCreate() {
      this.createUser({ token: this.access_token, params: this.form, vue: this });
    },
    handleUpload(e) {
      const reader = new FileReader();
      this.readFileBase64(reader, e.target.files[0], 'profile', 'profile');
    },
  },
}
</script>
