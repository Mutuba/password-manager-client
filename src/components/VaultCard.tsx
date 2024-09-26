import React, {
  useState,
  useContext,
  Dispatch,
  SetStateAction,
  useRef,
  useEffect,
} from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Vault } from "../types/VaultTypes";
import { deleteVault } from "../services/vaultService";
import ConfirmationModal from "../shared/ConfirmationModal";
import VaultModal from "./VaultModal";
import { AuthContext } from "../context/AuthContext";
import Spinner from "../shared/Spinner";
import { FaEllipsisV, FaEdit, FaTrashAlt } from "react-icons/fa";

interface VaultCardProps {
  vault: Vault;
  setVaultsUpdated: Dispatch<SetStateAction<boolean>>;
}

const VaultCard: React.FC<VaultCardProps> = ({ vault, setVaultsUpdated }) => {
  const authContext = useContext(AuthContext);
  const { userToken } = authContext;
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isVaultModalOpen, setIsVaultModalOpen] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isActionsVisible, setIsActionsVisible] = useState(false);

  const ActionsVisibleRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleOutsideClick = (event: MouseEvent) => {
    if (
      ActionsVisibleRef.current &&
      !ActionsVisibleRef.current.contains(event.target as Node)
    ) {
      setIsActionsVisible(false);
    }
  };

  useEffect(() => {
    if (isActionsVisible) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isActionsVisible]);

  const handleDelete = async () => {
    setLoading(true);
    setErrors([]);
    if (!userToken) {
      setErrors(["User token is missing."]);
      setLoading(false);
      return;
    }

    try {
      await deleteVault(userToken, vault.id);
      setIsDeleteModalOpen(false);
      setVaultsUpdated((prev) => !prev);
      const toastId = "delete-success";
      toast.dismiss(toastId);
      toast.success("Vault deleted successfully", {
        toastId,
      });
    } catch (error) {
      setErrors(Array.isArray(error) ? error : [error]);
    } finally {
      setLoading(false);
    }
  };

  const handleAccessVault = () => {
    navigate(`/vault/${vault?.id}/details`);
  };
  return (
    <div className="bg-white border border-gray-300 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300 max-w-sm relative">
      <h3 className="text-xl font-bold text-gray-900 mb-2">
        {loading && <Spinner />}
        {errors.length > 0 && (
          <div className="mb-4">
            <ul className="text-red-500">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}
        {vault?.attributes?.name}
      </h3>
      {vault?.attributes?.description && (
        <p className="text-sm text-gray-700 mb-4 truncate max-w-full leading-relaxed">
          {vault?.attributes?.description}
        </p>
      )}
      <p className="text-sm text-gray-500 mb-1">
        <span className="font-medium">Type:</span>{" "}
        {vault?.attributes?.vault_type}
      </p>
      <p className="text-sm text-gray-500 mb-4">
        <span className="font-medium">Status:</span> {vault?.attributes?.status}
      </p>

      <button
        data-testid="vault-card-access-vault-btn"
        onClick={handleAccessVault}
        className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-700 transition-colors duration-200 w-full text-center"
      >
        Access Vault
      </button>

      <button
        data-testid="ellipsis-action-menu"
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
        onClick={() => setIsActionsVisible(!isActionsVisible)}
      >
        <FaEllipsisV />
      </button>

      {isActionsVisible && (
        <div
          ref={ActionsVisibleRef}
          className="absolute right-3 top-10 bg-white border border-gray-300 rounded-lg shadow-lg z-10"
        >
          <button
            onClick={() => setIsVaultModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
          >
            <FaEdit /> <span>Update Vault</span>
          </button>
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
          >
            <FaTrashAlt /> <span>Delete Vault</span>
          </button>
        </div>
      )}

      {isDeleteModalOpen && (
        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          title="Delete Vault"
          message={
            <>
              Are you sure you want to delete the vault?
              <strong>{vault?.attributes?.name}</strong>? This action cannot be
              undone.
            </>
          }
          onCancel={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDelete}
        />
      )}

      {isVaultModalOpen && (
        <VaultModal
          visible={isVaultModalOpen}
          setModalVisible={setIsVaultModalOpen}
          setVaultsUpdated={setVaultsUpdated}
          setVaults={() => {}}
          vault={vault}
          onClose={() => setIsVaultModalOpen(false)}
        />
      )}
    </div>
  );
};

export default VaultCard;
