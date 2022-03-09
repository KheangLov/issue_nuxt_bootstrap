<template>
  <div>
    <b-row class="mb-4">
      <b-col md="4" v-for="({ text, count, color }, i) in dashboard" :key="i" class="mb-4">
        <b-card :bg-variant="color" :text-variant="color === 'light' ? 'dark' : 'white'" class="border-0">
          <b-card-text class="d-flex justify-content-between">
            <span
              class="text-uppercase text-truncate m-0 letter-spaceing"
              v-b-tooltip.hover
              :title="text"
            >
              <strong v-html="text">
              </strong>
            </span>
            <span>
              <strong>{{ formatNumber(count) }}</strong>
            </span>
          </b-card-text>
        </b-card>
      </b-col>
    </b-row>
    <b-row>
      <b-col md="6">
        <div class="d-sm-flex justify-content-between">
          <h4 class="font-weight-bold mb-2 text-uppercase letter-spaceing">
            Latest issues
          </h4>
          <b-link
            href="/admin/issue"
            class="btn btn-link p-0 letter-spaceing text-uppercase"
          >
            View all
          </b-link>
        </div>
        <b-table
          class="text-truncate overflow-auto"
          :items="issues"
          :fields="issue_fields"
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
          <template #cell(actions)="{ item: { id } }">
            <b-button
              variant="link"
              class="text-secondary p-0 mr-2"
              :href="`/admin/issue/${id}`"
              v-b-tooltip.hover
              title="View"
            >
              <b-icon icon="eye" aria-hidden="true"></b-icon>
            </b-button>
          </template>
        </b-table>
      </b-col>
      <b-col md="6">
        <div class="d-sm-flex justify-content-between">
          <h4 class="font-weight-bold mb-2 text-uppercase letter-spaceing">
            Latest merchants
          </h4>
          <b-link
            href="/admin/merchant"
            class="btn btn-link p-0 letter-spaceing text-uppercase"
          >
            View all
          </b-link>
        </div>
        <b-table
          class="text-truncate overflow-auto"
          :items="merchants"
          :fields="merchant_fields"
          responsive
        >
          <template #cell(created_at)="{ item: { created_at } }">
            {{ formatDatetime(created_at) }}
          </template>
          <template #cell(updated_at)="{ item: { updated_at } }">
            {{ formatDatetime(updated_at) }}
          </template>
          <template #cell(actions)="{ item: { id } }">
            <b-button
              variant="link"
              class="text-secondary p-0 mr-2"
              :href="`/admin/merchant/${id}`"
              v-b-tooltip.hover
              title="View"
            >
              <b-icon icon="eye" aria-hidden="true"></b-icon>
            </b-button>
          </template>
        </b-table>
      </b-col>
    </b-row>
  </div>
</template>

<style lang="scss">
  .letter-spaceing {
    letter-spacing: 1.5px !important;
  }
</style>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  middleware: 'auth',
  computed: {
    ...mapGetters({
      loggedInUser: 'loggedInUser',
      dashboard: 'issue/getDashboard',
      issues: 'issue/getIssues',
      merchants: 'merchant/getMerchants',
    }),
  },
  asyncData({ app }) {
    return {
      access_token: app.$auth.getToken('local'),
      issue_fields: [
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
      merchant_fields: [
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
    };
  },
  async created() {
    await this.dashboardIssue({ token: this.access_token });
    await this.listIssues({ token: this.access_token });
    await this.listMerchants({ token: this.access_token });
  },
  methods: {
    ...mapActions({
      dashboardIssue: 'issue/dashboardIssue',
      listIssues: 'issue/listIssues',
      listMerchants: 'merchant/listMerchants',
    }),
  },
}
</script>
