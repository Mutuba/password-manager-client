import axios from "axios";

const BASE_URL = "https://jsonplaceholder.typicode.com";

export const fetchUsers = async () => {
  return (await axios.get(`${BASE_URL}/users`)).data;
};

export const createUser = async (user: any) => {
  return (await axios.post(`${BASE_URL}/users`, user)).data;
};
