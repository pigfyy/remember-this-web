import { useDropzone } from "react-dropzone";

const Dropzone = ({ onDrop }) => {
  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop,
      accept: {
        "image/*": [".jpeg", ".png"],
      },
    });

  return (
    <>
      <div
        {...getRootProps()}
        className={`px-8 py-12 border-dashed bg-neutral-200 ${
          !fileRejections.length ? "border-neutral-700" : "border-red-600"
        } border-[2px] rounded-lg`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag and drop some files here, or click to select files</p>
        )}
      </div>
    </>
  );
};

export default Dropzone;
