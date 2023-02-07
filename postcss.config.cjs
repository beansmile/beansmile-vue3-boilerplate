module.exports = () => {
  return {
    plugins: {
      // https://www.npmjs.com/package/postcss-px-to-viewport-8-plugin
      'postcss-px-to-viewport-8-plugin': {
        unitToConvert: 'px',
        viewportWidth: 1600, // 暂时改动，具体后续定
        unitPrecision: 5,
        propList: ['*'],
        viewportUnit: 'rem',
        fontViewportUnit: 'rem',
        selectorBlackList: [],
        minPixelValue: 1,
        mediaQuery: true,
        replace: true,
        exclude: [/node_modules/],
        include: undefined,
        landscape: false,
      },
    },
  };
};
