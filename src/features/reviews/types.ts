/**
 * Review photos are optional today. When uploads are added, store the file in
 * object storage (S3, Cloudinary, Supabase Storage, ...) and save the URL here.
 */
export interface ReviewPhoto {
  id: string;
  url: string;
  alt: string;
}

export interface Review {
  id: string;
  perfumeId: string;
  author: string;
  /** 1 to 5 */
  rating: number;
  title: string;
  comment: string;
  createdAt: string;
  verifiedPurchase: boolean;
  photos: ReviewPhoto[];
}

export interface RatingSummary {
  average: number;
  total: number;
  /** Count of reviews per star value, index 0 = 1 star, index 4 = 5 stars */
  distribution: [number, number, number, number, number];
}
