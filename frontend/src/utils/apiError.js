import toast from "react-hot-toast";

// Handles both server error responses and network errors (no err.response).
export const notifyError = (error) => {
  toast.error(error.response?.data?.message || error.message || "Something went wrong");
};

// Mutation endpoints (createProject/upload/update/delete) return { message, status }.
export const notifyResult = (data) => {
  if (data.status === 0) {
    toast.error(data.message);
    return false;
  }
  toast.success(data.message);
  return true;
};
