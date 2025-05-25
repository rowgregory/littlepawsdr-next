import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ChangeEvent } from "react";

export type Inputs = {
  [key: string]: string | number | boolean | undefined | unknown;
};

export type Errors = {
  [key: string]: string;
};

interface SetInputProps {
  formName: string;
  data: any;
}
interface SetErrorsProps {
  formName: string;
  errors: Errors;
}
interface SetSubmitttedProps {
  formName: string;
  submitted: boolean;
}
interface HandleInputProps {
  formName: string;
  name: string;
  value: any;
}

const formInitialState = {} as any;

export const formSlice = createSlice({
  name: "form",
  initialState: formInitialState,
  reducers: {
    setIsCreating: (state) => {
      state.isCreating = true;
    },
    setIsNotCreating: (state) => {
      state.isCreating = false;
    },
    resetForm: (state, { payload }) => {
      if (state[payload] && state[payload].inputs !== undefined) {
        state[payload].inputs = null;
        state[payload].errors = null;
      }
    },
    setInputs: (state, { payload }: PayloadAction<SetInputProps>) => {
      const { formName, data } = payload;
      if (!state[formName])
        state[formName] = { inputs: {}, errors: {}, submitted: false };
      state[formName].inputs = { ...state[formName].inputs, ...data };
    },
    clearInputs: (state, { payload }: PayloadAction<{ formName: string }>) => {
      const { formName } = payload;
      state[formName].inputs = {};
    },
    clearErrors: (state, { payload }: PayloadAction<{ formName: string }>) => {
      const { formName } = payload;
      state[formName].errors = {};
    },
    setErrors: (state, { payload }: PayloadAction<SetErrorsProps>) => {
      const { formName, errors } = payload;
      if (!state[formName]) {
        return;
      }

      state[formName].errors = errors;
    },

    setSubmitted: (state, { payload }: PayloadAction<SetSubmitttedProps>) => {
      const { formName, submitted } = payload;
      if (!state[formName]) return;
      state[formName].submitted = submitted;
    },
    handleInput: (state, action: PayloadAction<HandleInputProps>) => {
      const { formName, name, value } = action.payload;

      const form = state[formName];

      state[formName] = {
        ...form,
        inputs: {
          ...form?.inputs,
          [name]: value,
        },
        errors: {
          ...form?.errors,
        },
      };
    },
    handleToggle: (
      state,
      {
        payload,
      }: PayloadAction<{ formName: string; name: string; checked: boolean }>
    ) => {
      const { formName, name, checked } = payload;
      const form = state[formName];

      state[formName] = {
        ...form,
        inputs: {
          ...form?.inputs,
          [name]: checked,
        },
        errors: {
          ...form?.errors,
        },
      };
    },
    handleFileUpload: (
      state,
      action: PayloadAction<{
        formName: string;
        imageUrl: string | ArrayBuffer | null;
        file: File | null;
      }>
    ) => {
      const { formName, imageUrl, file } = action.payload;
      state[formName] = {
        ...state[formName],
        inputs: {
          ...state[formName]?.inputs,
          imageUrl,
          file,
        },
      };
    },
    handleVideoUpload: (
      state,
      action: PayloadAction<{
        formName: string;
        videoUrl: string | ArrayBuffer | null;
        videoFile: File | null;
      }>
    ) => {
      const { formName, videoUrl, videoFile } = action.payload;
      state[formName] = {
        ...state[formName],
        inputs: {
          ...state[formName]?.inputs,
          videoUrl,
          videoFile,
        },
      };
    },
    setUploadProgress: (state, { payload }: any) => {
      state.progress = payload;
      if ((state.progress = 100)) {
        state.progress = -1;
      }
    },
  },
});

export const createFormActions = (formName: string, dispatch: any) => ({
  setInputs: (data: any) =>
    dispatch(formSlice.actions.setInputs({ formName, data })),
  clearInputs: () => dispatch(formSlice.actions.clearInputs({ formName })),
  setErrors: (errors: Errors) =>
    dispatch(formSlice.actions.setErrors({ formName, errors })),
  setSubmitted: (submitted: boolean) =>
    dispatch(formSlice.actions.setSubmitted({ formName, submitted })),
  handleInput: ({ name, value }: { name: string; value: any }) =>
    dispatch(
      formSlice.actions.handleInput({
        formName,
        name,
        value,
      })
    ),
  handleToggle: (e: any) =>
    dispatch(
      formSlice.actions.handleToggle({
        formName,
        name: e.target.name,
        checked: e.target.checked,
      })
    ),
  handleFileChange: (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (
      files &&
      files[0] &&
      files[0].type.startsWith("image/") &&
      !files[0].type.startsWith("image/heic")
    ) {
      const reader = new FileReader();
      reader.onload = () => {
        dispatch(
          formSlice.actions.handleFileUpload({
            formName,
            imageUrl: reader.result,
            file: files[0],
          })
        );
      };
      reader.readAsDataURL(files[0]);
    }
  },
  handleVideoChange: (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0] && files[0].type.startsWith("video/")) {
      const reader = new FileReader();
      reader.onload = () => {
        dispatch(
          formSlice.actions.handleVideoUpload({
            formName,
            videoUrl: reader.result,
            videoFile: files[0],
          })
        );
      };
      reader.readAsDataURL(files[0]);
    }
  },
  handleFileDrop: (event: React.DragEvent<HTMLDivElement>) => {
    const files = event.dataTransfer.files;
    if (
      files &&
      files[0] &&
      files[0].type.startsWith("image/") &&
      !files[0].type.startsWith("image/heic")
    ) {
      const reader = new FileReader();
      reader.onload = () => {
        dispatch(
          formSlice.actions.handleFileUpload({
            formName,
            imageUrl: reader.result,
            file: files[0],
          })
        );
      };
      reader.readAsDataURL(files[0]);
    }
  },

  handleVideoDrop: (event: React.DragEvent<HTMLDivElement>) => {
    const files = event.dataTransfer.files;
    if (files && files[0] && files[0].type.startsWith("video/")) {
      const reader = new FileReader();
      reader.onload = () => {
        dispatch(
          formSlice.actions.handleVideoUpload({
            formName,
            videoUrl: reader.result,
            videoFile: files[0],
          })
        );
      };
      reader.readAsDataURL(files[0]);
    }
  },
  handleUploadProgress: (progress: any) =>
    dispatch(formSlice.actions.setUploadProgress(progress)),
});

export const {
  resetForm,
  setIsCreating,
  setIsNotCreating,
  setInputs,
  clearInputs,
  clearErrors,
} = formSlice.actions;
export const formReducer = formSlice.reducer;
