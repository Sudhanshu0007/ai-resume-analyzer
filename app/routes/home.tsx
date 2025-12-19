import Navbar from "~/components/Navbar";
import type { Route } from "./+types/home";
import ResumeCard from "~/components/ResumeCard";
import { usePuterStore } from "~/lib/puter";
import { Link , useNavigate } from "react-router";
import { useEffect, useMemo, useState } from "react";


export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Analyxa" },
    { name: "description", content: "Smart resume analyzer!" },
  ];
}

type ResumeWithPaths = Resume & { __imageFsPath?: string; __resumeFsPath?: string; __kvKey?: string };

export default function Home() {
  const { auth, isLoading, fs, kv } = usePuterStore();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<ResumeWithPaths[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const resumeToDelete = useMemo(
    () => resumes.find((r) => r.id === confirmId) || null,
    [confirmId, resumes]
  );

    useEffect(() => {
    if(!auth.isAuthenticated && !isLoading) navigate('/auth?next=/');
  },[auth.isAuthenticated, isLoading])

  useEffect(() => {
    const loadResumes = async () => {
      if (!auth.isAuthenticated) return;
      try {
        setLoading(true);
        // Always fetch keys (not values) to avoid format ambiguity
        const keys = (await kv.list("resume:*")) as string[];
        const uniqueKeys = Array.from(new Set(keys));

        const byId = new Map<string, ResumeWithPaths>();

        for (const key of uniqueKeys) {
          const raw = await kv.get(key);
          if (!raw) continue;
          try {
            const data = JSON.parse(raw);
            const imageFsPath = data?.imagePath as string | undefined;
            const resumeFsPath = data?.resumePath as string | undefined;
            if (imageFsPath) {
              const blob = await fs.read(imageFsPath);
              if (blob) {
                const url = URL.createObjectURL(new Blob([blob]));
                data.imagePath = url; // use blob URL for preview
              }
            }
            const item: ResumeWithPaths = {
              ...(data as Resume),
              __imageFsPath: imageFsPath,
              __resumeFsPath: resumeFsPath,
              __kvKey: key,
            };

            if (data?.id && !byId.has(data.id)) {
              byId.set(data.id, item);
            } else if (data?.id) {
              // Prefer the one with feedback if duplicates exist
              const existing = byId.get(data.id) as ResumeWithPaths | undefined;
              if (existing && !existing.feedback && data.feedback) {
                byId.set(data.id, item);
              }
            }
          } catch {}
        }

        setResumes(Array.from(byId.values()));
      } finally {
        setLoading(false);
      }
    }
    loadResumes();
  }, [auth.isAuthenticated]);

  const handleDelete = async (item: ResumeWithPaths) => {
    if (!auth.isAuthenticated) {
      navigate('/auth?next=/');
      return;
    }
    try {
      setDeletingId(item.id);
      if (item.__resumeFsPath) {
        try { await fs.delete(item.__resumeFsPath); } catch {}
      }
      if (item.__imageFsPath) {
        try { await fs.delete(item.__imageFsPath); } catch {}
      }
      if (item.__kvKey) {
        try { await kv.delete(item.__kvKey); } catch {}
      } else {
        try { await kv.delete(`resume:${item.id}`); } catch {}
      }
      if (item.imagePath && item.imagePath.startsWith('blob:')) {
        try { URL.revokeObjectURL(item.imagePath as unknown as string); } catch {}
      }
      setResumes(prev => prev.filter(r => r.id !== item.id));
    } finally {
      setDeletingId(null);
    }
  };



  return <main className="bg-[url('/images/bg-main.svg')] bg-cover">
    <Navbar />


    <section className="main-section">
      <div className="page-heading py-16">
        <h1>Track Your Applications & Resume Ratings</h1>
        <h2>Analyze and improve your resume with ease</h2>
      </div>



      {loading ? (
        <div className="flex items-center justify-center py-12">
          <img src="/images/resume-scan.gif" className="w-64" />
        </div>
      ) : resumes.length > 0 ? (
        <div className="resumes-section">
          {resumes.map((resume) => (
            <div key={resume.id} className="relative">
              <button
                className="absolute top-2 right-2 bg-white/80 hover:bg-white text-red-600 border border-red-200 rounded p-2 cursor-pointer disabled:opacity-50"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setConfirmId(resume.id); }}
                disabled={deletingId === resume.id}
                title={deletingId === resume.id ? 'Deleting…' : 'Delete review'}
                aria-label="Delete review"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`w-4 h-4 ${deletingId === resume.id ? 'opacity-50' : ''}`}
                >
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                  <path d="M10 11v6" />
                  <path d="M14 11v6" />
                  <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
                </svg>
              </button>
              <ResumeCard resume={resume} />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 py-12">
          <p className="text-gray-600">No reviews yet. Upload a resume to get started.</p>
          <Link to="/upload" className="primary-button">Analyze a Resume</Link>
        </div>
      )}

      {confirmId && resumeToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 flex flex-col gap-4 animate-in fade-in duration-200">
            <h3 className="text-lg font-semibold text-gray-900">Delete this review?</h3>
            <p className="text-gray-600 text-sm">
              {resumeToDelete.companyName || 'This resume review'} will be removed along with its files. This cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded border border-gray-200 text-gray-700 hover:bg-gray-50 cursor-pointer"
                onClick={() => setConfirmId(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 cursor-pointer disabled:opacity-50"
                onClick={async () => {
                  setConfirmId(null);
                  await handleDelete(resumeToDelete);
                }}
                disabled={deletingId === resumeToDelete.id}
              >
                {deletingId === resumeToDelete.id ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

    </section>


  </main>;
}
