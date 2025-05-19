
import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import { clearToken, setToken } from "./store";

const IS_DEV = process.env.NODE_ENV === "development";

const SERVICE_PORTS = {
  auth: 3000,
  users: 3000,
  hotel: 3000,
  review: 3000,
} as const;

type Service = keyof typeof SERVICE_PORTS;

const createApiClient = (service: Service): AxiosInstance => {
  const baseURL = IS_DEV
    ? `http://localhost:${SERVICE_PORTS[service]}/api/${service}`
    : `http://localhost:8000/api/${service}`;

    // production code please do not touch this
    //`/api/${service}`;
  const client = axios.create({
    baseURL,
    withCredentials: true, 
  });

  client.interceptors.request.use((config: any) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers!.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  client.interceptors.response.use(
    (response: any) => response,
    (error: any) => {
      if (error.response?.status === 401) {
        localStorage.removeItem("authToken");
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }
  );

  return client;
};

export const authAPI = createApiClient("auth");
export const userAPI = createApiClient("users");
export const restaurantAPI = createApiClient("hotel");
export const reviewAPI = createApiClient("review");

export const signup = async(formdata:any) => {
  const response = await authAPI.post('/sign-up', formdata, {withCredentials:true})
  if(response.status === 201) {
      return response.data;
  }
  return false;
}

export const activateAccount = async (email: string, otp: string): Promise<any> => {
  try {
    const response = await authAPI.post('/activate-account', { email, otp }, { withCredentials: true });

    if (response.status === 200 && response.data.success) {
      setToken( response.data.token);
      return response.data;
    }
    throw new Error(response.data.message || "Activation failed. Please try again.");
  } catch (error: any) {
    console.error("Activation failed:", error);
    throw error;
  }
};

export const resendOTP = async (email: string): Promise<any> => {
  try {
    const response = await authAPI.post("/resend-otp", { email }, { withCredentials: true });
    if (response.status === 200 && response.data.success) {
      return { success: true, message: response.data.message };
    }
    throw new Error(response.data.message || "Failed to resend OTP. Please try again.");
  } catch (error: any) {
    console.error("Resend OTP failed:", error);
    if (axios.isAxiosError(error)) {
      const axiosError = error;
      if (axiosError.response) {
        throw new Error(axiosError.response.data?.message || "An error occurred while resending OTP.");
      }
    }
    throw new Error("An unexpected error occurred while resending OTP.");
  }
};

export const login = async (loginData: { emailOrUsername: string; password: string }) => {
  try {
    const response = await authAPI.post("/login", loginData, { withCredentials: true });

    if (response.status === 200 && response.data.success) {
      setToken( response.data.token);
      return response;
    }

    throw new Error(response.data.message || "Login failed. Please try again.");
  } catch (error: any) {
    console.error("Login failed:", error);
    throw error;
  }
};

export const forgotPassword = async (email: string): Promise<any> => {
  try {
    const response = await authAPI.post("/forgot-password", { email }, { withCredentials: true });

    if (response.status === 200 && response.data.success) {
      return response.data;
    }

    throw new Error(response.data.message || "Failed to send OTP. Please try again.");
  } catch (error: any) {
    console.error("Forgot password failed:", error);
    throw error;
  }
};

export const resetPassword = async ({
  email,
  otp,
  password,
}: {
  email: string;
  otp: string;
  password: string;
}) => {
  try {
    const response = await authAPI.post("/reset-password", { email, otp, password }, { withCredentials: true });

    if (response.status === 200 && response.data.success) {
      return response.data;
    }

    throw new Error(response.data.message || "Password reset failed. Please try again.");
  } catch (error: any) {
    console.error("Password reset failed:", error);
    throw error;
  }
};

export const checkAuth = async (): Promise<boolean> => {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) return false;

    const response = await authAPI.get("/check-auth", { withCredentials: true });

    if (response.data.isAuthenticated) {
      return true;
    }
    const refreshedToken = await refreshToken();
    if (refreshedToken) {
      setToken(refreshedToken); 
      return true;
    }

    return false;
  } catch (error) {
    console.error("Check Auth Failed:", error);
    localStorage.removeItem("authToken");
    return false;
  }
};

export const refreshToken = async (): Promise<string | null> => {
  try {
    const response = await authAPI.post("/refresh-token", {}, { withCredentials: true });
    if (response.data.success) {
      return response.data.token;
    }
    return null;
  } catch (error) {
    console.error("Refresh Token Failed:", error);
    return null;
  }
};

