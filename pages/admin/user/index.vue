<template>
  <fragment>
    <div class="d-sm-flex justify-content-between">
      <b-link href="/admin/user/create" class="btn btn-outline-secondary mb-3">
        <b-icon icon="person-plus" aria-hidden="true" class="mr-2"></b-icon>
        <span style="font-size: 18px;">
          Add User
        </span>
      </b-link>

      <div>
        <b-form-input
          id="filter-input"
          type="search"
          class="mb-3"
          @change="handleSearch($event)"
          placeholder="Search by (name, email)"
          style="width: 250px; height: 41px;"
        ></b-form-input>
      </div>
    </div>

    <b-table
      class="text-truncate overflow-auto border-bottom"
      :items="items"
      :fields="fields"
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
      :sort-direction="sortDirection"
      :filter="filter"
      show-empty
      responsive
    >
      <template #cell(profile)="{ item: { profile, name } }">
        <b-avatar
          :src="profile && profile"
          size="2rem"
          :text="!profile ? `${name[0]}${name[1]}` : ''"
        >
        </b-avatar>
      </template>
      <template #cell(is_disabled)="{ item: { is_disabled } }">
        <b-badge
          :variant="is_disabled ? 'danger' : 'success'"
          class="text-uppercase p-2 text-white"
        >
          {{ is_disabled ? 'inactive' : 'active' }}
        </b-badge>
      </template>
      <template #cell(created_at)="{ item: { created_at } }">
        {{ formatDatetime(created_at) }}
      </template>
      <template #cell(updated_at)="{ item: { updated_at } }">
        {{ formatDatetime(updated_at) }}
      </template>
      <template v-if="trashed" #cell(deleted_at)="{ item: { deleted_at } }">
        {{ formatDatetime(deleted_at) }}
      </template>
      <template v-if="trashed" #cell(deleted_by)="{ item: { deleted_by } }">
        {{ deleted_by }}
      </template>
      <template #cell(actions)="{ item: { id, is_disabled } }">
        <b-button
          v-if="loggedInUser.id != id && !trashed"
          variant="link"
          :class="`text-${is_disabled ? 'success' : 'warning'} p-0 mr-2`"
          @click="handleDisabled(id)"
          v-b-tooltip.hover
          :title="is_disabled ? 'Enable' : 'Disable'"
        >
          <b-icon
            :icon="is_disabled ? 'unlock' : 'lock'"
            aria-hidden="true"
          >
          </b-icon>
        </b-button>
        <b-button
          v-if="!trashed"
          variant="link"
          class="text-secondary p-0 mr-2"
          :href="`/admin/user/${id}`"
          v-b-tooltip.hover
          title="View"
        >
          <b-icon icon="eye" aria-hidden="true"></b-icon>
        </b-button>
        <b-button
          v-if="!trashed"
          variant="link"
          class="text-info p-0 mr-2"
          :href="`/admin/user/edit/${id}`"
          v-b-tooltip.hover
          title="Edit"
        >
          <b-icon icon="pencil-square" aria-hidden="true"></b-icon>
        </b-button>
        <b-button
          v-if="loggedInUser.id != id && !trashed"
          variant="link"
          class="text-danger p-0 mr-2"
          @click="handleDelete(id)"
          v-b-tooltip.hover
          title="Delete"
        >
          <b-icon icon="trash" aria-hidden="true"></b-icon>
        </b-button>
        <b-button
          v-if="trashed"
          variant="link"
          class="text-success p-0 mr-2"
          @click="handleRestore(id)"
          v-b-tooltip.hover
          title="Restore"
        >
          <b-icon icon="arrow-counterclockwise" aria-hidden="true"></b-icon>
        </b-button>
        <b-button
          v-if="loggedInUser.id != id"
          variant="link"
          class="text-danger p-0"
          @click="handleDelete(id, true)"
          v-b-tooltip.hover
          title="Destroy"
        >
          <b-icon icon="x-square" aria-hidden="true"></b-icon>
        </b-button>
      </template>
    </b-table>
    <div class="d-sm-flex justify-content-between">
      <div class="overflow-auto">
        <b-pagination-nav
          class="d-inline-block mr-2"
          :link-gen="linkGen"
          :number-of-pages="pages"
          v-model="page"
          use-router
        >
        </b-pagination-nav>
        <span class="text-muted d-inline-block">Total {{ total }} entries.</span>
      </div>
      <div>
        <b-form-checkbox v-model="trashed" name="check-button" switch>
          <span class="text-muted">Trash</span>
        </b-form-checkbox>
      </div>
    </div>
  </fragment>
</template>

<script>
import Noty from 'noty';
import { mapActions, mapGetters } from "vuex";
import { Fragment } from 'vue-fragment';

export default {
  middleware: 'auth',
  components: {
    Fragment
  },
  asyncData({ app }) {
    return {
      access_token: app.$auth.getToken('local'),
      fields: [
        { key: 'profile', label: 'Profile' },
        { key: 'name', label: 'Name', sortable: true, sortDirection: 'desc' },
        { key: 'email', label: 'Email', sortable: true },
        { key: 'is_disabled', label: 'Status', sortable: true },
        { key: 'created_at', label: 'Created At', sortable: true },
        { key: 'created_by', label: 'Created By', sortable: true },
        { key: 'updated_at', label: 'Updated At', sortable: true },
        { key: 'updated_by', label: 'Updated By', sortable: true },
        { key: 'deleted_at', label: 'Deleted At', sortable: true },
        { key: 'deleted_by', label: 'Deleted By', sortable: true },
        { key: 'actions', label: 'Actions' }
      ],
      sortBy: '',
      sortDesc: false,
      sortDirection: 'asc',
      filter: null,
      trashed: false,
    };
  },
  watch: {
    page(page) {
      this.listUsers({ token: this.access_token, params: { page } });
    },
    trashed(trashed) {
      this.listUsers({ token: this.access_token, params: { trashed } });
    }
  },
  computed: {
    ...mapGetters({
      loggedInUser: 'loggedInUser',
      items: 'user/getUsers',
      total: 'user/getTotal',
      pages: 'user/getPages',
    }),
    page: {
      get() {
        return this.$store.state.merchant.page;
      },
      set(val) {
        this.$store.commit('merchant/setPage', val);
      }
    }
  },
  created() {
    this.listUsers({ token: this.access_token });
  },
  methods: {
    ...mapActions({
      listUsers: 'user/listUsers',
      disabledUser: 'user/disabledUser',
      destroyUser: 'user/destroyUser',
      restoreUser: 'user/restoreUser',
    }),
    linkGen(pageNum) {
      return {
        path: '/admin/user',
        query: { page: pageNum }
      }
    },
    handleDisabled(id) {
      this.disabledUser({ id, token: this.access_token, vue: this });
    },
    handleRestore(id) {
      this.restoreUser({ id, token: this.access_token, vue: this });
    },
    handleDelete(id, force_delete = false) {
      const vm = this;
      const dialog = new Noty({
        text: 'Do you really want to delete this user?',
        type: 'error',
        buttons: [
          Noty.button('YES', 'btn btn-secondary', async () => {
            await vm.destroyUser({ id, token: vm.access_token, params: { force_delete }, vue: vm });
            dialog.close();
          }, { id: 'button1', 'data-status': 'ok' }),
          Noty.button('NO', 'btn btn-link text-white text-decoration-none', () => dialog.close())
        ]
      });
      dialog.show();
    },
    async handleSearch(search) {
      let params = {};
      if (search) {
        params.search = search;
      }

      this.listUsers({ token: this.access_token, params });
    }
  },
}
</script>
