import { paths } from "./api";
import { Fetcher, Middleware } from "openapi-typescript-fetch";
import axios from "axios";
import { v4 as uuid } from "uuid";
let rootFetcher = Fetcher.for<paths>();

interface IFetcherConfig {
  baseUrl: string;
  init?: {
    headers: Record<string, string>;
  };
}

class Client {
  baseUrl: string;
  fetcher: null | typeof rootFetcher = null;
  accessToken: null | string = null;
  refreshToken: null | string = null;
  config: IFetcherConfig;
  middleware: Map<string, Middleware> = new Map();

  constructor({
    baseUrl,
    accessToken = null,
    refreshToken = null,
  }: {
    baseUrl: string;
    accessToken?: string | null;
    refreshToken?: string | null;
  }) {
    this.baseUrl = baseUrl;
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.config = { baseUrl };
    this.Init({ accessToken, refreshToken });
  }

  Init({
    accessToken,
    refreshToken,
    middleware,
  }: {
    accessToken?: string | null;
    refreshToken?: string | null;
    middleware?: Map<string, Middleware> | null;
  }) {
    if (middleware) {
      this.middleware = middleware;
    }
    if (refreshToken) {
      this.refreshToken = refreshToken;
    }
    if (accessToken) {
      this.accessToken = accessToken;
      this.config = {
        ...this.config,
        init: {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      };
    }

    rootFetcher.configure({
      ...this.config,
      use: Array.from(this.middleware.values()),
    });
    this.fetcher = rootFetcher;
  }

  SetUp() {
    rootFetcher.configure({
      ...this.config,
      use: Array.from(this.middleware.values()),
    });
    this.fetcher = rootFetcher;
  }

  subscribeMiddleware(middleware: Middleware, name?: string) {
    if (!name) {
      this.middleware.set(uuid(), middleware);
      return this.SetUp();
    }
    if (this.middleware.get(name)) {
      console.error("you try add exist middleware name");
      return;
    } else {
      this.middleware.set(name, middleware);
      return this.SetUp();
    }
  }

  unSubscribeMiddleware(name: string) {
    this.middleware.delete(name);
    return this.SetUp();
  }

  Auth() {
    return {
      getToken: this.fetcher?.path("/admin/token/").method("post").create(),
      refreshToken: this.fetcher
        ?.path("/admin/token/refresh/")
        .method("post")
        .create(),
    };
  }

  Rooms() {
    return {
      checkinList: this.fetcher
        ?.path("/admin/rooms/article/")
        .method("get")
        .create(),
      checkin: this.fetcher
        ?.path("/admin/rooms/article/{obj_id}/check-in/")
        .method("post")
        .create(),
    };
  }

  User() {
    return {
      getUsersGroups: this.fetcher
        ?.path("/admin/users/groups/")
        .method("get")
        .create(),
      createUsersGroups: this.fetcher
        ?.path("/admin/users/groups/")
        .method("post")
        .create(),
      getUserGroupsOptions: this.fetcher
        ?.path("/admin/users/groups/select-options/")
        .method("get")
        .create(),
      getUserGroupsById: this.fetcher
        ?.path("/admin/users/groups/{id}/")
        .method("get")
        .create(),
      deleteUserGroupsById: this.fetcher
        ?.path("/admin/users/groups/{id}/")
        .method("delete")
        .create(),
      updateUserGroupsById: this.fetcher
        ?.path("/admin/users/groups/{id}/")
        .method("patch")
        .create(),

      // /admin/users/log-entries/
      getUserEntries: this.fetcher
        ?.path("/admin/users/log-entries/")
        .method("get")
        .create(),
      getUserEntriesById: this.fetcher
        ?.path("/admin/users/log-entries/{id}/")
        .method("get")
        .create(),

      // /admin/users/permissions/

      getUserPermissions: this.fetcher
        ?.path("/admin/users/permissions/")
        .method("get")
        .create(),
      getUserPermissionsOptions: this.fetcher
        ?.path("/admin/users/permissions/select-options/")
        .method("get")
        .create(),
      getUserPermissionsById: this.fetcher
        ?.path("/admin/users/permissions/{id}/")
        .method("get")
        .create(),

      // /admin/users/users/

      // getUsers: async (
      //   params: definitions['QueryOptions'] &
      //     definitions['QueryActive'],
      // ) => {
      //   const fetcher = this.fetcher
      //     ?.path('/admin/users/users/')
      //     .method('get')
      //     .create();

      //   return fetcher?.(params);
      // },
      createUsers: this.fetcher
        ?.path("/admin/users/users/")
        .method("post")
        .create(),
      changePassword: this.fetcher
        ?.path("/admin/users/users/change-password/")
        .method("post")
        .create(),
      getUserInfoAuth: this.fetcher
        ?.path("/admin/users/users/info-auth/")
        .method("get")
        .create(),
      // resetPassword: this.fetcher
      //     ?.path('/admin/users/users/reset-password/')
      //     .method('post')
      //     .create(),
      getQueryOptions: this.fetcher
        ?.path("/admin/users/users/select-options/")
        .method("get")
        .create(),

      getUsersById: this.fetcher
        ?.path("/admin/users/users/{id}/")
        .method("get")
        .create(),

      updateUsersById: this.fetcher
        ?.path("/admin/users/users/{id}/")
        .method("put")
        .create(),
      updatePartialUsersById: this.fetcher
        ?.path("/admin/users/users/{id}/")
        .method("patch")
        .create(),
      deleteUsersById: this.fetcher
        ?.path("/admin/users/users/{id}/")
        .method("delete")
        .create(),

      // getUsersInfoById: this.fetcher
      //     ?.path('/admin/users/users/{id}/info/')
      //     .method('get')
      //     .create(),
    };
  }
  InfinityMix() {
    return {
      get: this.fetcher
        ?.path("/admin/articles/infinite-mix/")
        .method("get")
        .create(),
      create: this.fetcher
        ?.path("/admin/articles/infinite-mix/")
        .method("post")
        .create(),
      getById: this.fetcher
        ?.path("/admin/articles/infinite-mix/{id}/")
        .method("get")
        .create(),
      updatePartialById: this.fetcher
        ?.path("/admin/articles/infinite-mix/{id}/")
        .method("patch")
        .create(),
      updateById: this.fetcher
        ?.path("/admin/articles/infinite-mix/{id}/")
        .method("put")
        .create(),
      deleteById: this.fetcher
        ?.path("/admin/articles/infinite-mix/{id}/")
        .method("delete")
        .create(),
    };
  }
  Ads() {
    return {
      // /admin/ads/blocks/
      getAdsBlocks: this.fetcher
        ?.path("/admin/ads/blocks/")
        .method("get")
        .create(),
      createAdsBlocks: this.fetcher
        ?.path("/admin/ads/blocks/")
        .method("post")
        .create(),
      getAdsBlocksById: this.fetcher
        ?.path("/admin/ads/blocks/{id}/")
        .method("get")
        .create(),
      updateAdsBlocksById: this.fetcher
        ?.path("/admin/ads/blocks/{id}/")
        .method("put")
        .create(),
      updatePartialAdsBlocksById: this.fetcher
        ?.path("/admin/ads/blocks/{id}/")
        .method("patch")
        .create(),
      deleteAdsBlocksById: this.fetcher
        ?.path("/admin/ads/blocks/{id}/")
        .method("delete")
        .create(),

      // /admin/ads/head-scripts/

      getAdsHeadScripts: this.fetcher
        ?.path("/admin/ads/head-scripts/")
        .method("get")
        .create(),
      createAdsHeadScripts: this.fetcher
        ?.path("/admin/ads/head-scripts/")
        .method("post")
        .create(),
      getAdsHeadScriptsOptions: this.fetcher
        ?.path("/admin/ads/head-scripts/select-options/")
        .method("get")
        .create(),
      getAdsHeadScriptsById: this.fetcher
        ?.path("/admin/ads/head-scripts/{id}/")
        .method("get")
        .create(),
      updateAdsHeadScriptsById: this.fetcher
        ?.path("/admin/ads/head-scripts/{id}/")
        .method("put")
        .create(),
      updatePartialAdsHeadScriptsById: this.fetcher
        ?.path("/admin/ads/head-scripts/{id}/")
        .method("patch")
        .create(),
      deleteAdsHeadScriptsById: this.fetcher
        ?.path("/admin/ads/head-scripts/{id}/")
        .method("delete")
        .create(),
    };
  }

  Infounittask() {
    return {
      createFromInfoUnitTask: this.fetcher
        ?.path(
          "/admin/articles/articles/create-from-info-unit-task/{info_unit_task_id}/"
        )
        .method("post")
        .create(),
      rejectInfoUnitTask: this.fetcher
        ?.path("/admin/info-units/info-units/{id}/smi-reject/{smi_id}/")
        .method("put")
        .create(),
      getTasks: this.fetcher
        ?.path("/admin/info-units/tasks/")
        .method("get")
        .create(),
      getTaskParameters: this.fetcher
        ?.path("/admin/info-units/tasks/")
        .method("parameters")
        .create(),
      getTask: this.fetcher
        ?.path("/admin/info-units/tasks/{id}/")
        .method("get")
        .create(),
      deleteTask: this.fetcher
        ?.path("/admin/info-units/tasks/{id}/")
        .method("delete")
        .create(),
      patchTask: this.fetcher
        ?.path("/admin/info-units/tasks/{id}/")
        .method("patch")
        .create(),
      putTask: this.fetcher
        ?.path("/admin/info-units/tasks/{id}/")
        .method("parameters")
        .create(),
    };
  }

  ArticleHistory() {
    return {
      getList: this.fetcher
        ?.path("/admin/articles/articles/{id}/history/")
        .method("get")
        .create(),
      getVersion: this.fetcher
        ?.path("/admin/articles/articles/{id}/history/{version_pk}/")
        .method("get")
        .create(),

      revert: this.fetcher
        ?.path("/admin/articles/articles/{id}/revert/{version_pk}/")
        .method("post")
        .create(),
    };
  }

  Articles() {
    return {
      get: this.fetcher
        ?.path("/admin/articles/articles/")
        .method("get")
        .create(),

      getOptions: this.fetcher
        ?.path("/admin/articles/articles/select-options/")
        .method("get")
        .create(),
      create: this.fetcher
        ?.path("/admin/articles/articles/")
        .method("post")
        .create(),

      getMainGrid: this.fetcher
        ?.path("/admin/articles/articles/main-grid/")
        .method("get")
        .create(),
      getById: this.fetcher
        ?.path("/admin/articles/articles/{id}/")
        .method("get")
        .create(),
      updateById: this.fetcher
        ?.path("/admin/articles/articles/{id}/")
        .method("put")
        .create(),
      updatePartialById: this.fetcher
        ?.path("/admin/articles/articles/{id}/")
        .method("patch")
        .create(),
      deleteById: this.fetcher
        ?.path("/admin/articles/articles/{id}/")
        .method("delete")
        .create(),
      deleteByIdWithRoomCheck: this.fetcher
        ?.path("/admin/articles/articles/{id}/delete-room-check/")
        .method("delete")
        .create(),
      getHistory: this.fetcher
        ?.path("/admin/articles/articles/{id}/history/")
        .method("get")
        .create(),
      getHistoryByVersion: this.fetcher
        ?.path("/admin/articles/articles/{id}/history/{version_pk}/")
        .method("get")
        .create(),
      revertByVersion: this.fetcher
        ?.path("/admin/articles/articles/{id}/revert/{version_pk}/")
        .method("post")
        .create(),
      // /admin/articles/authors/

      // /admin/articles/copyrights/
      getCopyrights: this.fetcher
        ?.path("/admin/articles/copyrights/")
        .method("get")
        .create(),
      createCopyrights: this.fetcher
        ?.path("/admin/articles/copyrights/")
        .method("post")
        .create(),
      getCopyrightsOptions: this.fetcher
        ?.path("/admin/articles/copyrights/select-options/")
        .method("get")
        .create(),
      getCopyrightsById: this.fetcher
        ?.path("/admin/articles/copyrights/{id}/")
        .method("get")
        .create(),
      updateCopyrightsById: this.fetcher
        ?.path("/admin/articles/copyrights/{id}/")
        .method("put")
        .create(),
      updateArticlesCopyrightsById: this.fetcher
        ?.path("/admin/articles/copyrights/{id}/")
        .method("patch")
        .create(),
      deleteCopyrightsById: this.fetcher
        ?.path("/admin/articles/copyrights/{id}/")
        .method("delete")
        .create(),

      // /admin/articles/experts/
      getExperts: this.fetcher
        ?.path("/admin/articles/experts/")
        .method("get")
        .create(),
      createExperts: this.fetcher
        ?.path("/admin/articles/experts/")
        .method("post")
        .create(),
      getExpertsOptions: this.fetcher
        ?.path("/admin/articles/experts/select-options/")
        .method("get")
        .create(),
      getExpertsById: this.fetcher
        ?.path("/admin/articles/experts/{id}/")
        .method("get")
        .create(),
      updateExpertsById: this.fetcher
        ?.path("/admin/articles/experts/{id}/")
        .method("put")
        .create(),
      updatePartialArticlesExpertsById: this.fetcher
        ?.path("/admin/articles/experts/{id}/")
        .method("patch")
        .create(),
      deleteExpertsById: this.fetcher
        ?.path("/admin/articles/experts/{id}/")
        .method("delete")
        .create(),

      // /admin/articles/host-videos-categories/
      getHostVideos: this.fetcher
        ?.path("/admin/articles/host-videos-categories/")
        .method("get")
        .create(),
      createHostVideos: this.fetcher
        ?.path("/admin/articles/host-videos-categories/")
        .method("post")
        .create(),
      getHostVideosOptions: this.fetcher
        ?.path("/admin/articles/host-videos-categories/select-options/")
        .method("get")
        .create(),
      getHostVideosById: this.fetcher
        ?.path("/admin/articles/host-videos-categories/{id}/")
        .method("get")
        .create(),
      updateHostVideosById: this.fetcher
        ?.path("/admin/articles/host-videos-categories/{id}/")
        .method("put")
        .create(),
      updatePartialHostVideosById: this.fetcher
        ?.path("/admin/articles/host-videos-categories/{id}/")
        .method("patch")
        .create(),
      deleteHostVideosById: this.fetcher
        ?.path("/admin/articles/host-videos-categories/{id}/")
        .method("delete")
        .create(),

      getYandexTags: this.fetcher
        ?.path("/admin/articles/yandex-article-tags/")
        .method("get")
        .create(),
      createYandexTags: this.fetcher
        ?.path("/admin/articles/yandex-article-tags/")
        .method("post")
        .create(),
      getYandexTagsOptions: this.fetcher
        ?.path("/admin/articles/yandex-article-tags/select-options/")
        .method("get")
        .create(),
      getYandexTagsById: this.fetcher
        ?.path("/admin/articles/yandex-article-tags/{id}/")
        .method("get")
        .create(),
      updateYandexTagsById: this.fetcher
        ?.path("/admin/articles/yandex-article-tags/{id}/")
        .method("put")
        .create(),
      updatePartialYandexTagsById: this.fetcher
        ?.path("/admin/articles/yandex-article-tags/{id}/")
        .method("patch")
        .create(),
      deleteYandexTagsById: this.fetcher
        ?.path("/admin/articles/yandex-article-tags/{id}/")
        .method("delete")
        .create(),

      // /admin/sites/

      getSites: this.fetcher?.path("/admin/sites/").method("get").create(),
      createSites: this.fetcher?.path("/admin/sites/").method("post").create(),
      getSitesOptions: this.fetcher
        ?.path("/admin/sites/select-options/")
        .method("get")
        .create(),
      getSitesDomain: this.fetcher
        ?.path("/admin/sites/{domain}/")
        .method("get")
        .create(),
      updateSitesDomain: this.fetcher
        ?.path("/admin/sites/{domain}/")
        .method("put")
        .create(),
      updatePartialSitesDomain: this.fetcher
        ?.path("/admin/sites/{domain}/")
        .method("patch")
        .create(),
      deleteSitesDomain: this.fetcher
        ?.path("/admin/sites/{domain}/")
        .method("delete")
        .create(),

      // /admin/tv/airtabs/
      getTvAirtabs: this.fetcher
        ?.path("/admin/tv/airtabs/")
        .method("get")
        .create(),
      createTvAirtabs: this.fetcher?.path("/admin/tv/airtabs/").method("post"),
      getTvAirtabsOptions: this.fetcher
        ?.path("/admin/tv/airtabs/select-options/")
        .method("get")
        .create(),
      getTvAirtabsById: this.fetcher
        ?.path("/admin/tv/airtabs/{id}/")
        .method("get")
        .create(),
      updateTvAirtabsById: this.fetcher
        ?.path("/admin/tv/airtabs/{id}/")
        .method("put"),
      updatePartialTvAirtabsById: this.fetcher
        ?.path("/admin/tv/airtabs/{id}/")
        .method("patch"),
      deleteTvAirtabsById: this.fetcher
        ?.path("/admin/tv/airtabs/{id}/")
        .method("delete"),

      // /admin/website/footer
      getWebsiteFooter: this.fetcher
        ?.path("/admin/website/footer/")
        .method("get")
        .create(),
      createWebsiteFooter: this.fetcher
        ?.path("/admin/website/footer/")
        .method("post"),

      createWebsiteMain: this.fetcher
        ?.path("/admin/website/main-page/")
        .method("post")
        .create(),
      getWebsiteMainLatest: this.fetcher
        ?.path("/admin/website/main-page/latest/")
        .method("get")
        .create(),
      // getWebsiteMainById: this.fetcher
      //     ?.path('/admin/website/main-page/{id}/')
      //     .method('get')
      //     .create(),
      // updateWebsiteMainById: this.fetcher
      //     ?.path('/admin/website/main-page/{id}/')
      //     .method('put')
      //     .create({}),
      // updatePartialWebsiteMainById: this.fetcher
      //     ?.path('/admin/website/main-page/{id}/')
      //     .method('patch')
      //     .create({}),

      // // /admin/website/navigation/
      // getWebsiteNav: async (
      //   params: definitions['QuerySerializer']
      // ) => {
      //   const fetcher = this.fetcher
      //     ?.path('/admin/website/navigation/')
      //     .method('get')
      //     .create();
      //   return fetcher?.(params);
      // },
      // createWebsiteNav: async (
      //   params: definitions['AdminAirTabSerializerPkUpdate'], query:{ site?: true | 1 | undefined; }
      // ) => {
      //   const fetcher = this.fetcher
      //     ?.path('/admin/website/navigation/')
      //     .method('post')
      //     .create(query);
      //   return fetcher?.(params);
      // },
      // getWebsiteNavOptions: async (
      //   params: definitions['QuerySerializer']
      // ) => {
      //   const fetcher = this.fetcher
      //     ?.path('/admin/website/navigation/select-options/')
      //     .method('get')
      //     .create();
      //   return fetcher?.(params);
      // },
      // getWebsiteNavById: async (
      //   params: definitions['ID']
      // ) => {
      //   const fetcher = this.fetcher
      //     ?.path('/admin/website/navigation/{id}/')
      //     .method('get')
      //     .create();
      //   return fetcher?.(params);
      // },
      // updateWebsiteNavById: async (
      //   params: definitions['ID'] & definitions['AdminAirTabSerializerPkUpdate'], query:{ site?: true | 1 | undefined; }
      // ) => {
      //   const fetcher = this.fetcher
      //     ?.path('/admin/website/navigation/{id}/')
      //     .method('put')
      //     .create(query);
      //   return fetcher?.(params);
      // },
      // updatePartialWebsiteNavById: async (
      //   params: definitions['ID'] & definitions['AdminAirTabSerializerPkUpdate'], query:{ site?: true | 1 | undefined; }
      // ) => {
      //   const fetcher = this.fetcher
      //     ?.path('/admin/website/navigation/{id}/')
      //     .method('patch')
      //     .create(query);
      //   return fetcher?.(params);
      // },
      // deleteWebsiteNavById: async (
      //   params: definitions['ID'], query:{ site?: true | 1 | undefined; }
      // ) => {
      //   const fetcher = this.fetcher
      //     ?.path('/admin/website/navigation/{id}/')
      //     .method('delete')
      //     .create(query);
      //   return fetcher?.(params);
      // },

      // /admin/website/reposts/
      getWebsiteReposts: this.fetcher
        ?.path("/admin/website/reposts/")
        .method("get")
        .create(),
      createWebsiteReposts: this.fetcher
        ?.path("/admin/website/reposts/")
        .method("post")
        .create(),
      getWebsiteRepostsOptions: this.fetcher
        ?.path("/admin/website/reposts/select-options/")
        .method("get")
        .create(),
      getWebsiteRepostsById: this.fetcher
        ?.path("/admin/website/reposts/{id}/")
        .method("get")
        .create(),
      updateWebsiteRepostsById: this.fetcher
        ?.path("/admin/website/reposts/{id}/")
        .method("put")
        .create(),
      updatePartialWebsiteRepostsById: this.fetcher
        ?.path("/admin/website/reposts/{id}/")
        .method("patch")
        .create(),
      deleteWebsiteRepostsById: this.fetcher
        ?.path("/admin/website/reposts/{id}/")
        .method("delete")
        .create(),
      // /admin/website/service-files/
      getWebsiteServiceFiles: this.fetcher
        ?.path("/admin/website/service-files/")
        .method("get")
        .create(),
      createWebsiteServiceFiles: this.fetcher
        ?.path("/admin/website/service-files/")
        .method("post"),
      getWebsiteServiceFilesById: this.fetcher
        ?.path("/admin/website/service-files/{id}/")
        .method("get")
        .create(),
      updateWebsiteServiceFilesById: this.fetcher
        ?.path("/admin/website/service-files/{id}/")
        .method("put"),
      updatePartialWebsiteServiceFilesById: this.fetcher
        ?.path("/admin/website/service-files/{id}/")
        .method("patch"),
      deleteWebsiteServiceFilesById: this.fetcher
        ?.path("/admin/website/service-files/{id}/")
        .method("delete"),
      // /admin/website/service-pages/
      getWebsiteServicePages: this.fetcher
        ?.path("/admin/website/service-pages/")
        .method("get")
        .create(),
      createWebsiteServicePages: this.fetcher
        ?.path("/admin/website/service-pages/")
        .method("post"),
      getWebsiteServicePagesById: this.fetcher
        ?.path("/admin/website/service-pages/{id}/")
        .method("get")
        .create(),
      updateWebsiteServicePagesById: this.fetcher
        ?.path("/admin/website/service-pages/{id}/")
        .method("put"),
      updatePartialWebsiteServicePagesById: this.fetcher
        ?.path("/admin/website/service-pages/{id}/")
        .method("patch"),
      deleteWebsiteServicePagesById: this.fetcher
        ?.path("/admin/website/service-pages/{id}/")
        .method("delete"),
    };
  }
  Streams() {
    return {
      get: this.fetcher
        ?.path("/admin/website/main-page-streams/")
        .method("get")
        .create(),
      create: this.fetcher
        ?.path("/admin/website/main-page-streams/")
        .method("post")
        .create(),
      getById: this.fetcher
        ?.path("/admin/website/main-page-streams/{id}/")
        .method("get")
        .create(),
      updateById: this.fetcher
        ?.path("/admin/website/main-page-streams/{id}/")
        .method("put")
        .create(),
      updatePartialById: this.fetcher
        ?.path("/admin/website/main-page-streams/{id}/")
        .method("patch")
        .create(),
      deleteById: this.fetcher
        ?.path("/admin/website/main-page-streams/{id}/")
        .method("delete")
        .create(),
    };
  }
  RSS() {
    return {
      getRss: this.fetcher
        ?.path("/admin/articles/rss-feeds/")
        .method("get")
        .create(),
      createRss: this.fetcher
        ?.path("/admin/articles/rss-feeds/")
        .method("post"),
      getOptions: this.fetcher
        ?.path("/admin/articles/rss-feeds/select-options/")
        .method("get")
        .create(),
      getRssById: this.fetcher
        ?.path("/admin/articles/rss-feeds/{id}/")
        .method("get")
        .create(),
      updateRssById: this.fetcher
        ?.path("/admin/articles/rss-feeds/{id}/")
        .method("put"),
      updatePartialRssById: this.fetcher
        ?.path("/admin/articles/rss-feeds/{id}/")
        .method("patch"),
      deleteRssById: this.fetcher
        ?.path("/admin/articles/rss-feeds/{id}/")
        .method("delete"),
    };
  }

  Cities() {
    return {
      getOptions: this.fetcher
        ?.path("/admin/articles/cities/select-options/")
        .method("get")
        .create(),
    };
  }

  Images() {
    return {
      // /admin/articles/images/
      get: this.fetcher?.path("/admin/articles/images/").method("get").create(),
      create: async ({
        data,
        setIsLoading,
        notifier,
      }: {
        data: any;
        notifier: any;
        setIsLoading?: (e: boolean) => void;
      }) =>
        axios
          .post(`${this.baseUrl}/admin/articles/images/`, data, {
            method: "POST",
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${this.accessToken}`,
            },
            onDownloadProgress: (progressEvent) => {
              progressEvent.loaded && setIsLoading && setIsLoading(true);
            },
          })
          .then((res) => {
            setIsLoading && setIsLoading(false);
            return res;
          })
          .catch(() => {
            setIsLoading && setIsLoading(false);
            if (notifier) {
              notifier("Произошла ошибка про загрузке изображения", {
                variant: "error",
              });
            }
          }),
      getOptions: this.fetcher
        ?.path("/admin/articles/images/select-options/")
        .method("get")
        .create(),
      uploadTo: async ({
        data,
        obj_type,
        obj_id,
      }: {
        data: any;
        obj_type: string;
        obj_id?: string;
      }) =>
        axios.post(
          `${this.baseUrl}/admin/articles/images/upload-to-${obj_type}/${obj_id}/`,
          {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${this.accessToken}`,
            },
            body: data,
          }
        ),
      getById: this.fetcher
        ?.path("/admin/articles/images/{id}/")
        .method("get")
        .create(),
      updateById: async ({ data, id }: { data: any; id?: number }) =>
        axios.put(`${this.baseUrl}/admin/articles/images/${id}/`, {
          method: "PUT",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${this.accessToken}`,
          },
          body: data,
        }),
      updatePartialById: async ({
        data,
        setIsLoading,
        id,
        notifier,
      }: {
        id: number;
        data: any;
        notifier?: any;
        setIsLoading?: (e: boolean) => void;
      }) =>
        axios
          .patch(`${this.baseUrl}/admin/articles/images/${id}/`, data, {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${this.accessToken}`,
            },
            onDownloadProgress: (progressEvent) => {
              if (setIsLoading) {
                const { loaded } = progressEvent;
                loaded && setIsLoading(true);
              }
            },
          })
          .then((res) => {
            setIsLoading && setIsLoading(false);
            return res;
          })
          .catch(() => {
            setIsLoading && setIsLoading(false);
            if (notifier) {
              notifier("Произошла ошибка про обновлении изображения", {
                variant: "error",
              });
            }
          }),
      deleteById: this.fetcher
        ?.path("/admin/articles/images/{id}/")
        .method("delete")
        .create(),
      addTo: async ({
        data,
        obj_type,
        obj_id,
        id,
      }: {
        data: any;
        obj_type: string;
        obj_id?: number;
        id?: number;
      }) =>
        axios.put(
          `${this.baseUrl}/admin/articles/images/${id}/add-to-${obj_type}/${obj_id}/`,
          {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${this.accessToken}`,
            },
            body: data,
          }
        ),
      deleteFrom: this.fetcher
        ?.path("/admin/articles/images/{id}/delete-from-{obj_type}/{obj_id}/")
        .method("delete")
        .create(),
      getPreview: this.fetcher
        ?.path("/admin/articles/images/{id}/fp/{fp_x}:{fp_y}/")
        .method("get")
        .create(),
    };
  }

  Videos() {
    // /admin/articles/videos/
    return {
      get: this.fetcher?.path("/admin/articles/videos/").method("get").create(),
      create: async ({
        data,
        setProgress,
      }: {
        data: any;
        setProgress?: (e: any) => void;
      }) =>
        axios.post(`${this.baseUrl}/admin/articles/videos/`, data, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${this.accessToken}`,
          },
          onUploadProgress: (progressEvent) => {
            const progress = (progressEvent.loaded * 100) / progressEvent.total;
            setProgress && setProgress(progress);
          },
        }),
      getOptions: this.fetcher
        ?.path("/admin/articles/videos/select-options/")
        .method("get")
        .create(),
      uploadTo: this.fetcher
        ?.path("/admin/articles/videos/{id}/task-upload/")
        .method("post")
        .create(),

