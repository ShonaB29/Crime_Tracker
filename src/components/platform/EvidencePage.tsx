import { useState, useEffect, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Paperclip, Search, Upload, Download, Eye, FileText, 
  Image as ImageIcon, Video as VideoIcon, File as DocIcon, CheckCircle2, 
  Clock, Plus, X, ShieldCheck, AlertCircle, Calendar, User, UserCheck
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export interface EvidenceRecord {
  id: string;
  firNumber: string;
  caseId: string;
  evidenceType: "Image" | "PDF" | "Video" | "Document";
  description: string;
  uploadedBy: string;
  dateTime: string;
  verificationStatus: "Pending" | "Verified" | "Rejected";
  aiSummary: string;
  fileName: string;
  fileSize: string;
}

// Initial mock evidence records
const INITIAL_EVIDENCE: EvidenceRecord[] = [
  {
    id: "EVID-000842-1",
    firNumber: "FIR/K04/000842/2026",
    caseId: "CASE/K04/000001",
    evidenceType: "Image",
    description: "Screenshots of fake bank page login screen used for phishing transfer",
    uploadedBy: "Inspector Rajesh Kumar",
    dateTime: "2026-07-15 14:45:00",
    verificationStatus: "Verified",
    aiSummary: "AI Summary: Scanned spoofed portal asset. Image metadata geolocation coordinates match suspect active IP ranges in Indiranagar.",
    fileName: "phishing_portal_ss.jpg",
    fileSize: "245 KB",
  },
  {
    id: "EVID-000842-2",
    firNumber: "FIR/K04/000842/2026",
    caseId: "CASE/K04/000001",
    evidenceType: "Document",
    description: "UPI reference transactions log bank statement (Ref: 662891)",
    uploadedBy: "SI Patil",
    dateTime: "2026-07-16 09:30:00",
    verificationStatus: "Verified",
    aiSummary: "AI Summary: UPI ledger entry scanned. Confirms transfer of INR 1,50,000 from victim's account to target beneficiary Rajesh M.",
    fileName: "upi_transfer_ledger.txt",
    fileSize: "45 KB",
  },
  {
    id: "EVID-000001-1",
    firNumber: "FIR/K01/000001/2026",
    caseId: "CASE/K01/000001",
    evidenceType: "Video",
    description: "CCTV surveillance footage of back exit gate showing suspect escaping",
    uploadedBy: "SI Patil",
    dateTime: "2026-07-16 10:10:00",
    verificationStatus: "Pending",
    aiSummary: "AI Summary: Thermal night footage parsed. Suspect physical height matches repeat offender database profiles. Face match pending HD resolution.",
    fileName: "cctv_back_exit_loop.mp4",
    fileSize: "14.2 MB",
  },
  {
    id: "EVID-000001-2",
    firNumber: "FIR/K01/000001/2026",
    caseId: "CASE/K01/000001",
    evidenceType: "PDF",
    description: "Forensic fingerprint lifts report from locking clip fragments",
    uploadedBy: "Inspector Rajesh Kumar",
    dateTime: "2026-07-16 10:45:00",
    verificationStatus: "Verified",
    aiSummary: "AI Summary: Latent prints scanned. Lifts matched with 96% accuracy index against Aadhaar ID print files for suspect Naveen Gowda.",
    fileName: "latent_fingerprints_lift.pdf",
    fileSize: "1.8 MB",
  },
];

export function EvidencePage() {
  const [evidenceList, setEvidenceList] = useState<EvidenceRecord[]>([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  
  // Modal state
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [viewingEvidence, setViewingEvidence] = useState<EvidenceRecord | null>(null);

  // Upload Form State
  const [formFir, setFormFir] = useState("");
  const [formCase, setFormCase] = useState("");
  const [formType, setFormType] = useState<EvidenceRecord["evidenceType"]>("Image");
  const [formDesc, setFormDesc] = useState("");
  const [formFile, setFormFile] = useState<File | null>(null);

  // Load and seed evidence list
  useEffect(() => {
    const stored = localStorage.getItem("ksp_evidence");
    if (stored) {
      setEvidenceList(JSON.parse(stored));
    } else {
      localStorage.setItem("ksp_evidence", JSON.stringify(INITIAL_EVIDENCE));
      setEvidenceList(INITIAL_EVIDENCE);
    }
  }, []);

  const saveEvidence = (list: EvidenceRecord[]) => {
    setEvidenceList(list);
    localStorage.setItem("ksp_evidence", JSON.stringify(list));
  };

  // Unique FIR & Case IDs in platform to display as select option suggestions
  const existingFirOptions = ["FIR/K04/000842/2026", "FIR/K01/000001/2026", "FIR/M01/000213/2026"];
  const existingCaseOptions = ["CASE/K04/000001", "CASE/K01/000001", "CASE/M01/000213"];

  const filteredEvidence = useMemo(() => {
    return evidenceList.filter((e) => {
      const matchSearch = 
        e.description.toLowerCase().includes(search.toLowerCase()) ||
        e.firNumber.toLowerCase().includes(search.toLowerCase()) ||
        e.caseId.toLowerCase().includes(search.toLowerCase()) ||
        e.id.toLowerCase().includes(search.toLowerCase());

      const matchType = typeFilter === "All" || e.evidenceType === typeFilter;
      const matchStatus = statusFilter === "All" || e.verificationStatus === statusFilter;

      return matchSearch && matchType && matchStatus;
    });
  }, [evidenceList, search, typeFilter, statusFilter]);

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formFir || !formCase || !formDesc) {
      toast.error("Please fill in all mandatory metadata fields.");
      return;
    }

    const nextIdx = evidenceList.length + 1;
    const dateStr = new Date().toISOString().slice(0, 19).replace("T", " ");
    const filename = formFile?.name ?? `evidence_upload_${nextIdx}.${formType === "PDF" ? "pdf" : formType === "Video" ? "mp4" : formType === "Document" ? "txt" : "jpg"}`;
    const fileSizeStr = formFile ? `${(formFile.size / 1024).toFixed(1)} KB` : "120 KB";

    // Dynamic AI summary simulation
    let aiSummary = `AI Summary: Automatically ingested ${formType} asset. `;
    if (formType === "Image") {
      aiSummary += "Parsed EXIF data. Geolocation matches crime district bounding box.";
    } else if (formType === "PDF" || formType === "Document") {
      aiSummary += "Optical character scanning scanned terms. Text highlights entities relevant to Case file.";
    } else {
      aiSummary += "Frame timeline scan complete. Low manipulation probability index detected.";
    }

    const newEvidence: EvidenceRecord = {
      id: `EVID-${formCase.split("/").pop() || "000000"}-${nextIdx}`,
      firNumber: formFir,
      caseId: formCase,
      evidenceType: formType,
      description: formDesc,
      uploadedBy: "Inspector Rajesh Kumar", // Logged-in default
      dateTime: dateStr,
      verificationStatus: "Pending",
      aiSummary,
      fileName: filename,
      fileSize: fileSizeStr,
    };

    const updated = [newEvidence, ...evidenceList];
    saveEvidence(updated);
    setUploadModalOpen(false);
    toast.success("Evidence asset registered and queued for AI verification!");

    // Clear form
    setFormFir("");
    setFormCase("");
    setFormDesc("");
    setFormFile(null);
  };

  const handleToggleStatus = (id: string, nextStatus: EvidenceRecord["verificationStatus"]) => {
    const updated = evidenceList.map((e) => e.id === id ? { ...e, verificationStatus: nextStatus } : e);
    saveEvidence(updated);
    toast.success(`Evidence status updated to: ${nextStatus}`);
  };

  const getEvidenceIcon = (type: EvidenceRecord["evidenceType"]) => {
    switch (type) {
      case "Image": return <ImageIcon className="h-4.5 w-4.5 text-pink-400" />;
      case "PDF": return <FileText className="h-4.5 w-4.5 text-red-400" />;
      case "Video": return <VideoIcon className="h-4.5 w-4.5 text-amber-400" />;
      case "Document": return <DocIcon className="h-4.5 w-4.5 text-blue-400" />;
    }
  };

  const handleDownload = (ev: EvidenceRecord) => {
    const data = JSON.stringify(ev, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ksp_evidence_${ev.id}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success(`Downloaded asset report for ${ev.id}`);
  };

  // Group evidence by Case ID for timeline visualization
  const selectedCaseTimeline = useMemo(() => {
    if (filteredEvidence.length === 0) return [];
    // Sort chronological (oldest first for timeline)
    return [...filteredEvidence]
      .filter((e) => e.caseId)
      .sort((a, b) => a.dateTime.localeCompare(b.dateTime));
  }, [filteredEvidence]);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
            <Paperclip className="h-6 w-6 text-accent" /> Evidence Management
          </h1>
          <p className="text-sm text-muted-foreground">Register, verify, and examine digital evidence records linked to FIR complaints.</p>
        </div>
        <Button onClick={() => setUploadModalOpen(true)} className="gap-1.5 uppercase font-bold text-xs tracking-wider">
          <Plus className="h-4 w-4" /> Upload Evidence
        </Button>
      </div>

      {/* Search & Filter Controls */}
      <Card className="glass border-white/10 p-5">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 items-end">
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Search details / FIR / Case</label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="pl-9 bg-white/5 border-white/10"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Evidence Type</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="flex h-9 w-full rounded-md border border-white/10 bg-white/5 px-3 py-1 text-sm text-foreground focus-visible:outline-none"
            >
              <option value="All" className="bg-card">All Types</option>
              <option value="Image" className="bg-card">Image</option>
              <option value="PDF" className="bg-card">PDF</option>
              <option value="Video" className="bg-card">Video</option>
              <option value="Document" className="bg-card">Document</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Verification Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex h-9 w-full rounded-md border border-white/10 bg-white/5 px-3 py-1 text-sm text-foreground focus-visible:outline-none"
            >
              <option value="All" className="bg-card">All Statuses</option>
              <option value="Pending" className="bg-card">Pending Verification</option>
              <option value="Verified" className="bg-card">Verified</option>
              <option value="Rejected" className="bg-card">Rejected</option>
            </select>
          </div>

          <Button 
            variant="outline" 
            onClick={() => { setSearch(""); setTypeFilter("All"); setStatusFilter("All"); }}
            className="text-xs text-muted-foreground hover:text-foreground h-9"
          >
            Clear Filters
          </Button>
        </div>
      </Card>

      {/* Main Grid: Library & Timeline */}
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        
        {/* Evidence Assets Table */}
        <Card className="glass border-white/10 p-5 space-y-4">
          <h2 className="font-display text-sm uppercase tracking-widest text-muted-foreground font-semibold">
            Evidence Library ({filteredEvidence.length})
          </h2>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-white/10 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                <tr>
                  <th className="py-3 px-3">Asset / ID</th>
                  <th className="py-3 px-3">FIR & Case</th>
                  <th className="py-3 px-3">Description</th>
                  <th className="py-3 px-3">Verification</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredEvidence.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-xs text-muted-foreground italic">
                      No evidence records cataloged.
                    </td>
                  </tr>
                ) : (
                  filteredEvidence.map((ev) => (
                    <tr key={ev.id} className="text-foreground/90 hover:bg-white/2">
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded bg-white/5 border border-white/8 shrink-0">
                            {getEvidenceIcon(ev.evidenceType)}
                          </div>
                          <div>
                            <span className="font-medium text-foreground text-xs block">{ev.id}</span>
                            <span className="text-[10px] text-muted-foreground">{ev.fileName} ({ev.fileSize})</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="font-semibold text-accent text-xs block">{ev.firNumber}</span>
                        <span className="text-[10px] text-muted-foreground">{ev.caseId}</span>
                      </td>
                      <td className="py-3.5 px-3 max-w-[200px] truncate text-xs text-muted-foreground">
                        {ev.description}
                      </td>
                      <td className="py-3.5 px-3">
                        <span className={cn(
                          "rounded-full px-2 py-0.5 text-[10px] font-semibold border",
                          ev.verificationStatus === "Verified" ? "bg-success/10 border-success/20 text-green-400" :
                          ev.verificationStatus === "Rejected" ? "bg-destructive/10 border-destructive/20 text-red-400" :
                          "bg-amber-500/10 border-amber-500/20 text-amber-400"
                        )}>
                          {ev.verificationStatus}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <div className="flex justify-end gap-1.5">
                          <button
                            onClick={() => setViewingEvidence(ev)}
                            className="p-1 rounded bg-white/5 text-muted-foreground hover:text-foreground hover:bg-white/10"
                            title="Inspect Evidence"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDownload(ev)}
                            className="p-1 rounded bg-white/5 text-muted-foreground hover:text-foreground hover:bg-white/10"
                            title="Download Record"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Chronological Evidence Timeline Panel */}
        <Card className="glass border-white/10 p-5 space-y-4">
          <h2 className="font-display text-sm uppercase tracking-widest text-muted-foreground font-semibold flex items-center gap-1.5">
            <Clock className="h-4.5 w-4.5 text-accent" /> Evidence timeline
          </h2>
          <p className="text-xs text-muted-foreground">Historical order of uploads compiled for selected case investigations.</p>

          <div className="relative pl-4 border-l border-white/15 space-y-5 mt-4">
            {selectedCaseTimeline.length === 0 ? (
              <p className="text-xs text-muted-foreground italic">Filter cases in search to build timeline.</p>
            ) : (
              selectedCaseTimeline.map((item) => (
                <div key={item.id} className="relative text-xs">
                  {/* Timeline Node dot */}
                  <span className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full bg-accent border-2 border-background" />
                  
                  <div className="rounded bg-white/3 p-2.5 border border-white/5">
                    <div className="flex justify-between items-center text-[10px] text-accent mb-1">
                      <span className="font-semibold">{item.dateTime.split(" ")[0]}</span>
                      <span className="rounded bg-white/5 px-1 py-0.5 border border-white/5 text-[8px]">{item.evidenceType}</span>
                    </div>
                    <p className="font-semibold text-foreground text-xs leading-tight mb-1">{item.id}</p>
                    <p className="text-muted-foreground text-[11px] leading-snug">{item.description}</p>
                    <p className="text-[10px] text-muted-foreground/80 mt-1 italic">{item.uploadedBy}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Upload Evidence Modal Dialog */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <Card className="glass border-white/10 w-full max-w-lg p-6 space-y-4 relative animate-scale-in">
            <button 
              onClick={() => setUploadModalOpen(false)}
              className="absolute right-4 top-4 p-1 rounded-full text-muted-foreground hover:bg-white/10 hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="font-display text-lg font-bold text-foreground">Upload Evidence Asset</h3>
            <p className="text-xs text-muted-foreground">Provide investigation references, target FIR filings, and upload files.</p>

            <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-muted-foreground block font-medium">FIR Number</label>
                  <select
                    value={formFir}
                    onChange={(e) => setFormFir(e.target.value)}
                    required
                    className="flex h-9 w-full rounded border border-white/10 bg-transparent px-3 text-foreground focus-visible:outline-none"
                  >
                    <option value="" className="bg-card">Select FIR...</option>
                    {existingFirOptions.map((f) => (
                      <option key={f} value={f} className="bg-card">{f}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-muted-foreground block font-medium">Case ID</label>
                  <select
                    value={formCase}
                    onChange={(e) => setFormCase(e.target.value)}
                    required
                    className="flex h-9 w-full rounded border border-white/10 bg-transparent px-3 text-foreground focus-visible:outline-none"
                  >
                    <option value="" className="bg-card">Select Case...</option>
                    {existingCaseOptions.map((c) => (
                      <option key={c} value={c} className="bg-card">{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-muted-foreground block font-medium">Evidence Asset Type</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as EvidenceRecord["evidenceType"])}
                    className="flex h-9 w-full rounded border border-white/10 bg-transparent px-3 text-foreground focus-visible:outline-none"
                  >
                    <option value="Image" className="bg-card">Image (JPG/PNG)</option>
                    <option value="PDF" className="bg-card">PDF Document</option>
                    <option value="Video" className="bg-card">Video (MP4)</option>
                    <option value="Document" className="bg-card">Document (TXT)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-muted-foreground block font-medium">Attach File Asset</label>
                  <input
                    type="file"
                    onChange={(e) => setFormFile(e.target.files?.[0] ?? null)}
                    className="flex h-9 w-full rounded border border-white/10 bg-transparent px-2.5 py-1 file:bg-white/5 file:border-0 file:rounded file:text-foreground file:text-xs file:font-semibold text-muted-foreground focus-visible:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-muted-foreground block font-medium">Description / Legal Notes</label>
                <textarea
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Details concerning item recovery, parameters, location matching..."
                  required
                  rows={3}
                  className="flex w-full rounded border border-white/10 bg-transparent px-3 py-2 text-foreground focus-visible:outline-none"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <Button type="button" variant="ghost" onClick={() => setUploadModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Upload & Classify
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Inspect Evidence Modal Dialog */}
      {viewingEvidence && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <Card className="glass border-white/10 w-full max-w-2xl p-6 space-y-5 relative animate-scale-in">
            <button 
              onClick={() => setViewingEvidence(null)}
              className="absolute right-4 top-4 p-1 rounded-full text-muted-foreground hover:bg-white/10 hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex gap-3 items-center">
              <div className="p-2 rounded bg-accent/15 border border-accent/20 text-accent">
                {getEvidenceIcon(viewingEvidence.evidenceType)}
              </div>
              <div>
                <h3 className="font-display text-base font-bold text-foreground">Asset Review: {viewingEvidence.id}</h3>
                <p className="text-[10px] text-muted-foreground">Verification status review dashboard</p>
              </div>
            </div>

            {/* Asset Preview Frame */}
            <div className="h-64 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center relative overflow-hidden">
              {viewingEvidence.evidenceType === "Image" ? (
                <div className="h-full w-full bg-cover bg-center flex flex-col justify-end p-4 bg-white/5">
                  <div className="bg-black/70 backdrop-blur border border-white/10 rounded-lg p-3 max-w-xs space-y-1">
                    <p className="font-semibold text-xs text-foreground">phishing_portal_ss.jpg</p>
                    <p className="text-[10px] text-muted-foreground">Traced: Bangalore Cyber PS logs</p>
                  </div>
                </div>
              ) : viewingEvidence.evidenceType === "Video" ? (
                <div className="h-full w-full flex flex-col justify-center items-center text-center p-4 bg-white/3">
                  <VideoIcon className="h-10 w-10 text-amber-400 mb-2 animate-pulse" />
                  <p className="text-xs font-semibold text-foreground">cctv_back_exit_loop.mp4</p>
                  <p className="text-[10px] text-muted-foreground mt-1">Night loop · Segment recovery verified</p>
                </div>
              ) : (
                <div className="h-full w-full flex flex-col justify-center items-center text-center p-4 bg-white/3">
                  <FileText className="h-10 w-10 text-accent mb-2" />
                  <p className="text-xs font-semibold text-foreground">{viewingEvidence.fileName}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">Scan text: "{viewingEvidence.description.slice(0, 80)}..."</p>
                </div>
              )}
            </div>

            {/* Evidence Metadata & AI summary details */}
            <div className="grid gap-4 sm:grid-cols-2 text-xs">
              <div className="space-y-2">
                <h4 className="font-semibold uppercase tracking-wider text-accent text-[10px]">Asset File Details</h4>
                <div className="space-y-1.5">
                  <p className="text-muted-foreground"><Calendar className="inline-block h-3.5 w-3.5 mr-1" /> Filed At: <span className="text-foreground font-semibold">{viewingEvidence.dateTime}</span></p>
                  <p className="text-muted-foreground"><User className="inline-block h-3.5 w-3.5 mr-1" /> Ingested By: <span className="text-foreground font-semibold">{viewingEvidence.uploadedBy}</span></p>
                  <p className="text-muted-foreground"><Paperclip className="inline-block h-3.5 w-3.5 mr-1" /> Linked FIR: <span className="text-foreground font-semibold">{viewingEvidence.firNumber}</span></p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold uppercase tracking-wider text-accent text-[10px]">AI Scanner Analysis</h4>
                <div className="p-3 rounded-lg bg-white/3 border border-white/5 text-[11px] text-muted-foreground leading-relaxed">
                  {viewingEvidence.aiSummary}
                </div>
              </div>
            </div>

            {/* Actions Bar (Change Verification Status) */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-3 border-t border-white/5">
              <div className="flex gap-2">
                <span className="text-[10px] text-muted-foreground self-center uppercase font-bold tracking-wider">Verification status:</span>
                <span className={cn(
                  "rounded px-2 py-0.5 text-[10px] font-bold border",
                  viewingEvidence.verificationStatus === "Verified" ? "bg-success/15 border-success/20 text-green-400" :
                  viewingEvidence.verificationStatus === "Rejected" ? "bg-destructive/15 border-destructive/20 text-red-400" :
                  "bg-amber-500/15 border-amber-500/20 text-amber-400"
                )}>
                  {viewingEvidence.verificationStatus}
                </span>
              </div>

              <div className="flex gap-2">
                {viewingEvidence.verificationStatus !== "Verified" && (
                  <Button 
                    size="sm" 
                    onClick={() => { handleToggleStatus(viewingEvidence.id, "Verified"); setViewingEvidence(null); }}
                    className="bg-green-600 hover:bg-green-500 text-white gap-1 text-[10px] h-8"
                  >
                    <ShieldCheck className="h-3.5 w-3.5" /> Mark Verified
                  </Button>
                )}
                {viewingEvidence.verificationStatus !== "Rejected" && (
                  <Button 
                    size="sm" 
                    variant="destructive"
                    onClick={() => { handleToggleStatus(viewingEvidence.id, "Rejected"); setViewingEvidence(null); }}
                    className="gap-1 text-[10px] h-8"
                  >
                    <AlertCircle className="h-3.5 w-3.5" /> Mark Rejected
                  </Button>
                )}
                <Button size="sm" variant="outline" onClick={() => setViewingEvidence(null)} className="h-8">
                  Close
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
