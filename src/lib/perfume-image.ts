/**
 * Bump this whenever the perfume images in /public/images/perfumes are redrawn.
 * The ?v= tag changes every image URL, so browsers that cached the old pictures fetch the new ones.
 */
export const PERFUME_IMAGE_VERSION = "2";

/** URL of a perfume image, e.g. perfumeImage("rose-eternelle", "notes.svg"). */
export function perfumeImage(slug: string, file: string) {
  return `/images/perfumes/${slug}/${file}?v=${PERFUME_IMAGE_VERSION}`;
}
