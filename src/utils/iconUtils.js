export const weatherIcons = [
  { icon: "material-symbols:wb-sunny-outline-rounded", name: "sunny" },
  { icon: "lsicon:cloudy-outline", name: "cloudy" },
  { icon: "material-symbols:air-rounded", name: "windy" },
  { icon: "material-symbols:rainy-outline", name: "rainy" },
  { icon: "material-symbols:ac-unit-rounded", name: "snowy" },
];

export const faceIcons = [
  {
    icon: "material-symbols:sentiment-satisfied-outline-rounded",
    name: "satisfied",
  },
  {
    icon: "material-symbols:sentiment-neutral-outline-rounded",
    name: "neutral",
  },
  {
    icon: "material-symbols:sentiment-dissatisfied-outline-rounded",
    name: "dissatisfied",
  },
  { icon: "material-symbols:sentiment-sad-outline-rounded", name: "sad" },
  {
    icon: "material-symbols:sentiment-extremely-dissatisfied-outline-rounded",
    name: "extremely_dissatisfied",
  },
  {
    icon: "material-symbols:sentiment-very-satisfied-outline-rounded",
    name: "extremely_satisfied",
  },
];

export const getIconByName = (icons, name) =>
  icons.find((item) => item.name === name)?.icon || null;
