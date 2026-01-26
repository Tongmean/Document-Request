import apiClient from '../apiClient';
export const fetchdrawingResponse = async () => {
    try {
      const response = await apiClient.get(`new/drawingResponse/`); // Send the GET request to the server
  
      // Check the response's 'success' field to determine if the request was successful
      if (response.data.success) {
        // If successful, return the 'data' part of the response
        return response.data; // Assuming 'data' contains the users
      } else {
        // If success is false, throw an error with the server message
        throw new Error(response.data.msg);
      }
    } catch (error) {
      // Catch and rethrow the error with a message from the server or a generic one
      throw new Error(error.response?.data?.msg);
    }
};