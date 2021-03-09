const Handlebars = require("hbs");

Handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {

  switch (operator) {
      case '==':
          return (v1 == v2) ? options.inverse(this) : options.fn(this);
      case '===':
          return (v1 === v2) ? options.inverse(this) : options.fn(this);
      case '!=':
          return (v1 != v2) ? options.inverse(this) : options.fn(this);
      case '!==':
          return (v1 !== v2) ? options.inverse(this) : options.fn(this);
      case '<':
          return (v1 < v2) ? options.inverse(this) : options.fn(this);
      case '<=':
          return (v1 <= v2) ? options.inverse(this) : options.fn(this);
      case '>':
          return (v1 > v2) ? options.inverse(this) : options.fn(this);
      case '>=':
          return (v1 >= v2) ? options.inverse(this) : options.fn(this);
      case '&&':
          return (v1 && v2) ? options.inverse(this) : options.fn(this);
      case '||':
          return (v1 || v2) ? options.inverse(this) : options.fn(this);
      default:
          return options.fn(this);
  }
});
