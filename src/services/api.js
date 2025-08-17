// src/services/api.js

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

export const clearAuthToken = () => {
  localStorage.removeItem('userId');
  localStorage.removeItem('email');
};

export const fetchProducts = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/products`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

// Added userId parameter
export const addToCart = async (productId, quantity = 1) => {
  const userId = localStorage.getItem('userId');
  if (!userId) {
    throw new Error("User not logged in. Cannot add to cart.");
  }
  try {
    const response = await fetch(`${API_BASE_URL}/cart?userId=${userId}`, { // userId as query param
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, quantity })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(`HTTP error! status: ${response.status} - ${errorData.message || response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error("Error adding to cart:", error);
    throw error;
  }
};

// Added userId parameter
export const fetchCartItems = async () => {
  const userId = localStorage.getItem('userId');
  if (!userId) {
    throw new Error("User not logged in. Cannot fetch cart items.");
  }
  try {
    const response = await fetch(`${API_BASE_URL}/cart?userId=${userId}`, { // userId as query param
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(`HTTP error! status: ${response.status} - ${errorData.message || response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error("Error fetching cart items:", error);
    throw error;
  }
};

// Added userId parameter
export const removeCartItem = async (productId, quantityToRemove) => {
  const userId = localStorage.getItem('userId');
  if (!userId) {
    throw new Error("User not logged in. Cannot remove cart item.");
  }
  try {
    const response = await fetch(`${API_BASE_URL}/cart/remove?userId=${userId}`, { // userId as query param
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, quantity: quantityToRemove })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(`HTTP error! status: ${response.status} - ${errorData.message || response.statusText}`);
    }
  } catch (error) {
    console.error("Error removing cart item:", error);
    throw error;
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(`HTTP error! status: ${response.status} - ${errorData.message || response.statusText}`);
    }
    const data = await response.json();
    localStorage.setItem('userId', data.userId);
    localStorage.setItem('email', data.email);
    return data;
  } catch (error) {
    console.error("Error during user registration:", error);
    throw error;
  }
};

export const loginUser = async (email, password) => {
  try {
        console.log("Frontend sending login request for email:", email, "with password length:", password.length);
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
          const errorJson = JSON.parse(errorText);
          errorMessage += ` - ${errorJson.message || errorJson.error || 'Unknown Error'}`;
      } catch (e) {
          errorMessage += ` - ${errorText}`;
      }
      throw new Error(errorMessage);
    }
    const data = await response.json();
    localStorage.setItem('userId', data.userId);
    localStorage.setItem('email', data.email);
    return data;
  } catch (error) {
    console.error("Error during user login:", error);
    throw error;
  }
};

export const fetchUserDetails = async () => {
  const userId = localStorage.getItem('userId');
  if (!userId) {
    throw new Error("User not logged in. Cannot fetch user details.");
  }
  try {
    console.log("[Simulated API] Fetching user details (mock data).");
    return new Promise(resolve => setTimeout(() => resolve({
      id: userId, // Use actual userId from localStorage
      name: localStorage.getItem('email'),
      email: localStorage.getItem('email'),
      address: "123 Mock Address, Mock City",
      phone: "555-1234"
    }), 500));
  } catch (error) {
    console.error("Error fetching user details:", error);
    throw error;
  }
};

// Added userId parameter
export const placeOrder = async (cartItems, shippingDetails) => {
  const userId = localStorage.getItem('userId');
  if (!userId) {
    throw new Error("User not logged in. Cannot place order.");
  }

  const orderItems = cartItems.map(item => ({
    productId: item.id,
    quantity: item.quantity
  }));

  try {
    const response = await fetch(`${API_BASE_URL}/orders?userId=${userId}`, { // userId as query param
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ items: orderItems, ...shippingDetails })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(`HTTP error! status: ${response.status} - ${errorData.message || response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error placing order:", error);
    throw error;
  }
};

// Added userId parameter
export const fetchOrderHistory = async () => {
  const userId = localStorage.getItem('userId');
  if (!userId) {
    throw new Error("User not logged in. Cannot fetch order history.");
  }
  try {
    const response = await fetch(`${API_BASE_URL}/orders?userId=${userId}`, { // userId as query param
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(`HTTP error! status: ${response.status} - ${errorData.message || response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching order history:", error);
    throw error;
  }
};
