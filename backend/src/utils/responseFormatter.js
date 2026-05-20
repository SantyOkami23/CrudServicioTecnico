const formatSuccess = (message, data = null) => {
  const response = { success: true, message };
  if (data !== null) response.data = data;
  return response;
};

const formatError = (message, details = null) => {
  const response = { success: false, message };
  if (details !== null) response.error = details;
  return response;
};

module.exports = { formatSuccess, formatError };