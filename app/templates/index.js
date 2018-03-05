

const yeoman = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');

module.exports = yeoman.generators.Base.extend({
  prompting: () => {
    const done = this.async();
    this.prompt({
      type: 'input',
      name: 'name',
      message: 'Your project name',
      // Defaults to the project's folder name if the input is skipped
      default: this.appname,
    }, (answers) => {
      this.props = answers;
      this.log(answers.name);
      done();
    });
  },
});
