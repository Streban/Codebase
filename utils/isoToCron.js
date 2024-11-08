function isoToCron(isoString) {
    const date = new Date(isoString);
  
    // Get minute, hour, day of month, month, and day of the week
    const minutes = date.getUTCMinutes();
    const hours = date.getUTCHours();
    const dayOfMonth = date.getUTCDate();
    const month = date.getUTCMonth() + 1; // Months are zero-indexed, so add 1
    const dayOfWeek = '*'; // This is optional depending on how specific you want the schedule
  
    // Return the cron expression in the format of "minute hour dayOfMonth month dayOfWeek"
    return `${minutes} ${hours} ${dayOfMonth} ${month} ${dayOfWeek}`;
  }

  function getCronExpression(interval, intervalType) {
    switch (intervalType) {
      case 'minutes':
        return `*/${interval} * * * *`;
      case 'hours':
        return `0 */${interval} * * *`;
      case 'days':
        return `0 0 */${interval} * *`;
      case 'weeks':
        return `0 0 * * ${interval}`;
      default:
        return null;
    }
  }
 module.exports = {
    isoToCron,
    getCronExpression
}