export interface ImageGenerateRequest {
  prompt: string;
  width?: number;
  height?: number;
  style?: string | null;
  negative_prompt?: string | null;
}

export interface ImageGenerateResponse {
  image_base64: string;
  prompt: string;
  width: number;
  height: number;
  style: string | null;
}

export interface StyleInfo {
  name: string;
  title: string;
  titleEn: string;
  image: string;
}

export interface StylesResponse {
  styles: StyleInfo[];
  total: number;
}

export interface ServiceStatus {
  available: boolean;
  status: string;
}

