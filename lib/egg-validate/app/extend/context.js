'use strict';

module.exports = {
  /**
   * validate data with rules
   *
   * @param  {Object} rules  - validate rule object, see [parameter](https://github.com/node-modules/parameter)
   * @param  {Object} [data] - validate target, default to `this.request.body`
   */
  validate(rules, data) {
    data = data || this.request.body;
    const errors = this.app.validator.validate(rules, data);

    if (errors) {
      let err = errors.map(item => {
        return `${item.field} ${item.message}`
      }).join('; ');

      this.throw(400, err);
    }
  },
};
