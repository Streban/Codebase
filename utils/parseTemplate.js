const parseTemplate = (template = "", fields = [], data = {}) => {
  fields.forEach((key) => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    template = template.replace(regex, data[key]);
  });
  return template;
};
  
module.exports = {
  parseTemplate,
};
