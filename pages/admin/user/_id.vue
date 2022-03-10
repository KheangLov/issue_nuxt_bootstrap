<template>
  <div class="content text-left">
    <div class="text-center mb-5">
      <div class="d-inline-block position-relative">
        <b-avatar
          :src="entry.profile && entry.profile"
          size="8rem"
          class="mb-3"
          :text="!entry.profile && entry.name ? `${entry.name[0]}${entry.name[1]}` : ''"
        ></b-avatar>
        <b-badge
          class="position-absolute text-uppercase p-2"
          :variant="!entry.is_disabled ? 'success' : 'danger'"
          style="border-radius: 50%; bottom: 15%; right: 10%;"
        >
          <span class="d-none">{{ !entry.is_disabled ? "active" : "inactive"}}</span>
        </b-badge>
      </div>
    </div>
    <b-row>
      <b-col md="2"></b-col>
      <b-col md="8">
        <p class="mb-3 d-flex justify-content-between">
          <strong class="mr-3">Username</strong>
          <span>
            {{ entry.name }}
          </span>
        </p>
        <p class="mb-3 d-flex justify-content-between">
          <strong class="mr-3">Email</strong>
          <span>
            {{ entry.email }}
          </span>
        </p>
        <p class="mb-3 d-flex justify-content-between">
          <strong class="mr-3">Created At</strong>
          <span>
            {{ formatDatetime(entry.created_at) }}
          </span>
        </p>
        <p class="mb-3 d-flex justify-content-between">
          <strong class="mr-3">Created By</strong>
          <span>
            {{ entry.created_by }}
          </span>
        </p>
        <p class="mb-3 d-flex justify-content-between">
          <strong class="mr-3">Updated At</strong>
          <span>
            {{ formatDatetime(entry.updated_at) }}
          </span>
        </p>
        <p class="mb-3 d-flex justify-content-between">
          <strong class="mr-3">Updated By</strong>
          <span>
            {{ entry.updated_by }}
          </span>
        </p>
        <p class="mb-3 d-flex justify-content-between">
          <strong class="mr-3">Deleted At</strong>
          <span>
            {{ formatDatetime(entry.deleted_at) }}
          </span>
        </p>
        <p class="mb-3 d-flex justify-content-between">
          <strong class="mr-3">Deleted By</strong>
          <span>
            {{ entry.deleted_by }}
          </span>
        </p>
      </b-col>
      <b-col md="2"></b-col>
    </b-row>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  middleware: 'auth',
  computed: {
    ...mapGetters({
      loggedInUser: 'loggedInUser',
      entry: 'user/getUser',
    }),
  },
  asyncData({ params: { id }, app }) {
    return {
      id,
      access_token: app.$auth.getToken('local'),
    };
  },
  created() {
    this.showUser({ id: this.id, token: this.access_token });
  },
  methods: {
    ...mapActions({
      showUser: 'user/showUser'
    }),
  },
}
</script>