export const logout = async (): Promise<void> => {
  try {
    await authAPI.post("/logout", {}, { withCredentials: true });
    clearToken(); 
    window.location.href = "/"; 
  } catch (error) {
    console.error("Logout failed:", error);
  }
};

export const getUserProfile = async (): Promise<any> => {
  try {
    const userProfile = JSON.parse(localStorage.getItem("userProfile") as string);
    const response = await userAPI.get("/" + userProfile._id); 
    
    return response.data; 
  } catch (error: any) {
    console.error("Get User Profile Failed:", error);
    throw error;
  }
};

export const updateProfile = async (updatedData: any): Promise<any> => {
  try {
    const userProfile = JSON.parse(localStorage.getItem("userProfile") as string);
    const response = await userAPI.put("/"+ userProfile._id, updatedData); 
    if (response.status === 200) {
      return response.data;
    }
    throw new Error(response.data.message || "Failed to update user profile.");
  } catch (error: any) {
    console.error("Update Profile Failed:", error);
    throw error;
  }
};

export const deleteUserAccount = async (): Promise<void> => {
  try {
    const response = await userAPI.delete("/"); 
    if (response.status === 204) {
      window.location.href = "/"; 
    } else {
      throw new Error(response.data.message || "Failed to delete user account.");
    }
  } catch (error: any) {
    console.error("Delete Account Failed:", error);
    throw error;
  }
};

// TypeScript Interfaces for Restaurant Data
// TypeScript Interface for Restaurant Data
export interface Restaurant {
  _id: string;
  hotelName: string;
  rating: number;
  opentime: string;
  ordersCount: number;
  isFeatured: boolean;
  price: string;
  banner: string;
  categoriesprovider: string[];
  image: string;
  featured: boolean;
}

// Fetch Restaurants Function
export const fetchRestaurants = async (
  filters: {
    cuisine?: string[];
    dietary?: string[];
    search?: string;
    location?: string;
    sort?: string;
  } = {}
): Promise<Restaurant[]> => {
  try {
    const params: any = {};

    if (filters.cuisine && filters.cuisine.length > 0) {
      params.cuisine = filters.cuisine.join(",");
    }

    if (filters.dietary && filters.dietary.length > 0) {
      params.dietary = filters.dietary.join(",");
    }

    if (filters.search) {
      params.search = filters.search;
    }

    if (filters.location) {
      params.location = filters.location;
    }

    if (filters.sort) {
      params.sort = filters.sort;
    }

    const response = await restaurantAPI.get("/", { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    throw error;
  }
};

export const fetchRestaurantById = async (restaurantId: string) => {
  try {
    const response = await restaurantAPI.get(`/getById/${restaurantId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching restaurant data:", error);
    throw error;
  }
};

export const fetchRestaurantReviews = async (restaurantId: string) => {
  try {
    const response = await reviewAPI.get(`/ref/${restaurantId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching restaurant reviews:", error);
    throw error;
  }
};

export const createRestaurantReviews = async (data: any) => {
  try {
    const response = await reviewAPI.post(`/`, data);
    return response.data;
  } catch (error) {
    console.error("Error fetching restaurant reviews:", error);
    throw error;
  }
};

// Fetch menu items for a restaurant
export const fetchRestaurantMenuItems = async (restaurantId: string) => {
  try {
    const response = await restaurantAPI.get(`/foods/getById/${restaurantId}`);
    
    return response.data.data;
  } catch (error) {
    console.error("Error fetching restaurant menu items:", error);
    throw error;
  }
};
// Fetch menu items for a restaurant
export const fetchFoodItemById = async (itemId: string) => {
  try {
    const response = await restaurantAPI.get(`/foods/${itemId}`);
    
    return response.data.data;
  } catch (error) {
    console.error("Error fetching restaurant menu items:", error);
    throw error;
  }
};

// Fetch flash deals for a restaurant
export const fetchRestaurantFlashDeals = async (foodId: string) => {
  try {
    const response = await restaurantAPI.get(`/flashDeals/getById/${foodId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching restaurant flash deals:", error);
    throw error;
  }
};


export const getUserProfileById = async (id: string): Promise<any> => {
  try {
    const response = await userAPI.get(`/${id}`); 
    if (response.status === 200) {
      return response.data; 
    }
    throw new Error(response.data.message || "Failed to fetch user profile.");
  } catch (error: any) {
    console.error("Get User Profile Failed:", error);
    throw error;
  }
};


export async function getReviewsByFoodId(foodId: string) { /* backend fetch */ }
export async function fetchRelatedItems(foodId: string) { /* backend fetch */ }
