import apiClient from '../apiClient';
export const fetchdrawingRequest = async () => {
    try {
      const response = await apiClient.get(`new/drawingRequest/`); // Send the GET request to the server
  
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
export const fetchNexrequest_no = async () => {
    try {
      const response = await apiClient.get(`new/drawingRequest/nextRequest_no/`); // Send the GET request to the server
  
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
// export const postRequest = async (payload) => {
//     try {
//       const response = await apiClient.post(`new/postdrawingRequest/`, payload); // Send the GET request to the server
  
//       // Check the response's 'success' field to determine if the request was successful
//       if (response.data.success) {
//         // If successful, return the 'data' part of the response
//         return response.data; // Assuming 'data' contains the users
//       } else {
//         // If success is false, throw an error with the server message
//         throw new Error(response.data.msg);
//       }
//     } catch (error) {
//       // Catch and rethrow the error with a message from the server or a generic one
//       throw new Error(error.response?.data?.msg);
//     }
// };
export const fetchRequestdateItems = async (payload) => {
    try {
      const response = await apiClient.post(`new/drawingRequestdateItems/`, payload); // Send the GET request to the server
  
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

export const postRequest = async (formData) => {
  try {
    const response = await apiClient.post(
      'new/postdrawingRequest/',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );

    if (response.data.success) {
      return response.data;
    } else {
      throw new Error(response.data.msg);
    }
  } catch (error) {
    throw new Error(error.response?.data?.msg || error.message);
  }
};
