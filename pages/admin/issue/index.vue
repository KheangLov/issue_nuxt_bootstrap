<template>
  <fragment>
    <div class="d-sm-flex justify-content-between">
      <b-link href="/admin/issue/create" class="btn btn-outline-secondary mb-3">
        <b-icon icon="person-plus" aria-hidden="true" class="mr-2"></b-icon>
        <span style="font-size: 18px;">
          Add Issue
        </span>
      </b-link>

      <div>
        <b-form-input
          id="filter-input"
          type="search"
          @change="handleSearch($event)"
          placeholder="Search..."
          style="width: 250px; height: 41px;"
        >
        </b-form-input>
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
      <template #cell(merchant)="{ item: { merchant: { name, id } } }">
        <b-link :href="`/admin/merchant/${id}`" class="btn btn-link p-0">
          {{ name }}
        </b-link>
      </template>
      <template #cell(issue_type)="{ item: { issue_type } }">
        <b-badge
          :variant="issue_type === 'bug' ? 'warning' : 'info'"
          class="text-uppercase p-2 text-white"
        >
          {{ issue_type.replace('_', '') }}
        </b-badge>
      </template>
      <template #cell(status)="{ item: { status } }">
        <b-badge
          v-if="status === 'resolved'"
          variant="success"
          class="text-uppercase p-2 text-white"
        >
          Resolved
        </b-badge>
        <b-badge
          v-else
          variant="danger"
          class="text-uppercase p-2 text-white"
        >
          Issue
        </b-badge>
      </template>
      <template #cell(api_type)="{ item: { api_type } }">
        <b-badge
          :variant="api_type === 'sandbox' ? 'light' : 'dark'"
          class="text-uppercase p-2"
        >
          {{ api_type.replace('_', '') }}
        </b-badge>
      </template>
      <template #cell(issued_at)="{ item: { issued_at } }">
        {{ formatDatetime(issued_at) }}
      </template>
      <template #cell(resolved_at)="{ item: { resolved_at } }">
        {{ formatDatetime(resolved_at) }}
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
      <template #cell(actions)="{ item: { id } }">
        <b-button
          v-if="!trashed"
          variant="link"
          class="text-secondary p-0 mr-2"
          :href="`/admin/issue/${id}`"
          v-b-tooltip.hover
          title="View"
        >
          <b-icon icon="eye" aria-hidden="true"></b-icon>
        </b-button>
        <b-button
          v-if="!trashed"
          variant="link"
          class="text-info p-0 mr-2"
          :href="`/admin/issue/edit/${id}`"
          v-b-tooltip.hover
          title="Edit"
        >
          <b-icon icon="pencil-square" aria-hidden="true"></b-icon>
        </b-button>
        <b-button
          v-if="!trashed"
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
        { key: 'name', label: 'Name', sortable: true, sortDirection: 'desc' },
        { key: 'merchant', label: 'Merchant', sortable: true },
        { key: 'issue_type', label: 'Issue Type', sortable: true },
        { key: 'status', label: 'Status', sortable: true },
        { key: 'api_type', label: 'API Type', sortable: true },
        { key: 'resolution', label: 'Resolution', sortable: true },
        { key: 'issued_at', label: 'Issued At', sortable: true },
        { key: 'resolved_at', label: 'Resolved At', sortable: true },
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
      this.listIssues({ token: this.access_token, params: { page } });
    },
    trashed(trashed) {
      this.listIssues({ token: this.access_token, params: { trashed } });
    }
  },
  computed: {
    ...mapGetters({
      loggedInUser: 'loggedInUser',
      items: 'issue/getIssues',
      total: 'issue/getTotal',
      pages: 'issue/getPages',
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
    this.listIssues({ token: this.access_token });
  },
  methods: {
    ...mapActions({
      listIssues: 'issue/listIssues',
      disabledIssue: 'issue/disabledIssue',
      destroyIssue: 'issue/destroyIssue',
      restoreIssue: 'issue/restoreIssue',
    }),
    linkGen(pageNum) {
      return {
        path: '/admin/issue',
        query: { page: pageNum }
      }
    },
    handleDisabled(id) {
      this.disabledIssue({ id, token: this.access_token, vue: this });
    },
    handleRestore(id) {
      this.restoreIssue({ id, token: this.access_token, vue: this });
    },
    handleDelete(id, force_delete = false) {
      const vm = this;
      const dialog = new Noty({
        text: 'Do you really want to delete this issue?',
        type: 'error',
        buttons: [
          Noty.button('YES', 'btn btn-secondary', async () => {
            await vm.destroyIssue({ id, token: vm.access_token, params: { force_delete }, vue: vm });
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

      this.listIssues({ token: this.access_token, params });
    }
  },
}
</script>
