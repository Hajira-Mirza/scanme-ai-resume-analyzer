import { prepareInstructions } from "../../constants";
import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import FileUploader from "~/components/FileUploader";
import Navbar from "~/components/Navbar";
import { convertPdfToImage } from "~/lib/pdf2img";
import { usePuterStore } from "~/lib/puter";
import { generateUUID } from "~/lib/utils";

const upload = () => {
  const { auth, isLoading, fs, ai, kv } = usePuterStore();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleFileSelect = (file: File | null) => {
    setFile(file);
  };

  const handleAnalyze = async ({
    jobTitle,
    jobDescription,
    file,
  }: {
    jobTitle: string;
    jobDescription: string;
    file: File;
  }) => {
    setIsProcessing(true);

    setStatusText("Uploading and processing your resume...");
    const uploadedFile = await fs.upload([file]);
    if (!uploadedFile) return setStatusText("Error: file upload failed.");
    setStatusText("Converting to image...");

    const imageFile = await convertPdfToImage(file);
    if (!imageFile.file) return setStatusText("Error: file conversion failed.");
    setStatusText("Uploading image...");

    const uploadedImage = await fs.upload([imageFile.file]);
    if (!uploadedImage) return setStatusText("Error: image upload failed.");
    setStatusText("Preparing AI analysis...");

    const uuid = generateUUID();

    const data = {
      id: uuid,
      resumePath: uploadedFile.path,
      imagePath: uploadedImage.path,
      jobTitle,
      jobDescription,
      feedback: "",
    };
    await kv.set(`resume: ${uuid}`, JSON.stringify(data));
    setStatusText("Running AI analysis...");
    const feedback = await ai.feedback(
      uploadedFile.path,
      prepareInstructions({ jobTitle, jobDescription })
    );
    if (!feedback) return setStatusText("Error: AI resume analysis failed.");
    const feedbackText = typeof feedback.message.content === "string"
    ? feedback.message.content : feedback.message.content[0].text;
    data.feedback = JSON.parse(feedbackText);
    await kv.set(`resume: ${uuid}`, JSON.stringify(data));
    setStatusText("Analysis complete! Redirecting...");
    console.log(data);
  };
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget.closest("form");
    if (!form) return;
    const formData = new FormData(form);
    const jobTitle = formData.get("job-title") as string;
    const jobDescription = formData.get("job-description") as string;
    if (!file) return;
    handleAnalyze({ jobTitle, jobDescription, file });
  };

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <Navbar />
      <section className="main-section">
        <div className="page-heading">
          <h1>Instant Resume Analysis Starts Here</h1>
          {isProcessing ? (
            <>
              <h2>{statusText}</h2>
              <img
                src="/images/resume-scan.gif"
                alt="processing"
                className="w-full"
              />
            </>
          ) : (
            <h2>
              Let ScanMe AI reveal skills, strengths, and gaps in seconds.
            </h2>
          )}
          {!isProcessing && (
            <form
              id="upload-form"
              onSubmit={handleSubmit}
              className="flex flex-col gap-4"
            >
              <div className="form-div">
                <label htmlFor="job-title">Job Title</label>
                <input
                  type="text"
                  name="job-title"
                  id="job-title"
                  placeholder="e.g. Frontend Developer, Project Manager, Data Analyst"
                />
              </div>
              <div className="form-div">
                <label htmlFor="job-description">Job Description</label>
                <textarea
                  rows={6}
                  name="job-description"
                  placeholder="Paste the job description here for a tailored analysis…"
                />
              </div>
              <div className="form-div">
                <label htmlFor="uploader">Upload Resume</label>
                <FileUploader onFileSelect={handleFileSelect} />
              </div>
              <button className="primary-button" type="submit">
                Analyze Resume
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
};

export default upload;
