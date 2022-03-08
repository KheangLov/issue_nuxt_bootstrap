<template>
  <fragment>
    <div class="d-sm-flex justify-content-between">
      <b-link href="/admin/merchant/create" class="btn btn-outline-secondary mb-3">
        <b-icon icon="person-plus" aria-hidden="true" class="mr-2"></b-icon>
        <span style="font-size: 18px;">
          Add Merchant
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
          :href="`/admin/merchant/${id}`"
          v-b-tooltip.hover
          title="View"
        >
          <b-icon icon="eye" aria-hidden="true"></b-icon>
        </b-button>
        <b-button
          v-if="!trashed"
          variant="link"
          class="text-info p-0 mr-2"
          :href="`/admin/merchant/edit/${id}`"
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
        { key: 'branch', label: 'Branch', sortable: true },
        { key: 'email', label: 'Email', sortable: true },
        { key: 'phone', label: 'Phone', sortable: true },
        { key: 'website', label: 'Website', sortable: true },
        { key: 'app', label: 'App', sortable: true },
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
      this.listMerchants({ token: this.access_token, params: { page } });
    },
    trashed(trashed) {
      this.listMerchants({ token: this.access_token, params: { trashed } });
    }
  },
  computed: {
    ...mapGetters({
      loggedInUser: 'loggedInUser',
      items: 'merchant/getMerchants',
      total: 'merchant/getTotal',
      page: 'merchant/getPage',
      pages: 'merchant/getPages',
    })
  },
  created() {
    this.listMerchants({ token: this.access_token });
  },
  methods: {
    ...mapActions({
      listMerchants: 'merchant/listMerchants',
      disabledMerchant: 'merchant/disabledMerchant',
      destroyMerchant: 'merchant/destroyMerchant',
      restoreMerchant: 'merchant/restoreMerchant',
    }),
    linkGen(pageNum) {
      return {
        path: '/admin/merchant',
        query: { page: pageNum }
      }
    },
    handleDisabled(id) {
      this.disabledMerchant({ id, token: this.access_token, vue: this });
    },
    handleRestore(id) {
      this.restoreMerchant({ id, token: this.access_token, vue: this });
    },
    handleDelete(id, force_delete = false) {
      const vm = this;
      const dialog = new Noty({
        text: 'Do you really want to delete this merchant?',
        type: 'error',
        buttons: [
          Noty.button('YES', 'btn btn-secondary', async () => {
            await vm.destroyMerchant({ id, token: vm.access_token, params: { force_delete }, vue: vm });
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

      this.listMerchants({ token: this.access_token, params });
    }
  },
}
</script>
