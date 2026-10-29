// Yahan se flavors, prices aur text badlo. Baqi site khud update ho jayegi.
// label = poora wrap-around label artwork (public/labels/)
// faceU = label ka woh hissa (0 se 1) jahan SEPELA brand hai, taake can ka front wahi dikhe
export const CURRENCY = "Rs";
export const PACKS = [4, 6, 12];

export const products = [
  {
    id: "pink-gin",
    name: "Pink Gin & Tonic",
    label: "/labels/pink-gin.jpg",
    faceU: 0.499,
    bg: "#ecc9d3",
    pricePerCan: 450,
    abv: "7% Vol.",
    size: "250 ml",
    blurb: "Crisp gin, a blush of pink and a clean tonic finish. Cold, light and easy to finish.",
  },
  {
    id: "rum-ginger-lime",
    name: "Rum & Ginger and Lime",
    label: "/labels/rum-ginger-lime.jpg",
    faceU: 0.506,
    bg: "#d7dbab",
    pricePerCan: 450,
    abv: "7% Vol.",
    size: "250 ml",
    blurb: "Smooth rum with a spicy ginger bite and fresh lime. Bright, warm and sharp.",
  },
  {
    id: "whisky-cola",
    name: "Whisky & Cola",
    label: "/labels/whisky-cola.jpg",
    faceU: 0.509,
    bg: "#d8b17a",
    pricePerCan: 450,
    abv: "7% Vol.",
    size: "250 ml",
    blurb: "A classic pour: mellow whisky over cola, ready to drink straight from the can.",
  },
];
