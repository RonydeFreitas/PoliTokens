// chama o modulo Tinycolor2
const Color = require("tinycolor2");

//transforma cores HEX em RGB
StyleDictionary.registerTransform({
  name: "color/css",
  type: "value",
  matcher: function (prop) {
    return prop.attributes.category === "color";
  },
  transformer: function (prop) {
    var color = Color(prop.value);
    if (color.getAlpha() === 1) {
      return color.toHexString();
    } else {
      return color.toRgbString();
    }
  },
});

//registra o formato da chave de sombra
StyleDictionary.registerTransform({
  name: "shadow/css",
  type: "value",
  matcher: function (token) {
    return token.type === "boxShadow";
  },
  transformer: (token) => {
    const shadows = Object.values(token.value);
    const result = shadows.map(
      (shadow) =>
        `${shadow.x} ${shadow.y} ${shadow.blur} ${shadow.spread} ${shadow.color}`
    );
    return result.join(",");
  },
});