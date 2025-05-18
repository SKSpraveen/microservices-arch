import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api'; 

// Generic function to make API requests
export const fetchData = async (endpoint : any, method = 'GET', data = null) => {
  try {
    const response = await axios({
      method,
      url: `${BASE_URL}${endpoint}`,
      data,
    });
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    return getMockData(endpoint);
  }
};

const getMockData = (endpoint: any) => {
  switch (endpoint) {
    case '/users/all':
      return [
        {
          id: 1,
          name: "John Doe",
          email: "john@example.com",
          phone: "+1234567890",
          isAuthorized: true,
          status: "active",
          joinedAt: "2023-01-15",
        },
        {
          id: 2,
          name: "Jane Smith",
          email: "jane@example.com",
          phone: "+1987654321",
          isAuthorized: false,
          status: "pending",
          joinedAt: "2023-02-20",
        },
      ];
    case '/hotelOwners':
      return [
        {
          id: 1,
          name: "Frank Wilson",
          email: "frank@example.com",
          phone: "+1222333444",
          status: "active",
          joinedAt: "2023-01-10",
          hotels: 2,
        },
        {
          id: 2,
          name: "Grace Lee",
          email: "grace@example.com",
          phone: "+1555666777",
          status: "active",
          joinedAt: "2023-02-25",
          hotels: 1,
        },
      ];
    case '/drivers':
      return [
        {
          id: 1,
          name: "Driver One",
          email: "driver1@example.com",
          phone: "+1112223333",
          status: "active",
          joinedAt: "2023-01-05",
        },
        {
          id: 2,
          name: "Driver Two",
          email: "driver2@example.com",
          phone: "+1444555666",
          status: "inactive",
          joinedAt: "2023-02-15",
        },
      ];
    default:
      return [];
  }
};