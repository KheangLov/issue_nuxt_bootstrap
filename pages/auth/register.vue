<template>
  <fragment>
    <h2 class="page-form-header-top">Register</h2>
    <ValidationObserver ref="form">
      <b-form @submit.prevent="handleSubmit">
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

        <b-button type="submit" block variant="outline-secondary mt-4 button-form-auth" :disabled="!button_loaded">
          <b-icon icon="person-plus-fill" aria-hidden="true"></b-icon>
          Register
        </b-button>
      </b-form>
      <div class="text-center mt-2">
        <b-link href="/auth/login" class="text-secondary">Go to login.</b-link>
      </div>
    </ValidationObserver>
  </fragment>
</template>

<script>
import axios from 'axios';
import { ValidationObserver, ValidationProvider } from "vee-validate";
import { Fragment } from 'vue-fragment';

export default {
  layout: 'auth',
  middleware: 'guest',
  components: {
    Fragment,
    ValidationObserver,
    ValidationProvider
  },
  data() {
    return {
      form: {
        is_disabled: false,
      },
      button_loaded: true,
      profile: '',
      redirect_url: '/auth/login'
    };
  },
  methods: {
    handleUpload(e) {
      const reader = new FileReader();
      this.readFileBase64(reader, e.target.files[0], 'profile', 'profile');
    },
    handleSubmit() {
      const vm = this;
      this.$set(this, 'button_loaded', false);
      this.$refs.form.validate()
        .then(async success => {
          if (!success) {
            vm.alertNoty('Invild data!', 'error');
            return false;
          }

          await axios.post('https://issue-app-api.herokuapp.com/api/v1/register', vm.form)
            .then(({ data: { message } }) => {
              vm.alertNoty(message);
              setTimeout(() => window.location.href = '/auth/login', 2000);
              vm.form = {};
              vm.$nextTick(() => vm.$refs.form.reset());
            })
            .catch(err => {
              if (err.response) {
                const { message, errors } = err.response.data;
                if (errors && errors.length) {
                  vm.$refs.form.setErrors(errors);
                }
                vm.alertNoty(message, 'error');
              }
            });

          vm.$set(vm, 'button_loaded', true);
        });
    }
  },
}
</script>
