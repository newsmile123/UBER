import * as CLIENT from "@mega/api";
import { Paper, PaperUpdate } from "@mega/api";
import { createModel } from "@rematch/core";
import { DispatchEffectWithDependency } from "../type";

import type { RootModel } from "../rootModel";

export interface PaperUpdateEffect
  extends DispatchEffectWithDependency<PaperUpdate> {
  query: {
    id: number;
  };
}

const paper = createModel<RootModel>()({
  name: "paper",
  state: {} as Paper,
  reducers: {
    put: (_state, payload: Paper) => {
      return { ...payload };
    },
  },
  effects: (dispatch) => ({
    get: async (params: { id: number }, store) => {
      try {
        const response = await CLIENT.papers.getById?.({
          ...params,
          // @ts-ignore
          site: store.site.site?.id || "",
        });
        if (response?.ok) {
          dispatch.paper.put(response.data);
        }
      } catch (e) {
        if (CLIENT.papers.getById && e instanceof CLIENT.papers.getById.Error) {
          const error = e.getActualType();
          switch (error.status) {
            case 401: {
              return error.data;
            }
          }
        }
      }
    },
    create: async (payload: Paper, store) => {
      try {
        const response = await CLIENT.papers?.create?.({
          ...payload,
          // @ts-ignore
          site: store.site.site?.id || "",
        });
        if (response) {
          return {
            isOk: true,
            data: response.data,
          };
        }
      } catch (e) {
        return {
          isOk: false,
          error: e,
        };
      }
    },
    update: async ({ query, payload, options }: PaperUpdateEffect, store) => {
      try {
        const response = await CLIENT.papers?.updatePartialById?.({
          data: payload,
          id: String(query.id),
          headers: {
            "X-Site": store.site.site?.id || "",
          },
        });

        if (response?.data && response.status == 200) {
          dispatch.paper.put(response.data);
          if (options?.notifier) {
            const { enqueueSnackbar } = options.notifier;
            enqueueSnackbar("Выпуск обновлен", {
              variant: "success",
            });
          }
        } else {
          if (options?.notifier) {
            const { enqueueSnackbar } = options.notifier;

            const errormsgs = Object.values(response.data);

            errormsgs?.map((msg) => {
              enqueueSnackbar(msg as string, {
                variant: "error",
              });
            });
          }
        }
      } catch (e) {
        return e;
      }
    },
    remove: async (id: string, store) => {
      const query = store.papers.query;

      try {
        const response = await CLIENT?.papers?.deleteById?.(
          {
            id,
          },
          {
            headers: {
              "X-Site": store.site.site?.id || "",
            },
          }
        );
        if (response?.ok) {
          dispatch.papers.get(query);
        }
      } catch {}
    },
  }),
});

export { paper };
export default paper;
