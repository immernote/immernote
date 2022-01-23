const colors = require("@radix-ui/colors");
const plugin = require("tailwindcss/plugin");

function getColors() {
  let c = {};

  for (let [name, values] of Object.entries(colors)) {
    if (!["gray", "red", "blue", "green", "yellow", "blackA", "whiteA", "amber"].includes(name)) {
      continue;
    }

    for (let k of Object.keys(values)) {
      c[k] = `var(--${k})`;
    }
  }

  return c;
}

module.exports = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: { ...getColors() },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require("@downwindcss/text-decoration"),
    plugin(function ({ addVariant }) {
      addVariant("state-open", "&[data-state='open']");
      addVariant("state-closed", "&[data-state='closed']");
    }),
  ],
};
