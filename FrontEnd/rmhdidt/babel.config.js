module.exports = {
  presets: ['@vue/cli-plugin-babel/preset'],
  plugins: [
    [
      'prismjs',
      {
        languages: [
          'javascript',
          'css',
          'markup',
          'python',
          'bash',
          'graphql',
          'http',
          'json',
          'php',
          'regex',
          'ruby',
          'sass',
          'scss',
          'sql',
          'typescript'
        ],
        plugins: [
          'line-numbers',
          'inline-color',
          'normalize-whitespace',
          'match-braces',
          'keep-markup'
        ],
        theme: 'tomorrow',
        css: true
      }
    ]
  ]
};
