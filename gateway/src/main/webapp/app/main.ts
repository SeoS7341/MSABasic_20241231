// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.common with an alias.
import Vue from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import App from './app.vue';
import Vue2Filters from 'vue2-filters';
import router from './router';
import * as config from './shared/config/config';
import * as bootstrapVueConfig from './shared/config/config-bootstrap-vue';
import JhiItemCountComponent from './shared/jhi-item-count.vue';
import JhiSortIndicatorComponent from './shared/sort/jhi-sort-indicator.vue';
import InfiniteLoading from 'vue-infinite-loading';
import AuditsService from './admin/audits/audits.service';

import HealthService from './admin/health/health.service';
import MetricsService from './admin/metrics/metrics.service';
import LogsService from './admin/logs/logs.service';
import ActivateService from './account/activate/activate.service';
import RegisterService from './account/register/register.service';
import UserManagementService from '@/admin/user-management/user-management.service';

import LoginService from './account/login.service';
import AccountService from './account/account.service';

import '../content/scss/vendor.scss';
import AlertService from '@/shared/alert/alert.service';
import TranslationService from '@/locale/translation.service';
import ConfigurationService from '@/admin/configuration/configuration.service';

import GatewayService from '@/admin/gateway/gateway.service';

/* tslint:disable */

import BookService from '@/entities/book/book/book.service';
import InStockBookService from '@/entities/book/in-stock-book/in-stock-book.service';
import BookCatalogService from '@/entities/bookCatalog/book-catalog/book-catalog.service';
import RentalService from '@/entities/rental/rental/rental.service';
import OverdueItemService from '@/entities/rental/overdue-item/overdue-item.service';
import RentedItemService from '@/entities/rental/rented-item/rented-item.service';
import ReturnedItemService from '@/entities/rental/returned-item/returned-item.service';
import BookRentalService from '@/cnaps/book-rental-service/book-rental.service';
import BookRegisterService from '@/cnaps/book-register-service/book-register.service';
import RentedBookManagementService from '@/cnaps/rented-book-manage-service/rented-book-management.service';
import MyPageService from '@/cnaps/mypage-service/mypage.service';
// jhipster-needle-add-entity-service-to-main-import - JHipster will import entities services here

/* tslint:enable */
Vue.config.productionTip = false;
config.initVueApp(Vue);
config.initFortAwesome(Vue);
bootstrapVueConfig.initBootstrapVue(Vue);
Vue.use(Vue2Filters);
Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.component('jhi-item-count', JhiItemCountComponent);
Vue.component('jhi-sort-indicator', JhiSortIndicatorComponent);
Vue.component('infinite-loading', InfiniteLoading);

const i18n = config.initI18N(Vue);
const store = config.initVueXStore(Vue);

const alertService = new AlertService(store);
const translationService = new TranslationService(store, i18n);
const loginService = new LoginService();
const accountService = new AccountService(store, translationService, router);

router.beforeEach((to, from, next) => {
  if (!to.matched.length) {
    next('/not-found');
  }

  if (to.meta && to.meta.authorities && to.meta.authorities.length > 0) {
    accountService.hasAnyAuthorityAndCheckAuth(to.meta.authorities).then(value => {
      if (!value) {
        sessionStorage.setItem('requested-url', to.fullPath);
        next('/forbidden');
      } else {
        next();
      }
    });
  } else {
    // no authorities, so just proceed
    next();
  }
});

/* tslint:disable */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>',
  router,
  provide: {
    loginService: () => loginService,
    activateService: () => new ActivateService(),
    registerService: () => new RegisterService(),
    userService: () => new UserManagementService(),

    auditsService: () => new AuditsService(),

    healthService: () => new HealthService(),

    gatewayService: () => new GatewayService(),

    configurationService: () => new ConfigurationService(),
    logsService: () => new LogsService(),
    metricsService: () => new MetricsService(),
    alertService: () => alertService,
    translationService: () => translationService,
    bookService: () => new BookService(),
    inStockBookService: () => new InStockBookService(),
    bookCatalogService: () => new BookCatalogService(),
    rentalService: () => new RentalService(),
    overdueItemService: () => new OverdueItemService(),
    rentedItemService: () => new RentedItemService(),
    returnedItemService: () => new ReturnedItemService(),
    // jhipster-needle-add-entity-service-to-main - JHipster will import entities services here
    accountService: () => accountService,
    bookRentalService: () => new BookRentalService(),
    bookRegisterService: () => new BookRegisterService(),
    rentedBookManagementService: () => new RentedBookManagementService(),
    myPageService: () => new MyPageService(),
  },
  i18n,
  store,
});
