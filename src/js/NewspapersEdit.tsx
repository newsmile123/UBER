import React, { useEffect } from "react";
import { useSnackbar } from "notistack";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { usePaperStore, usePaperDispatch, useSiteStore } from "@mega/store";
import { Paper } from "@mega/api";
import { PaperCreate } from "@mega/forms";
import { FormikHelpers } from "formik";
import dayjs from "dayjs";

export const NewspapersEdit: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar();

  const { loading, store } = usePaperStore();
  const { get, update } = usePaperDispatch();
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const currentSite = useSiteStore();

  useEffect(() => {
    if (id) {
      get({ id: parseInt(id) });
    }
  }, [id, get]);

  if (loading.get.loading || !loading.get.success) {
    return <div>loading</div>;
  }

  let editedId: number;

  if (id) {
    editedId = parseInt(id);
  } else {
    throw new Error("The editable entity has no id.");
  }

  const handleUpdate = async (
    payload: Paper,
    actions: FormikHelpers<Paper>
  ) => {
    const formData = new FormData();
    for (const key in payload) {
      if (Object.prototype.hasOwnProperty.call(payload, key)) {
        if (
          (key === "file" || key === "cover") &&
          (typeof payload[key] === "string" || payload["cover"] === null)
        )
          continue;

        if (key === "date")
          formData.append(key, dayjs(payload[key]).format("YYYY-MM-DD"));
        // @ts-ignore
        else formData.append(key, payload[key]);
      }
    }
    await update({
      query: {
        id: editedId,
      },
      // @ts-ignore
      payload: formData,
      options: {
        notifier: {
          enqueueSnackbar,
        },
        router: {
          navigate,
          location,
        },
      },
    });
    actions.setSubmitting(false);
  };
  return <PaperCreate initialValue={store} handleUpdate={handleUpdate} />;
};
