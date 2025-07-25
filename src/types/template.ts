export interface ImagePreview {
  url: string;
  publicId: string;
}

export interface Template {
  _id: string;
  name: string;
  componentName: string;
  category: string;
  price: number;
  isFree: boolean;
  description: string;
  style: string[];
  imagePreview: ImagePreview;
  features: string[];
  demoPath: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TemplateState {
  templates: Template[];
  currentTemplate: Template | null;
  error: string | null;
  success: boolean;
  message: string;
}
