import { resumes } from "../../constants";
import type { Route } from "./+types/home";
import Navbar from "../components/Navbar";
import ResumeCard from "../components/ResumeCard";
import { usePuterStore } from "~/lib/puter";
import { useNavigate } from "react-router";
import { useEffect } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ScanMe AI" },
    {
      name: "description",
      content:
        "ScanMe AI makes resumes easy to understand, giving recruiters clarity and helping jobseekers shine.",
    },
  ];
}

export default function Home() {
const { auth } = usePuterStore();
const navigate = useNavigate();
  
useEffect(() => {
    if(!auth.isAuthenticated) navigate("/auth?next=/");
    }, [auth.isAuthenticated])

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <Navbar />
      <section className="main-section">
        <div className="page-heading py-10">
          <h1>Reveal the Story Behind Every Resume</h1>
          <h2>
            Understand skills, strengths, and gaps instantly with AI to bring
            clarity for recruiters and confidence for jobseekers.
          </h2>
        </div>

        {resumes.length > 0 && (
          <div className="resumes-section">
            {resumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
