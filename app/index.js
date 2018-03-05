const changeCase = require('change-case');
const Generator = require('yeoman-generator');
const isVarName = require('is-valid-var-name');

module.exports = class GeneratorBIPBOPTDD extends Generator {
  prompting() {
    return this.prompt([{
      type: 'input',
      name: 'name',
      message: 'Your library name:',
      default: this.appname, // Default to current folder name
    }, {
      type: 'list',
      name: 'type',
      validate: isVarName,
      message: 'What kind of thing your library exports?',
      choices: [
        'class',
        'other (function, dict, string,etc)',
      ],
    }, {
      type: 'input',
      name: 'description',
      message: 'Describe the purpose:',
    }]).then((props) => {
      const { name } = props;
      this.props = Object.assign(props, {
        camelName: changeCase.camelCase(name),
        pascalName: changeCase.pascalCase(name),
        paramName: changeCase.paramCase(name),
        functionName: changeCase[(props.type === 'class' ? 'pascalCase' : 'camelCase')](name),
      });
    });
  }

  install() {
    this.installDependencies({
      npm: false,
      bower: false,
      yarn: true,
    });
  }

  writing() {
    /* Dynamic */
    [
      'lib/index.js',
      'gulpfile.js',
      'tests/library.spec.js',
      'package.json',
    ].forEach(file => this.fs.copyTpl(
      this.templatePath(file),
      this.destinationPath(file), this.props,
    ));

    /* Static */
    [
      './.eslintignore',
      './utils/rollup-generator.js',
      './LICENSE',
      './banner.txt',
      './karma.conf.js',
      './tests/.eslintignore',
      './tests/.eslintrc.js',
      './.travis.yml',
      './.eslintrc.js',
    ].forEach(file => this.fs.copy(
      this.templatePath(file),
      this.destinationPath(file),
    ));
  }
};
