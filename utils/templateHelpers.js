const { produceEmailAskUserInfo, consumeUserInfoFromEmail } = require("./consumer3")

 const produceAndConsumeEmailUserInfo = async (mails)=>{
    await produceEmailAskUserInfo(mails);
    let consumedData = await consumeUserInfoFromEmail({topic:"mails-user-info"}) 
    return consumedData
 }

 const fillTemplateWithUserInfo = (template,data)=>{
   // Regular expression to match placeholders like ${variable}
  const placeholderRegex = /\${(\w+)}/g;

  // Replace each placeholder in the template with corresponding data
  return template.replace(placeholderRegex, (_, variable) => {
    return data[variable] || ''; // If variable not found, replace with empty string
  });
 }

 module.exports = {
      produceAndConsumeEmailUserInfo,
      fillTemplateWithUserInfo
};