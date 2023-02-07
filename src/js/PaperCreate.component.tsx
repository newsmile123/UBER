import React, { FC } from "react";
import { Form, Formik, FormikHelpers, useFormikContext } from "formik";
import { useSnackbar } from "notistack";
import * as Yup from "yup";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Button,
  FormLayout,
  InputDate,
  InputField,
  Paper,
  Stack,
  WithLabel,
} from "@mega/ui";
import { useSiteStore } from "@mega/store";
import type { Paper as IPaper } from "@mega/api";
import { papers } from "@mega/api";
import { DndFileLoader, FileViewer } from "@mega/core";
import dayjs from "dayjs";
import { base } from "./PaperCreate.css";

export interface PaperEditProps {
  initialValue?: IPaper;
  handleUpdate?: (value: IPaper, actions: FormikHelpers<IPaper>) => void;
}

const PaperCreate: FC<PaperEditProps> = ({
  handleUpdate = () => null,
  initialValue = {
    title: "",
    number: 0,
    date: new Date(),
    file: null,
  },
}) => {
  const site = useSiteStore();
  const { enqueueSnackbar } = useSnackbar();
  const location = useLocation();
  const navigate = useNavigate();

  const handleCreate = async (value: IPaper) => {
    if (!Boolean(site && site.id)) {
      return enqueueSnackbar(
        "Простите что-то пошло не так, обратитесь пожалуйста в тех поддержку",
        {
          variant: "error",
        }
      );
    }
    const formData = new FormData();
    formData.append("site", site?.id || "");
    for (const key in value) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        if (key === "date")
          formData.append(key, dayjs(value[key]).format("YYYY-MM-DD"));
        // @ts-ignore
        else formData.append(key, value[key]);
      }
    }

    try {
      const response = await papers?.create({
        data: formData,
        notifier: enqueueSnackbar,
      });
      if (response?.data) {
        navigate(`/${site?.id || ""}/issue/`, {
          state: location,
        });
      }
    } catch (e) {
      return {
        isOk: false,
        error: e,
      };
    }
  };

  return (
    <Formik
      validationSchema={Yup.object({
        title: Yup.string()
          .min(1, "Это поле явно должно быть больше одного символа")
          .required("Это поле обязательное"),
        number: Yup.number().required("Это поле обязательное"),
      })}
      // @ts-ignore
      initialValues={initialValue}
      onSubmit={handleCreate}
    >
      <Form>
        <FormLayout
          actions={
            <PaperCreateActions
              // @ts-ignore
              handleUpdate={handleUpdate}
            />
          }
        >
          <Paper
            variant="outline"
            color="white"
            classes={{
              padding: { size: "24x24" },
            }}
          >
            <Stack gap="18">
              <InputField
                type="text"
                name={"title"}
                placeholder="Заголовок"
                dimension="medium"
              />
              <InputField
                type="number"
                name={"number"}
                placeholder="Номер выпуска"
                dimension="medium"
              />
              <InputDate name="date" />
              <div className={base}>
                <WithLabel id={"cover"} title="Обложка">
                  <FileLoaderField name="cover" />
                </WithLabel>
                <WithLabel id={"file"} title="Файл">
                  <FileLoaderField name="file" />
                </WithLabel>
              </div>
            </Stack>
          </Paper>
        </FormLayout>
      </Form>
    </Formik>
  );
};

interface IFileLoaderField {
  name: keyof IPaper;
}

const FileLoaderField: FC<IFileLoaderField> = ({ name }) => {
  const { values, setFieldValue } = useFormikContext<any>();
  const uploadHandler = (e: any) => {
    setFieldValue(name, e);
  };

  const getSrc = () => {
    if (values?.[name] && name === "cover") {
      return typeof values?.[name] !== "string"
        ? URL.createObjectURL(values?.[name])
        : values?.[name];
    }
    return "";
  };
  return (
    <>
      <DndFileLoader onUpload={uploadHandler}>
        <FileViewer fileSrc={getSrc()} />
      </DndFileLoader>
      {typeof values?.[name] === "string" && <span>{values?.[name]}</span>}
      {values?.[name]?.name && <span>{values?.[name].name}</span>}
    </>
  );
};

interface PaperCreateActionForm {
  handleUpdate?: (value: IPaper, actions: FormikHelpers<IPaper>) => void;
}

const PaperCreateActions: FC<PaperCreateActionForm> = ({ handleUpdate }) => {
  const { submitForm, isSubmitting, values, ...rest } =
    useFormikContext<IPaper>();

  return (
    <Paper
      style={{
        borderTop: "1px solid #EAEAEA",
      }}
      fullWidth
      color={"white"}
      variant="filled"
      classes={{
        padding: { size: "24x24" },
      }}
    >
      <Button
        classes={{
          paper: {
            variant: "filled",
            color: "dark",
          },
        }}
        disabled={isSubmitting}
        color="secondary"
        size={"large"}
        type={"submit"}
        label={values.id ? "Обновить" : "Создать"}
        onClick={
          values.id && handleUpdate
            ? // @ts-ignore
              () => handleUpdate(values, rest)
            : submitForm
        }
      />
    </Paper>
  );
};

export { PaperCreate };
