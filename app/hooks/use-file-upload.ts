import { useEffect, useReducer, useRef } from "react";
import axios from "axios";
import { toast } from "sonner";

interface State<T> {
  data?: T;
  isLoading: boolean;
  progress?: number;
  error?: boolean;
}

type Action<T> =
  | { type: "loading" }
  | { type: "fetched"; payload: T }
  | { type: "error"; payload: boolean }
  | { type: "progress"; payload: number };

type Options = {
  disabled: boolean | undefined;
};

export const useUploadFile = <T = unknown>(
  url: string | undefined,
  file: File | undefined,
  options: Options
) => {
  const { disabled } = options;

  const cancelRequest = useRef<boolean>(false);

  const initialState: State<T> = {
    error: undefined,
    isLoading: false,
    progress: undefined,
    data: undefined,
  };

  const fetchReducer = (state: State<T>, action: Action<T>): State<T> => {
    switch (action.type) {
      case "loading":
        return { ...state, isLoading: true };
      case "fetched":
        return { ...state, data: action.payload, isLoading: false };
      case "error":
        return { ...state, error: action.payload, isLoading: false };
      case "progress":
        return { ...state, progress: action.payload };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(fetchReducer, initialState);

  useEffect(() => {
    if (!url || !file || disabled) return;

    cancelRequest.current = false;

    const uploadFile = async () => {
      dispatch({ type: "loading" });

      try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await axios.post(url, formData, {
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total!
            );
            dispatch({ type: "progress", payload: percentCompleted });
          },
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: false,
        });

        const data = res.data as T;
        if (cancelRequest.current) return;

        dispatch({ type: "fetched", payload: data });
        dispatch({ type: "error", payload: false });
      } catch (error) {
        if (cancelRequest.current) return;

        if (axios.isAxiosError(error) && error.response) {
          const errorMessage =
            error.response.data?.error || "Something went wrong!";
          toast(errorMessage);
        } else {
          console.error("Unexpected error:", error);
          toast("Something went wrong!");
        }

        dispatch({ type: "error", payload: true });
      }
    };

    void uploadFile();

    return () => {
      cancelRequest.current = true;
    };
  }, [url, file, disabled]);

  return state;
};
