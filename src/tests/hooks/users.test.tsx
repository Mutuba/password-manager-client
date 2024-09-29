import { createUser, fetchUsers } from "./users.service";
import axios from "axios";

jest.mock("axios");

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("Users Service", () => {
  beforeEach(() => {
    mockedAxios.get.mockReset();
    mockedAxios.post.mockReset();
  });

  describe("fetchUsers", () => {
    test("makes a GET request to fetch users", async () => {
      const usersMock = [{ id: 1 }, { id: 2 }];

      mockedAxios.get.mockResolvedValue({
        data: usersMock,
      });

      const users = await fetchUsers();

      expect(axios.get).toHaveBeenCalledWith(
        "https://jsonplaceholder.typicode.com/users"
      );
      expect(users).toStrictEqual(usersMock);
    });
  });

  describe("createUser", () => {
    test("makes a POST request to create a new user", async () => {
      const newUserPayload = {
        name: "john doe",
      };

      const newUserMock = {
        id: 1,
        ...newUserPayload,
      };

      mockedAxios.post.mockResolvedValue({
        data: newUserMock,
      });

      const newUser = await createUser(newUserPayload);

      expect(axios.post).toHaveBeenCalledWith(
        "https://jsonplaceholder.typicode.com/users",
        newUserPayload
      );
      expect(newUser).toStrictEqual(newUserMock);
    });
  });
});
