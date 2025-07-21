import { ChangeEventHandler } from "react";

export type Task = {
  _id: string;
  title: string;
  completed: boolean;
};

export type SortOrder = 1 | -1;

export type Filter = {
  keySearch: string;
  sort: Record<string, SortOrder>;
  page: number;
  pageSize: number;
  sessionCode: string;
  sortField?: string;
  sortOrder?: string;
};

export type UserTokenPayload = {
  accessToken: string;
  userId: string;
  exp?: number;
  iat?: number;
};

export type InputFieldProps = {
  name: string;
  type?: string;
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
};

export interface HD_InputProps {
  title?: string;
  isItemForm?: boolean;
  name: string;
  type?: string;
  placeholder?: string;
  iconPosition?: "left" | "right";
  fileStyleVariant?: "style1" | "style2";
  height?: "sm" | "md" | "lg";
  disabled?: boolean;
  icon?: React.ReactNode;
  initValue?: string | number;
  onChange: (value: any) => void;
  oForm_errors?: any[];
  success?: boolean;
  error?: boolean;
  hint?: string;
}

export type LoginProps = {
  email: string;
  password: string;
};
export type Product = {
  name: string;
  price: number;
  categoryId: string;
  descripton: string;
  images: any[];
};

export type ItemReturn = {
  name: string;
  _id: string;
};
export interface HD_TableProps {
  dataInit: Product[];
  viewCallback: (id: string) => void;
  deleteCallback: (item: ItemReturn) => void;
}

export interface imageProps {
  fileName: string;
  imageBase64String: string;
  imageAbsolutePath: string;
  imageFile: any;
  isNewUpload: boolean;
}

export interface ItemPostProps {
  userId: { fullName: string; images: imageProps[]; _id: string };
  createdAt: Date;
  content: string;
  image?: imageProps[];
  hashTags: any[];
  likes: any[];
  comments: any[];
  images: any[];
}
