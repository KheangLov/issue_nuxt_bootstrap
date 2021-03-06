<template>
  <fragment>
    <h2 class="page-form-header-top">Login</h2>
    <validation-observer ref="form">
      <b-form @submit.prevent="handleSubmit">
        <b-form-group
          id="input-group-email"
          label="Email"
          label-for="input-email"
        >
          <validation-provider
            v-slot="{ errors }"
            name="email"
            rules="required"
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
          </validation-provider>
        </b-form-group>

        <b-form-group
          id="input-group-password"
          label="Password"
          label-for="input-password"
        >
          <validation-provider
            v-slot="{ errors }"
            name="password"
            type="password"
            rules="required|min:8"
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
          </validation-provider>
        </b-form-group>
        <b-button type="submit" block variant="outline-secondary mt-4 button-form-auth" :disabled="loading">
          <b-spinner small type="grow" v-if="loading"></b-spinner>
          <b-icon icon="arrow-right-circle" aria-hidden="true" v-else></b-icon>
          Login
        </b-button>
        <div class="text-center mt-2">
          <b-link href="/auth/register" class="text-secondary">Not having an account?</b-link>
        </div>
      </b-form>
    </validation-observer>
  </fragment>
</template>

<script>
import { ValidationObserver, ValidationProvider } from 'vee-validate';
import { mapGetters } from 'vuex';

export default {
  layout: 'auth',
  middleware: 'guest',
  components: {
    ValidationObserver,
    ValidationProvider,
  },
  data() {
    return {
      form: {},
      loading: false,
    };
  },
  computed: {
    ...mapGetters(['isAuthenticated', 'loggedInUser'])
  },
  methods: {
    handleSubmit() {
      this.$refs.form.validate()
        .then(async success => {
          if (!success) {
            this.alertNoty('Invild data!', 'error');
            return false;
          }

          const vm = this;
          this.$set(this, 'loading', true);
          await this.$auth.loginWith('local', { data: this.form })
            .then(({ status }) => {
              if (status === 200) {
                vm.alertNoty(`Welcome user <b>${this.loggedInUser.name}</b>!`);
              }
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
          this.$set(this, 'loading', false);
        });
    }
  }
}
</script>
