import toast from "react-hot-toast";

// Create a reusable Snackbar component
export const Snackbar = {
  success: (message: string) => {
    toast.success(message, {
      position: "top-right",
      duration: 3000,
    });
  },
  error: (message: string) => {
    toast.error(message, {
      position: "top-right",
      duration: 3000,
    });
  },
};
