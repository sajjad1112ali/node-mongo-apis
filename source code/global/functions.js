const messages = require('../messages/messages');
module.exports = {
    getResponse: (status, message, data) => {
        return {
            status,
            message: /\s/.test(message) ?  message : messages[message],
            data
        };
    }
  };
  