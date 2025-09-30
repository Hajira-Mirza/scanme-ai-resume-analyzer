// import React, { useCallback, useState } from "react";
// import { useDropzone } from "react-dropzone";
// import { formatSize } from "~/lib/utils";

// interface FileUploaderProps {
//   onFileSelect?: (file: File | null) => void;
// }

// const FileUploader = ({ onFileSelect }: FileUploaderProps) => {
//   const onDrop = useCallback(
//     (acceptedFiles: File[]) => {
//       const file = acceptedFiles[0] || null;
//       onFileSelect?.(file);
//     },
//     [onFileSelect]
//   );
//   const { getRootProps, getInputProps, isDragActive, acceptedFiles } =
//     useDropzone({
//       multiple: false,
//       accept: {
//         "application/pdf": [".pdf"],
//         "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
//           [".docx"],
//       },
//       maxFiles: 1,
//       maxSize: 5 * 1024 * 1024, // 5MB
//       onDrop,
//     });

//   const file = acceptedFiles[0] || null;

//   return (
//     <div className="w-full gradient-border">
//       <div {...getRootProps()}>
//         <input {...getInputProps()} />
//         <div className="space-y-4 cursor-pointer">
//           {file ? (
//             <div
//               className="uploader-selected-file flex flex-col"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <div>
//                 <div className="mb-2">
//                   {file.name.toLowerCase().endsWith(".pdf") ? (
//                     <img
//                       src="/images/pdf.png"
//                       alt="PDF"
//                       className="size-12 mx-auto"
//                     />
//                   ) : file.name.toLowerCase().endsWith(".docx") ? (
//                     <img
//                       src="/images/doc.png"
//                       alt="DOCX"
//                       className="size-12 mx-auto"
//                     />
//                   ) : null}
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-700 font-medium truncate">
//                     {file.name}
//                   </p>
//                   <p className="text-sm text-gray-500">
//                     {formatSize(file.size)}
//                   </p>
//                 </div>
//               </div>
//               <button className="p-2 cursor-pointer"
//                 onClick={(e) => {
//                   onFileSelect?.(null);
//                 }}
//               >
//                 <img src="/icons/cross.svg" alt="Remove" className="w-4 h-4" />
//               </button>
//             </div>
//           ) : (
//             <div>
//               <div className="mx-auto w-16 h-16 flex items-center justify-center mb-2">
//                 <img src="/icons/info.svg" alt="upload" className="size-20" />
//               </div>
//               <p className="text-lg text-gray-500">
//                 <span className="font-semibold">Click to upload</span> or drag &
//                 drop your resume
//               </p>
//               <p className="text-sm text-gray-400 mt-2">
//                 Supports PDF and DOCX (max 5MB).
//               </p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FileUploader;


import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { formatSize } from "~/lib/utils";

interface FileUploaderProps {
  onFileSelect?: (file: File | null) => void;
}

const FileUploader = ({ onFileSelect }: FileUploaderProps) => {
  // ✅ Controlled file state
  const [file, setFile] = useState<File | null>(null);

  // Handle file drop
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const f = acceptedFiles[0] || null;
      setFile(f);
      onFileSelect?.(f);
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: false,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
        ".docx",
      ],
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB
    onDrop,
  });

  // ✅ Handle file removal
  const handleRemove = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // prevent triggering dropzone click
    setFile(null);       // clear controlled state
    onFileSelect?.(null);
  };

  return (
    <div className="w-full gradient-border">
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        <div className="space-y-4">
          {file ? (
            <div className="relative uploader-selected-file flex flex-col items-center">
              {/* File preview */}
              <div className="text-center flex flex-col pointer-events-none">
                <div className="mb-2">
                  {file.name.toLowerCase().endsWith(".pdf") ? (
                    <img src="/images/pdf.png" alt="PDF" className="size-12 mx-auto" />
                  ) : file.name.toLowerCase().endsWith(".docx") ? (
                    <img src="/images/doc.png" alt="DOCX" className="size-12 mx-auto" />
                  ) : null}
                </div>
                <p className="text-sm text-gray-700 font-medium truncate">{file.name}</p>
                <p className="text-sm text-gray-500">{formatSize(file.size)}</p>
              </div>

              {/* Remove button */}
              <button
                type="button"
                className="absolute top-2 right-2 p-1 rounded-full bg-white shadow hover:bg-gray-100"
                onClick={handleRemove}
              >
                <img src="/icons/cross.svg" alt="Remove" className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="cursor-pointer text-center">
              <div className="mx-auto w-16 h-16 flex items-center justify-center mb-2">
                <img src="/icons/info.svg" alt="upload" className="size-20" />
              </div>
              <p className="text-lg text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag & drop your resume
              </p>
              <p className="text-sm text-gray-400 mt-2">Supports PDF and DOCX (max 5MB).</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUploader;
