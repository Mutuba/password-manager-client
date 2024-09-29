import { renderHook, act } from "@testing-library/react";
import { useVaultSubmit } from "../../hooks/useVaultSubmit";
import * as vaultService from "../../services/vaultService";

const userToken = "random-token";
const vaultDataMock = {
  name: "Mock Vault",
  unlock_code: "random-unlock-code",
  description: "A vault to store my password records.",
  vault_type: "business",
  shared_with: [],
  status: "active",
  is_shared: false,
};

const vaultMock = {
  id: "3",
  type: "vault",
  attributes: {
    id: "3",
    name: "Daniel's Vault",
    created_at: new Date(),
    updated_at: new Date(),
    last_accessed_at: new Date(),
    description: "A vault to store my password records.",
    vault_type: "business",
    shared_with: [],
    unlock_code: "random-unlock-code",
    status: "active",
    access_count: 0,
    is_shared: false,
    failed_attempts: 0,
  },
};

const updatedVaultMock = {
  id: "3",
  type: "vault",
  attributes: {
    id: "3",
    name: "Updated vault name",
    created_at: new Date(),
    updated_at: new Date(),
    last_accessed_at: new Date(),
    description: "A vault to store my password records.",
    vault_type: "business",
    shared_with: [],
    unlock_code: "random-unlock-code",
    status: "active",
    access_count: 0,
    is_shared: false,
    failed_attempts: 0,
  },
};

afterEach(() => {
  vi.clearAllMocks();
});

const setVaultsMock = vi.fn();
const onSuccessMock = vi.fn();

describe("useVaultSubmit", () => {
  it("should call createVault and handle the response", async () => {
    const createVaultSpy = vi.spyOn(vaultService, "createVault");
    const { result } = renderHook(() =>
      useVaultSubmit({
        userToken: userToken,
        setVaults: setVaultsMock,
        onSuccess: onSuccessMock,
      })
    );

    createVaultSpy.mockResolvedValue({
      data: vaultMock,
    });

    expect(result.current.errors).toEqual([]);
    expect(result.current.loading).toEqual(false);

    await act(async () => {
      result.current.submitVaultData(vaultDataMock);
      expect(result.current.errors).toEqual([]);
      expect(result.current.loading).toEqual(false);
    });

    expect(createVaultSpy).toHaveBeenCalledWith(userToken, vaultDataMock);

    expect(result.current.errors).toEqual([]);
    expect(result.current.loading).toEqual(false);
    expect(onSuccessMock).toHaveBeenCalledTimes(1);
  });

  it("should call updateVault and handle the response", async () => {
    const updateVaultSpy = vi.spyOn(vaultService, "updateVault");
    const { result } = renderHook(() =>
      useVaultSubmit({
        userToken: userToken,
        vault: vaultMock,
        setVaults: setVaultsMock,
        onSuccess: onSuccessMock,
      })
    );

    updateVaultSpy.mockResolvedValue({
      data: updatedVaultMock,
    });

    expect(result.current.errors).toEqual([]);
    expect(result.current.loading).toEqual(false);

    await act(async () => {
      result.current.submitVaultData(vaultDataMock);
      expect(result.current.errors).toEqual([]);
      expect(result.current.loading).toEqual(false);
    });

    expect(updateVaultSpy).toHaveBeenCalledWith(
      userToken,
      vaultMock.id,
      vaultDataMock
    );

    expect(result.current.errors).toEqual([]);
    expect(result.current.loading).toEqual(false);
    expect(onSuccessMock).toHaveBeenCalledTimes(1);
  });

  it("should return errors when creating vault fails", async () => {
    const createVaultSpy = vi.spyOn(vaultService, "createVault");
    const { result } = renderHook(() =>
      useVaultSubmit({
        userToken: userToken,
        setVaults: setVaultsMock,
        onSuccess: onSuccessMock,
      })
    );

    createVaultSpy.mockRejectedValue("Could not create vault");

    expect(result.current.errors).toEqual([]);
    expect(result.current.loading).toEqual(false);

    await act(async () => {
      await result.current.submitVaultData(vaultDataMock);
    });

    expect(result.current.errors).toEqual(["Could not create vault"]);
    expect(result.current.loading).toEqual(false);
  });

  it("should return errors when updating vault fails", async () => {
    const updateVaultSpy = vi.spyOn(vaultService, "updateVault");
    const { result } = renderHook(() =>
      useVaultSubmit({
        userToken: userToken,
        vault: vaultMock,
        setVaults: setVaultsMock,
        onSuccess: onSuccessMock,
      })
    );

    updateVaultSpy.mockRejectedValue("Could not update vault");

    expect(result.current.errors).toEqual([]);
    expect(result.current.loading).toEqual(false);

    await act(async () => {
      await result.current.submitVaultData(vaultDataMock);
    });

    expect(result.current.errors).toEqual(["Could not update vault"]);
    expect(result.current.loading).toEqual(false);
  });
});