      getById: this.fetcher
        ?.path("/admin/articles/videos/{id}/")
        .method("get")
        .create(),
      updateById: this.fetcher
        ?.path("/admin/articles/videos/{id}/")
        .method("put")
        .create(),
      updatePartialById: async ({
        id,
        data,
        setProgress,
      }: {
        id: number;
        data: any;
        setProgress?: (e: any) => void;
      }) =>
        axios.patch(`${this.baseUrl}/admin/articles/videos/${id}/`, data, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${this.accessToken}`,
          },
          onUploadProgress: (progressEvent) => {
            const progress = (progressEvent.loaded * 100) / progressEvent.total;
            setProgress && setProgress(progress);
          },
        }),
      deleteById: this.fetcher
        ?.path("/admin/articles/videos/{id}/")
        .method("delete")
        .create(),
      addToById: this.fetcher
        ?.path("/admin/articles/videos/{id}/add-to-{obj_type}/{obj_id}/")
        .method("put")
        .create(),
      deleteFromById: this.fetcher
        ?.path("/admin/articles/videos/{id}/delete-from-{obj_type}/{obj_id}/")
        .method("delete")
        .create(),
    };
  }

  Authors() {
    return {
      get: this.fetcher
        ?.path("/admin/articles/authors/")
        .method("get")
        .create(),
      create: this.fetcher
        ?.path("/admin/articles/authors/")
        .method("post")
        .create(),
      getOptions: this.fetcher
        ?.path("/admin/articles/authors/select-options/")
        .method("get")
        .create(),
      updateImageById: (id: string, data: FormData) =>
        axios.patch(`${this.baseUrl}/admin/articles/authors/${id}/`, data, {
          method: "PATCH",
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${this.accessToken}`,
          },
        }),
      updateById: this.fetcher
        ?.path("/admin/articles/authors/{id}/")
        .method("patch")
        .create(),

      getById: this.fetcher
        ?.path("/admin/articles/authors/{id}/")
        .method("get")
        .create(),
      updatePartialById: this.fetcher
        ?.path("/admin/articles/authors/{id}/")
        .method("patch")
        .create(),
      deleteById: this.fetcher
        ?.path("/admin/articles/authors/{id}/")
        .method("delete")
        .create(),
    };
  }

  Categories() {
    return {
      get: this.fetcher
        ?.path("/admin/articles/categories/")
        .method("get")
        .create(),
      create: this.fetcher
        ?.path("/admin/articles/categories/")
        .method("post")
        .create(),
      getOptions: this.fetcher
        ?.path("/admin/articles/categories/select-options/")
        .method("get")
        .create(),
      getById: this.fetcher
        ?.path("/admin/articles/categories/{id}/")
        .method("get")
        .create(),
      updateById: this.fetcher
        ?.path("/admin/articles/categories/{id}/")
        .method("put")
        .create(),
      updatePartialById: this.fetcher
        ?.path("/admin/articles/categories/{id}/")
        .method("patch")
        .create(),
      deleteById: this.fetcher
        ?.path("/admin/articles/categories/{id}/")
        .method("delete")
        .create(),
    };
  }

  Copyrights() {
    return {
      get: this.fetcher
        ?.path("/admin/articles/copyrights/")
        .method("get")
        .create(),
      create: this.fetcher
        ?.path("/admin/articles/copyrights/")
        .method("post")
        .create(),
      getOptions: this.fetcher
        ?.path("/admin/articles/copyrights/select-options/")
        .method("get")
        .create(),
      getById: this.fetcher
        ?.path("/admin/articles/copyrights/{id}/")
        .method("get")
        .create(),
      updateById: this.fetcher
        ?.path("/admin/articles/copyrights/{id}/")
        .method("put")
        .create(),
      updatePartialById: this.fetcher
        ?.path("/admin/articles/copyrights/{id}/")
        .method("patch")
        .create(),
      deleteById: this.fetcher
        ?.path("/admin/articles/copyrights/{id}/")
        .method("delete")
        .create(),
    };
  }

  Tags() {
    return {
      get: this.fetcher?.path("/admin/articles/tags/").method("get").create(),
      create: this.fetcher
        ?.path("/admin/articles/tags/")
        .method("post")
        .create(),
      getOptions: this.fetcher
        ?.path("/admin/articles/tags/select-options/")
        .method("get")
        .create(),
      getById: this.fetcher
        ?.path("/admin/articles/tags/{id}/")
        .method("get")
        .create(),
      updateById: this.fetcher
        ?.path("/admin/articles/tags/{id}/")
        .method("put")
        .create(),
      updatePartialById: this.fetcher
        ?.path("/admin/articles/tags/{id}/")
        .method("patch")
        .create(),
      deleteById: this.fetcher
        ?.path("/admin/articles/tags/{id}/")
        .method("delete")
        .create(),
    };
  }

  Nav() {
    return {
      getNav: this.fetcher
        ?.path("/admin/admin/menus-conf/")
        .method("get")
        .create(),
    };
  }

  Notify() {
    return {
      getAuthNotify: this.fetcher
        ?.path("/admin/users/users/notifications-auth/")
        .method("get")
        .create(),
    };
  }

  Reports() {
    return {
      getArticles: this.fetcher
        ?.path("/admin/reports/articles/")
        .method("get")
        .create(),
      getFilters: this.fetcher
        ?.path("/admin/reports/filters/")
        .method("get")
        .create(),
      create: this.fetcher
        ?.path("/admin/reports/sources/")
        .method("post")
        .create(),
      getSource: this.fetcher
        ?.path("/admin/reports/sources/")
        .method("get")
        .create(),
      getVideo: this.fetcher
        ?.path("/admin/reports/videos/")
        .method("get")
        .create(),
      getById: this.fetcher
        ?.path("/admin/reports/sources/{id}/")
        .method("get")
        .create(),
      updateById: this.fetcher
        ?.path("/admin/reports/sources/{id}/")
        .method("put")
        .create(),
      updatePartialById: this.fetcher
        ?.path("/admin/reports/sources/{id}/")
        .method("patch")
        .create(),
      deleteById: this.fetcher
        ?.path("/admin/reports/sources/{id}/")
        .method("delete")
        .create(),
    };
  }
  Stories() {
    return {
      getStories: this.fetcher
        ?.path("/admin/website/stories/")
        .method("get")
        .create(),
      updateStroies: this.fetcher
        ?.path("/admin/website/stories/")
        .method("post")
        .create(),
    };
  }

  Reposts() {
    return {
      getWebsiteReposts: this.fetcher
        ?.path("/admin/website/reposts/")
        .method("get")
        .create(),
      createWebsiteReposts: this.fetcher
        ?.path("/admin/website/reposts/")
        .method("post")
        .create(),
      getWebsiteRepostsOptions: this.fetcher
        ?.path("/admin/website/reposts/select-options/")
        .method("get")
        .create(),
      getWebsiteRepostsById: this.fetcher
        ?.path("/admin/website/reposts/{id}/")
        .method("get")
        .create(),
      updateWebsiteRepostsById: this.fetcher
        ?.path("/admin/website/reposts/{id}/")
        .method("put")
        .create(),
      updatePartialWebsiteRepostsById: this.fetcher
        ?.path("/admin/website/reposts/{id}/")
        .method("patch")
        .create(),
      deleteWebsiteRepostsById: this.fetcher
        ?.path("/admin/website/reposts/{id}/")
        .method("delete")
        .create(),
    };
  }

  Redactors() {
    return {
      get: this.fetcher
        ?.path("/admin/users/users/select-options-dashboard/")
        .method("get")
        .create(),
    };
  }

  Infounits() {
    return {
      get: this.fetcher
        ?.path("/admin/info-units/info-units/select-options/")
        .method("get")
        .create(),
    };
  }

  Papers() {
    return {
      get: this.fetcher?.path("/admin/papers/issues/").method("get").create(),
      create: async <T>({
        data,
        setIsLoading,
        notifier,
      }: {
        data: T;
        notifier?: any;
        setIsLoading?: (e: boolean) => void;
      }) =>
        axios
          .post(`${this.baseUrl}/admin/papers/issues/`, data, {
            method: "POST",
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${this.accessToken}`,
            },
            onDownloadProgress: (progressEvent) => {
              progressEvent.loaded && setIsLoading && setIsLoading(true);
            },
          })
          .then((res) => {
            setIsLoading && setIsLoading(false);
            if (notifier) {
              notifier("Новый выпуск добавлен", {
                variant: "success",
              });
            }
            return res;
          })
          .catch((e) => {
            setIsLoading && setIsLoading(false);

            if (notifier) {
              const errormsgs = Object.values(e.response.data);

              errormsgs?.map((msg) => {
                notifier(msg as string, {
                  variant: "error",
                });
              });
            }
          }),
      getOptions: this.fetcher
        ?.path("/admin/papers/issues/select-options/")
        .method("get")
        .create(),
      getById: this.fetcher
        ?.path("/admin/papers/issues/{id}/")
        .method("get")
        .create(),
      updateById: this.fetcher
        ?.path("/admin/papers/issues/{id}/")
        .method("put")
        .create(),
      updatePartialById: async <T>({
        id,
        data,
        setIsLoading,
        notifier,
        headers = {},
      }: {
        id: string;
        data: T;
        notifier?: any;
        setIsLoading?: (e: boolean) => void;
        headers?: any;
      }) =>
        axios
          .patch(`${this.baseUrl}/admin/papers/issues/${id}/`, data, {
            method: "PATCH",
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${this.accessToken}`,
              ...headers,
            },
            onDownloadProgress: (progressEvent) => {
              progressEvent.loaded && setIsLoading && setIsLoading(true);
            },
          })
          .then((res) => {
            setIsLoading && setIsLoading(false);
            return res;
          })
          .catch((e) => {
            setIsLoading && setIsLoading(false);
            if (notifier) {
              notifier("Произошла ошибка при обновлении выпуска", {
                variant: "error",
              });
            }
            return e.response;
          }),
      deleteById: this.fetcher
        ?.path("/admin/papers/issues/{id}/")
        .method("delete")
        .create(),
    };
  }
}

export { Client };
