<!-- <template>
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
          class="mb-3"
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
import { mapActions, mapGetters } from "vuex";
import { Fragment } from 'vue-fragment';

export default {
  middleware: 'auth',
  components: {
    Fragment
  },
  props: ['entry'],
  asyncData({ app }) {
    let entry_name = '';
    let entry_fields = [];

    if (this.entry) {
      entry_name = this.entry.name;

      if (Object.hasOwnProperty('fields')) {
        entry_fields = this.entry.fields;
      }
    }

    return {
      entry_name,
      cap_entry_name: this.pluralizeAndCapitalize(entry_name, false),
      plu_cap_entry_name: this.pluralizeAndCapitalize(entry_name),
      access_token: app.$auth.getToken('local'),
      fields: [
        ...entry_fields,
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
      this.list({ token: this.access_token, params: { page } });
    },
    trashed(trashed) {
      this.list({ token: this.access_token, params: { trashed } });
    }
  },
  computed: {
    ...mapGetters({
      loggedInUser: 'loggedInUser',
      items: `${this.entry_name}/get${this.plu_cap_entry_name}`,
      total: `${this.entry_name}/getTotal`,
      pages: `${this.entry_name}/getPages`,
    }),
    page: {
      get() {
        return this.$store.state[this.entry_name].page;
      },
      set(val) {
        this.$store.commit(`${this.entry_name}/setPage`, val);
      }
    }
  },
  created() {
    this.list({ token: this.access_token });
  },
  methods: {
    ...mapActions({
      list: `${this.entry_name}/list${this.plu_cap_entry_name}`,
      destroy: `${this.entry_name}/destroy${this.cap_entry_name}`,
      restore: `${this.entry_name}/restore${this.cap_entry_name}`,
    }),
    linkGen(pageNum) {
      return {
        path: `/admin/${this.entry_name}`,
        query: { page: pageNum }
      }
    },
    handleRestore(id) {
      this.restore({ id, token: this.access_token, vue: this });
    },
    handleDelete(id, force_delete = false) {
      this.req_force_delete = force_delete;
      this.req_id = id;
      this.deletePopup(this);
    },
    async handleSearch(search) {
      let params = {};
      if (search) {
        params.search = search;
      }

      this.list({ token: this.access_token, params });
    }
  },
}
</script> -->
