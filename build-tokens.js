
const StyleDictionary = require("style-dictionary");
const {
  fileHeader,
  createPropertyFormatter,
  sortByReference
} = require("style-dictionary/lib/common/formatHelpers");


const getStyleDictionaryConfig = (theme, targetDevice) => {
  return {
    source: [
      "tokens/PoliTokens_base_colors.json",
      "tokens/PoliTokens_base_font.json",
      `tokens/PoliTokens_${targetDevice}.json`,
      `tokens/PoliTokens_${theme}.json`,
      "tokens/botao.json"
    ],
    format: {
      "scss/deep-variables": function ({ dictionary, options, file }) {
        const { outputReferences } = options;
        let { allTokens } = dictionary;
        const lineSeparator = "\n";
        if (outputReferences) {
          allTokens = [...allTokens].sort(sortByReference(dictionary));
        }
        const customFormatter = {
          boxShadow: (token) => {
            const { value } = token;
            const newValue = `${value.x}px ${value.y}px ${value.blur}px ${value.color}`;
            return `$${token.name}: ${newValue};`;
          },
          color: (token) => {
            const { name, value } = token;
            return `$${name}: ${value};`;
          }
        };

        function customRemapToken(token) {
          if (customFormatter[token.type]) {
            return customFormatter[token.type](token);
          }
          return createPropertyFormatter({
            outputReferences,
            dictionary,
            format: "sass"
          })(token);
        }

        return (
          fileHeader({ file, commentStyle: "short" }) +
          allTokens
            .map(customRemapToken)
            .filter(function (strVal) {
              return !!strVal;
            })
            .join(lineSeparator)
        );
      }
    },
    platforms: {
      css: {
        transformGroup: "css",
        buildPath: `build/css/${targetDevice}/`,
        files: [
          {
            destination: `${theme}.css`,
            format: "css/variables",
            options: {
              outputReferences: true
            }
          }
        ]
      },
      js: {
        transforms: ["name/cti/camel", "color/css", "size/object"],
        transformGroup: "react-native",
        buildPath: `build/js/${targetDevice}/`,
        isSource: true,
        files: [
          {
            destination: `${theme}.js`,
            format: "javascript/module-flat",
            options: {
              outputReferences: true
            }
          }
        ]
      },
      scss: {
        transformGroup: "scss",
        buildPath: `build/scss/${targetDevice}/`,
        files: [
          {
            destination: `${theme}.scss`,
            format: "scss/deep-variables",
            options: {
              outputReferences: true
            }
          }
        ]
      }
    }
  }
};


const themes = ["dark", "light"];

const targetDevices = ["mob", "web"];

const buildToken = (theme = "light") => {
  targetDevices.forEach((targetDevice) => {
    const config = getStyleDictionaryConfig(theme, targetDevice);
    StyleDictionary.extend(config).buildAllPlatforms();
  });
}

themes.forEach(buildToken)