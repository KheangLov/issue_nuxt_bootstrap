<template>
  <ValidationObserver ref="form">
    <form-component @submitted="handleSubmit($event)">
      <template #form>
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
      </template>

      <template #actions>
        <action-buttons-component
          :submit_obj="{ button_loaded }"
          :cancel_obj="{ link: '/admin/merchant' }"
        />
      </template>
    </form-component>
  </ValidationObserver>
</template>

<script>
import { ValidationProvider, ValidationObserver } from "vee-validate";
import FormComponent from '~/components/FormComponent';
import ActionButtonsComponent from '~/components/ActionButtonsComponent';

export default {
  components: {
    FormComponent,
    ActionButtonsComponent,
    ValidationProvider,
    ValidationObserver
  },
  props: ['entry'],
  data() {
    return {
      form: this.entry || {},
      button_loaded: true,
    };
  },
  methods: {
    handleSubmit() {
      this.$emit('form_submit', this);
    }
  },
}
</script>
