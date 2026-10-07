/**
 * Path data from /public/brand/seven_black.svg (viewBox 0 0 840 139), grouped by letter
 * so the hero can animate each letter on its own. Keep in sync with the SVG files.
 */
export const LOGO_VIEWBOX = "0 0 840 139";

export const LOGO_LETTERS: { id: string; paths: string[] }[] = [
  { id: "7", paths: ["M 123 1 L 1 1 L 1 14 L 102 15 L 18 137 L 36 137 L 123 11 Z"] },
  {
    id: "E",
    paths: [
      "M 186 1 L 186 15 L 297 15 L 298 1 Z",
      "M 186 61 L 187 76 L 297 76 L 297 61 Z",
      "M 186 122 L 187 137 L 297 137 L 297 122 Z",
    ],
  },
  { id: "V", paths: ["M 346 1 L 411 135 L 413 137 L 430 137 L 495 1 L 477 1 L 426 110 L 421 118 L 365 2 Z"] },
  {
    id: "Y",
    paths: ["M 531 1 L 591 84 L 591 136 L 607 137 L 607 79 L 552 2 Z", "M 667 1 L 648 1 L 610 53 L 610 55 L 619 67 Z"],
  },
  {
    id: "N",
    paths: ["M 708 1 L 708 136 L 724 136 L 724 27 L 726 26 L 820 137 L 837 137 L 837 1 L 821 1 L 820 112 L 726 1 Z"],
  },
];
