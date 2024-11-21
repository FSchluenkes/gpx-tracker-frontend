"use client";
import { cn } from "@/lib/utils";
import {
  useState,
  type DragEvent,
  forwardRef,
  useEffect,
  ChangeEvent,
} from "react";
import { CloudUpload, Plus } from "lucide-react";
import { Progress } from "./ui/progress";
import { useUploadFile } from "@/app/hooks/use-file-upload";
import { toast } from "sonner";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import { useTheme } from "next-themes";
import { TableHeader } from "./track-table/table-header";

// eslint-disable-next-line
export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {}

const DropZone = forwardRef<HTMLInputElement, InputProps>(
  ({ ...props }, ref) => {
    const [dragActive, setDragActive] = useState(false);
    const [fileList, setFileList] = useState<File[]>([]);
    const { theme } = useTheme();

    const noInput = fileList.length === 0;

    const handleDrag = (e: DragEvent<HTMLFormElement | HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.type === "dragenter" || e.type === "dragover") {
        setDragActive(true);
      } else if (e.type === "dragleave") {
        setDragActive(false);
      }
    };

    const handleDrop = async (e: DragEvent<HTMLLabelElement>) => {
      e.preventDefault();
      e.stopPropagation();

      setDragActive(false);

      // validate file type
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        const files = Array.from(e.dataTransfer.files);
        const validFiles = files.filter((file) => file.name.endsWith(".gpx"));

        if (files.length !== validFiles.length) {
          toast("Only gpx files are allowed.");
        }

        setFileList((prev) => [...prev, ...validFiles]);

        e.dataTransfer.clearData();
      }
    };

    const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();

      if (e.target.files && e.target.files[0]) {
        const files = Array.from(e.target.files);
        const validFiles = files.filter((file) => file.name.endsWith(".gpx"));

        if (files.length !== validFiles.length) {
          toast("Only gpx files are allowed.");
        }

        setFileList((prev) => [...prev, ...validFiles]);
      }
    };

    return (
      <form
        onSubmit={(e) => e.preventDefault()}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        className="flex h-full items-center w-full justify-start bg-background dark:bg-background overflow-hidden"
      >
        <label
          htmlFor="dropzone-file"
          className={cn(
            "relative h-full flex flex-col items-center justify-center w-full border border-solid rounded-lg",
            {
              "dark:bg-muted": dragActive,
              "border-2 border-dashed": noInput,
            }
          )}
          onDrop={handleDrop}
        >
          {noInput ? (
            <>
              <div className="absolute inset-0 cursor-pointer" />
              <div className="h-full flex flex-col items-center justify-center w-full p-4 gap-4">
                <p className="text-xl">Drop Files here</p>
                <CloudUpload size={64} />
                <input
                  {...props}
                  ref={ref}
                  multiple
                  onChange={handleChange}
                  accept=".gpx"
                  id="dropzone-file"
                  type="file"
                  className="hidden"
                />
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col w-full h-full overflow-hidden rounded-lg">
                <OverlayScrollbarsComponent
                  className="w-full h-full overflow-auto flex flex-col"
                  element="div"
                  options={{
                    scrollbars: {
                      theme:
                        theme === "light" ? "os-theme-dark" : "os-theme-light",
                      autoHide: "scroll",
                    },
                  }}
                  defer
                >
                  <div className={cn("flex flex-col w-full h-full")}>
                    <table className="min-w-full">
                      <thead className="sticky top-0 z-10 opacity-100">
                        <tr className="">
                          <TableHeader>Name</TableHeader>
                          <TableHeader>Size</TableHeader>
                          <TableHeader>Status</TableHeader>
                        </tr>
                      </thead>
                      <tbody className="relative">
                        {fileList.map((file, index) => (
                          <Row file={file} key={index} className="" />
                        ))}
                      </tbody>
                    </table>

                    <label
                      htmlFor="dropzone-file"
                      className="relative cursor-pointer group hover:bg-muted dark:hover:bg-muted transition flex justify-center py-2 rounded-lg"
                    >
                      <Plus size={24} />
                      <input
                        {...props}
                        ref={ref}
                        multiple
                        onChange={handleChange}
                        accept=".gpx"
                        type="file"
                        id="dropzone-file"
                        className="relative z-20 hidden"
                      />
                      <div className="absolute inset-0" />
                    </label>
                  </div>
                </OverlayScrollbarsComponent>
              </div>
            </>
          )}
        </label>
      </form>
    );
  }
);

interface RowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  file: File;
}

interface FileResponseData {
  error?: boolean;
  message?: string;
}

const Row = forwardRef<HTMLTableRowElement, RowProps>(
  ({ file, className, ...props }, ref) => {
    const { data, progress, error } = useUploadFile<FileResponseData>(
      process.env.NEXT_PUBLIC_API_UPLOAD,
      file,
      {
        disabled:
          process.env.NODE_ENV === "development" &&
          process.env.NEXT_PUBLIC_DISABLE_UPLOAD === "true",
      }
    );

    useEffect(() => {
      if (data?.message) {
        toast(data.message);
      }
    }, [data]);

    return (
      <tr ref={ref} {...props} className={cn("group", className)}>
        <td className="px-4 py-2 truncate whitespace-normal text-sm font-medium text-foreground dark:text-foreground group-hover:hover:bg-muted group-hover:dark:bg-muted first:rounded-l-lg last:rounded-r-lg">
          <p
            className={cn("text-foreground dark:text-foreground", {
              "text-red-500 dark:text-red-500": error,
            })}
          >
            {file.name}
          </p>
        </td>
        <td
          className={cn(
            "px-4 py-2 whitespace-nowrap text-sm text-foreground dark:text-foreground group-hover:hover:bg-muted group-hover:dark:bg-muted first:rounded-l-lg last:rounded-r-lg",
            {
              "text-red-500 dark:text-red-500": error,
            }
          )}
        >
          {(file.size / 1000).toFixed(0)} KB
        </td>
        <td className="px-4 py-2 whitespace-nowrap text-sm text-foreground dark:text-foreground group-hover:hover:bg-muted group-hover:dark:bg-muted first:rounded-l-lg last:rounded-r-lg">
          <Progress
            className={cn("w-full h-2")}
            value={progress}
            isError={error}
          />
        </td>
      </tr>
    );
  }
);

DropZone.displayName = "DropZone";
Row.displayName = "Row";
export { DropZone };
