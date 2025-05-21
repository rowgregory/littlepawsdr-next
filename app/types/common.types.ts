import { ChangeEvent, Dispatch, ReactNode, SetStateAction } from "react";

export interface PageWrapperProps {
  children: ReactNode;
}

export type Inputs = {
  [key: string]: string | number | boolean | undefined | any;
};

export type Errors = {
  [key: string]: string;
};

export type SetErrors = (errors: any) => void;

export type UseFormHook = {
  inputs: Inputs;
  errors: Errors;
  handleInput: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelect: (e: ChangeEvent<HTMLSelectElement>) => void;
  handleToggle: (event: ChangeEvent<HTMLInputElement>) => void;
  setInputs: Dispatch<SetStateAction<Inputs>>;
  setErrors: Dispatch<SetStateAction<Errors>>;
  handleUploadProgress: any;
  uploadProgress: number;
  handleDrop: any;
  handleFileChange: any;
  submitted: boolean;
  setSubmitted: Dispatch<SetStateAction<boolean>>;
  loading: boolean;
  setLoading: (loading: boolean) => void;
};

export interface ClientPageProps {
  children: ReactNode;
  data: any;
}

export interface PhotoDropZoneProps {
  inputRef: any;
  image: string;
  name: string;
  maintainAspectRatio: boolean;
  handleDrop: any;
  loading: boolean;
  handleFileChange: any;
}
