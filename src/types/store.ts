export interface StoreConfig {
  name: string;
  logo_url: string;
  background_image_url: string;
  color_hex: string;
  description?: string;
  category?: string;
  default_questions?: string[];
}

export interface StoreResponse {
  data: StoreConfig;
  message: string;
}