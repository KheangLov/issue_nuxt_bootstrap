<template>
  <fragment>
    <b-navbar
      v-if="loggedInUser"
      type="dark"
      variant="dark"
      sticky
      toggleable="md"
      class="shadow border-0 m-0"
      :class="isUserScrolling ? 'top-z-index' : ''"
    >
      <b-container fluid>
        <b-navbar-brand class="font-weight-bold px-2 text-uppercase">
          <b-link href="/admin/dashboard" class="text-decoration-none">ISSUE</b-link>
        </b-navbar-brand>
        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav>
            <b-nav-item
              v-for="({ link, classes, text, icon }, i) in navItems"
              @click="handleActive"
              :href="link"
              link-classes="rounded-0"
              :class="classes"
              :key="i"
            >
              <b-icon :icon="icon" class="mr-2"></b-icon>
              {{ text }}
            </b-nav-item>
          </b-navbar-nav>
          <b-navbar-nav class="ml-auto">
            <b-nav-item-dropdown
              right
              class="p-0"
              menu-class="border-0 shadow p-0"
            >
              <template
                #button-content
              >
                <b-avatar
                  :src="loggedInUser.profile && loggedInUser.profile"
                  :text="!loggedInUser.profile ? `${loggedInUser.name[0]}${loggedInUser.name[1]}` : ''"
                ></b-avatar>
              </template>
              <b-dropdown-item disabled>
                {{ loggedInUser.name }}
              </b-dropdown-item>
              <b-dropdown-divider></b-dropdown-divider>
              <b-dropdown-item
                href="/admin/profile"
              >
                <b-icon icon="person" aria-hidden="true" class="mr-2"></b-icon>
                Profile
              </b-dropdown-item>
              <b-dropdown-item
                v-if="isAuthenticated"
                href="javascript:void(0)"
                @click="logout"
              >
                <b-icon icon="arrow-left-circle" aria-hidden="true" class="mr-2"></b-icon>
                Logout
              </b-dropdown-item>
            </b-nav-item-dropdown>
          </b-navbar-nav>
        </b-collapse>
      </b-container>
    </b-navbar>
    <b-container class="content-wrapper py-4">
      <b-breadcrumb
        class="mb-4 text-uppercase justify-content-end shadow align-items-center"
      >
        <li class="flex-fill">
          <h5 class="m-0 text-uppercase breadcrumb-title">
            {{ head_title.toLowerCase().replace(' - ', '').replace('detail', '').trim() }}
          </h5>
        </li>
        <b-breadcrumb-item
          v-for="({ text, active, href }, i) in breadcrumbs"
          :href="href || ''"
          :active="active || false"
          :key="i"
        >
          {{ text }}
        </b-breadcrumb-item>
      </b-breadcrumb>
      <b-card
        class="border-0 shadow"
      >
        <Nuxt />
      </b-card>
    </b-container>
  </fragment>
</template>

<style lang="scss">

  #__nuxt {
    overflow-x: hidden;

    .dropdown-menu {

      li {

        &:first-child {

          .dropdown-item {
            border-top-left-radius: 0.25rem;
            border-top-right-radius: 0.25rem;
          }

        }

        &:last-child {

          .dropdown-item {
            border-bottom-left-radius: 0.25rem;
            border-bottom-right-radius: 0.25rem;
          }

        }

        .dropdown-item {
          padding-top: 10px;
          padding-bottom: 10px;
        }

        .dropdown-divider {
          margin: 0 !important;
        }

      }

    }

    .dropdown-toggle {

      &::after {
        display: none !important;
      }

    }

    .top-z-index {
      z-index: 9999 !important;
    }

    .font-weight-normal {
      font-weight: 600 !important;
    }

    .custom-img {
      height: 32px;
    }

  }
</style>

<script>
import _ from 'lodash';
import { mapGetters } from 'vuex';

export default {
  middleware: 'authenticated',
  head() {
    return {
      title: `ISSUE${this.head_title}`
    };
  },
  data() {
    return {
      breadcrumbs: [],
      isUserScrolling: false,
      navItems: [
        {
          link: '/admin/dashboard',
          classes: 'font-weight-normal',
          text: 'Dashboard',
          slug: 'dashboard',
          icon: 'x-diamond',
        },
        {
          link: '/admin/issue',
          classes: 'font-weight-normal',
          text: 'Issue',
          slug: 'issue',
          icon: 'question-square',
        },
        {
          link: '/admin/merchant',
          classes: 'font-weight-normal',
          text: 'Merchant',
          slug: 'merchant',
          icon: 'people',
        },
        {
          link: '/admin/user',
          classes: 'font-weight-normal',
          text: 'User',
          slug: 'user',
          icon: 'person',
        },
      ],
      head_title: '',
    };
  },
  computed: {
    ...mapGetters(['loggedInUser', 'isAuthenticated'])
  },
  created() {
    if (process.client) {
      window.addEventListener('scroll', this.handleScroll);
    }
    this.handleActive();
  },
  watch: {
    $route() {
      this.handleActive();
    }
  },
  methods: {
    async logout() {
      await this.$auth.logout();
      location.reload();
    },
    handleScroll() {
      this.isUserScrolling = (window.scrollY > 0);
    },
    clearActive() {
      this.navItems.forEach(val => val.classes = 'font-weight-normal');
    },
    handleActive() {
      this.clearActive();
      const route_splits = this.$nuxt.$route.name.split('-');
      const route_head = route_splits.map((v, i) => {
        if (i > 2) {
          return '';
        }

        if (v === 'id') {
          v = 'detail';
        }

        let obj = {
          text: v,
        };

        if (i === (route_splits.length - 1)) {
          obj.active = true;
        } else {
          obj.href = !i ? '/admin/dashboard' : `/admin/${v}`;
        }

        this.breadcrumbs.push(obj);

        if (!i) {
          return '';
        }
        return v.toUpperCase();
      }).reverse().join(' ');
      this.$set(this, 'breadcrumbs', _.uniqBy(this.breadcrumbs, 'text'));
      this.$set(this, 'head_title', route_head);
      if (this.head_title) {
        this.head_title = ` - ${this.head_title}`;
      }
      const route = route_splits[1];
      let index = _.findIndex(this.navItems, o => o.slug == route);
      if (index >= 0) this.navItems[index].classes += ' active';
    }
  },
}
</script>
