import { ChangeEventHandler } from "react";
import { boolean } from "yup";

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
  userId?: string;
};

export type UserTokenPayload = {
  accessToken: string;
  userId: string;
  id: string;
  fullName?: string;
  email?: string;
  exp?: number;
  iat?: number;
  profilePic?: string;
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
  isVideo?: boolean;
}

export type LikePayload = {
  userId: string;
  postId: string;
  isLike: boolean;
};

export type UserInfo = {
  _id: string;
  fullName: string;
  images: imageProps[];
};

export type CommentPayload = {
  userId: string;
  postId: string;
  content: string;
  parentId?: string;
  createdAt?: string;
};

type TypeResponse = {
  success: boolean;
  data: any;
};
export interface ItemPostProps {
  userId: { fullName: string; images: imageProps[]; _id: string };
  _id: string;
  createdAt: string;
  content: string;
  image?: imageProps[];
  hashTags: any[];
  likes: any[];
  comments: any[];
  images: any[];
  likeCount: number;
  commentCount: number;
  handleLike: (data: LikePayload) => void;
  handleComment: (data: CommentPayload) => void;
  handleDeleteComment?: (id: string) => void;
  isLike: boolean;
}

export interface VariantModalProps {
  open: boolean;
  setOpen: (status: boolean) => void;
  children: any;
  variant: string;
  title?: string;
  onClose: () => void;
  onConfirm: () => void;
  textButtomClose: string;
  textButtomConfirm: string;
  hiddenButtomConfirm: boolean;
  hiddenButtomClose?: boolean;
  size?: string;
}

export interface LikeResponse {
  userId: { fullName: string; images: imageProps[]; _id: string };
  postId: string;
  _id: string;
  createdAt: string;
}
export interface CommentResponse {
  userId: { fullName: string; images: imageProps[]; _id: string };
  postId: string;
  _id: string;
  createdAt: string;
  content: string;
  parentId?: { _id: string; content: string; createdAt: string };
}

export type ChatMessage = {
  role: "user" | "model";
  content: string;
  [key: string]: any; // Nếu có thêm các field khác như time, id, etc.
};

export interface Message {
  id: string;
  message: string;
  user: User;
  timestamp: Date;
}
export interface User {
  id: string;
  username: string;
}

export interface DataProps {
  likes: LikeResponse[];
  comments: CommentResponse[];
}

export interface fakeDataProps {
  isLikePost: boolean;
  fakeLikeNum: number;
  fakeCommentNum: number;
}
