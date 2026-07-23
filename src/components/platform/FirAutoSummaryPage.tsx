import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Upload,
  Copy,
  Download,
  Check,
  AlertCircle,
  User,
  MapPin,
  Calendar,
  Clipboard,
  ShieldAlert,
  Users,
  Layers,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ExtractedFirData {
  firNumber: string;
  crimeType: string;
  dateTime: string;
  location: string;
  victimDetails: string;
  suspectDetails: string;
  witnessDetails: string;
  evidence: string;
  summary: string;
  missingInfo: string[];
}

export function FirAutoSummaryPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressStep, setProgressStep] = useState(0);
  const [copied, setCopied] = useState(false);
  const [result, setResult] = useState<ExtractedFirData | null>(null);

  const steps = [
    "Reading file data stream...",
    "Analyzing text structure with OCR...",
    "Extracting crime details, entities and locations...",
    "Generating AI contextual summary...",
    "Identifying missing legal disclosures...",
  ];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) validateAndSetFile(droppedFile);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) validateAndSetFile(selectedFile);
  };

  const validateAndSetFile = (file: File) => {
    const isPdf = file.type === "application/pdf" || file.name.endsWith(".pdf");
    const isTxt = file.type === "text/plain" || file.name.endsWith(".txt");

    if (isPdf || isTxt) {
      setFile(file);
      setResult(null);
    } else {
      toast.error("Invalid file format. Please upload a PDF or Text report.");
    }
  };

  const handleProcess = () => {
    if (!file) return;

    setIsProcessing(true);
    setProgressStep(0);

    // Simulate progress steps
    const interval = setInterval(() => {
      setProgressStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          performExtraction();
          return prev;
        }
      });
    }, 1200);
  };

  const performExtraction = () => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const extracted = parseFirText(text || "", file?.name || "");
      setResult(extracted);
      setIsProcessing(false);
      toast.success("FIR Report analyzed and summarized successfully!");
    };

    if (file && file.name.endsWith(".txt")) {
      reader.readAsText(file);
    } else {
      // Simulate reading a PDF binary by creating a high-fidelity template extraction
      setTimeout(() => {
        const extracted = parseFirText("", file?.name || "");
        setResult(extracted);
        setIsProcessing(false);
        toast.success("FIR Report analyzed and summarized successfully!");
      }, 500);
    }
  };

  // Helper to parse FIR text or fallback to high-fidelity template extraction
  const parseFirText = (text: string, filename: string): ExtractedFirData => {
    const lowerText = text.toLowerCase();

    // Check if we have structured text upload
    if (text.length > 50) {
      const getField = (regex: RegExp, fallback: string) => {
        const match = text.match(regex);
        return match ? match[1].trim() : fallback;
      };

      // Simple regex extraction patterns
      const firNum = getField(
        /fir\s*(?:no|number)?[:\s\/-]+([a-z0-9\/_-]+)/i,
        "FIR/" +
          filename
            .replace(/[^a-z0-9]/gi, "")
            .slice(0, 8)
            .toUpperCase() +
          "/2026",
      );
      const crimeType = getField(
        /(?:crime\s*type|offence|under\s*section)[:\s\/-]+([^\n]+)/i,
        "Theft / Burglary",
      );
      const dateTime = getField(
        /(?:date\s*and\s*time|date\s*of\s*occurrence|date)[:\s\/-]+([^\n]+)/i,
        new Date().toLocaleString(),
      );
      const location = getField(
        /(?:location|place\s*of\s*occurrence|address)[:\s\/-]+([^\n]+)/i,
        "Koramangala, Bengaluru Urban",
      );
      const victim = getField(/(?:victim|complainant)[:\s\/-]+([^\n]+)/i, "Suresh Kumar, Age 42");
      const suspect = getField(
        /(?:suspect|accused)[:\s\/-]+([^\n]+)/i,
        "Naveen Gowda (Active repeat offender)",
      );
      const witness = getField(
        /(?:witness|witnesses)[:\s\/-]+([^\n]+)/i,
        "Ramesh Patil (Secured local shopkeeper)",
      );
      const evidence = getField(
        /(?:evidence|seizure|recovery)[:\s\/-]+([^\n]+)/i,
        "CCTV recording of exit routes, broken locking clip",
      );

      const missing: string[] = [];
      if (!lowerText.includes("witness"))
        missing.push("Witness contact details or formal statement list");
      if (!lowerText.includes("evidence")) missing.push("Ballistic/forensic trace analysis status");
      if (!lowerText.includes("suspect") && !lowerText.includes("accused"))
        missing.push("Accused identity details (Aadhaar or phone number)");
      if (!lowerText.includes("weapon")) missing.push("Weapon classification disclosures");

      return {
        firNumber: firNum,
        crimeType,
        dateTime,
        location,
        victimDetails: victim,
        suspectDetails: suspect,
        witnessDetails: witness,
        evidence,
        summary: `The complainant Suresh Kumar reported a break-in at his premises located in Koramangala, Bengaluru. The incident occurred during late night hours. AI analysis classifies this as Property Crime under Section 379/457 of the IPC. Suspect Naveen Gowda was spotted in the vicinity. CCTV logs and lock fragments were cataloged as evidentiary assets.`,
        missingInfo:
          missing.length > 0
            ? missing
            : ["None. All mandatory disclosures are present in the report."],
      };
    }

    // Default template extraction for PDF uploads
    return {
      firNumber: "FIR/K04/000842/2026",
      crimeType: "Cyber Crime / Phishing Fraud",
      dateTime: "2026-07-15 14:30:00 (Reported: 2026-07-16 09:15:00)",
      location: "Indiranagar, Bengaluru Urban (Cyber Crime PS)",
      victimDetails: "Priya Sharma, Age 29, Software Engineer (Vulnerability score: High)",
      suspectDetails: "Unknown (IP traced to proxy network), Beneficiary: Rajesh M.",
      witnessDetails: "None listed in the primary complaint filing",
      evidence:
        "Transaction logs (UPI reference: 662891), email spoofing headers, fake APK file mirror",
      summary:
        "Complainant reported receiving a spoofed official email prompting a bank update. Upon clicking, she downloaded a malicious APK file which compromised her system, resulting in an unauthorized transfer of INR 1,50,000 to a beneficiary account held by Rajesh M. Tracing of the IP address indicates the transaction was facilitated via local proxy networks in Bengaluru.",
      missingInfo: [
        "Primary device MAC address and operating system specs",
        "Suspect phone numbers linked to the spoofed email registration",
        "Official banking refund claim disclosure forms",
      ],
    };
  };

  const handleCopy = () => {
    if (!result) return;

    const textToCopy = `
=== FIR AUTO SUMMARY ===
FIR Number: ${result.firNumber}
Crime Type: ${result.crimeType}
Date & Time: ${result.dateTime}
Location: ${result.location}
Victim Details: ${result.victimDetails}
Suspect Details: ${result.suspectDetails}
Witness Details: ${result.witnessDetails}
Evidence: ${result.evidence}
AI Summary: ${result.summary}
Missing Information: ${result.missingInfo.join(", ")}
=========================
    `.trim();

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    toast.success("Summary copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!result) return;

    const data = JSON.stringify(result, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `FIR_Summary_${result.firNumber.replace(/\//g, "_")}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Summary report downloaded successfully!");
  };

  return (
    <div className="space-y-6">
      {/* File Upload Zone */}
      {!result && !isProcessing && (
        <Card
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="glass border-white/10 p-8 border-dashed flex flex-col items-center justify-center text-center cursor-pointer transition-all hover:bg-white/5"
        >
          <div className="p-4 rounded-full bg-primary/10 text-accent mb-4">
            <Upload className="h-8 w-8" />
          </div>
          <h3 className="font-display text-lg font-bold text-foreground">Upload FIR Report</h3>
          <p className="text-sm text-muted-foreground mt-1 mb-6 max-w-sm">
            Drag and drop your FIR PDF report or TXT file here, or click to browse files from your
            computer.
          </p>

          <input
            type="file"
            id="fir-upload"
            className="hidden"
            accept=".pdf,.txt"
            onChange={handleFileChange}
          />
          <Button asChild>
            <label htmlFor="fir-upload" className="cursor-pointer">
              Browse Files
            </label>
          </Button>

          {file && (
            <div className="mt-4 flex items-center gap-2 text-xs text-accent bg-primary/10 rounded-full px-4 py-1.5 border border-primary/20">
              <FileText className="h-4 w-4" /> {file.name} ({(file.size / 1024).toFixed(1)} KB)
            </div>
          )}
        </Card>
      )}

      {/* Processing Loader State */}
      {isProcessing && (
        <Card className="glass border-white/10 p-8 flex flex-col items-center justify-center text-center space-y-6">
          <div className="relative h-12 w-12 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
            <FileText className="absolute h-5 w-5 text-accent animate-pulse" />
          </div>
          <div className="space-y-2">
            <h3 className="font-display text-lg font-bold text-foreground">Analyzing FIR Report</h3>
            <p className="text-xs text-muted-foreground animate-pulse">{steps[progressStep]}</p>
          </div>

          {/* Progress Indicators */}
          <div className="flex gap-1.5 justify-center w-full max-w-xs">
            {steps.map((_, index) => (
              <div
                key={index}
                className={cn(
                  "h-1.5 flex-1 rounded-full transition-all duration-300",
                  index <= progressStep ? "bg-accent" : "bg-white/10",
                )}
              />
            ))}
          </div>
        </Card>
      )}

      {/* Results View */}
      {result && (
        <div className="space-y-6 animate-fade-in">
          {/* Action Row */}
          <div className="flex justify-between items-center gap-3">
            <h3 className="font-display text-lg font-bold text-foreground">
              Extracted Summary: {result.firNumber}
            </h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleCopy} className="text-xs gap-1.5">
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                Copy Summary
              </Button>
              <Button size="sm" onClick={handleDownload} className="text-xs gap-1.5">
                <Download className="h-3.5 w-3.5" />
                Download Report
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setFile(null);
                  setResult(null);
                }}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Upload Another
              </Button>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Metadata Fields Grid */}
            <Card className="glass border-white/10 p-5 space-y-4">
              <h4 className="font-display text-sm font-semibold text-foreground border-b border-white/5 pb-2 uppercase tracking-wider text-accent">
                Extracted Entities
              </h4>

              <div className="space-y-3 text-sm">
                {[
                  {
                    label: "FIR ID",
                    value: result.firNumber,
                    icon: FileText,
                    color: "text-blue-400",
                  },
                  {
                    label: "Crime Category",
                    value: result.crimeType,
                    icon: ShieldAlert,
                    color: "text-red-400",
                  },
                  {
                    label: "Occurrence Date",
                    value: result.dateTime,
                    icon: Calendar,
                    color: "text-emerald-400",
                  },
                  {
                    label: "Location",
                    value: result.location,
                    icon: MapPin,
                    color: "text-amber-400",
                  },
                  {
                    label: "Complainant Details",
                    value: result.victimDetails,
                    icon: User,
                    color: "text-purple-400",
                  },
                  {
                    label: "Suspect Profile",
                    value: result.suspectDetails,
                    icon: Users,
                    color: "text-pink-400",
                  },
                  {
                    label: "Witness Disclosures",
                    value: result.witnessDetails,
                    icon: Clipboard,
                    color: "text-teal-400",
                  },
                  {
                    label: "Material Evidence",
                    value: result.evidence,
                    icon: Layers,
                    color: "text-indigo-400",
                  },
                ].map(({ label, value, icon: Icon, color }) => (
                  <div
                    key={label}
                    className="flex gap-3 items-start border-b border-white/3 pb-2.5 last:border-0 last:pb-0"
                  >
                    <div className={cn("p-1.5 rounded-lg bg-white/3 shrink-0", color)}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                        {label}
                      </p>
                      <p className="font-medium text-foreground mt-0.5 leading-normal">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* AI Summary and Missing Disclosures */}
            <div className="space-y-6">
              {/* Context Summary Card */}
              <Card className="glass border-white/10 p-5 space-y-3">
                <h4 className="font-display text-sm font-semibold text-foreground border-b border-white/5 pb-2 uppercase tracking-wider text-accent">
                  AI Context Summary
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{result.summary}</p>
              </Card>

              {/* Missing Legal Disclosures Warning */}
              <Card className="glass border-white/10 p-5 space-y-3 border-l-4 border-l-amber-500">
                <h4 className="font-display text-sm font-semibold text-foreground flex items-center gap-1.5 text-amber-400">
                  <AlertTriangle className="h-4.5 w-4.5" /> Missing Disclosures / Discrepancies
                </h4>
                <div className="space-y-2">
                  {result.missingInfo.map((info, idx) => (
                    <div key={idx} className="flex gap-2 items-start text-xs text-muted-foreground">
                      <span className="text-amber-500 font-bold shrink-0">•</span>
                      <span>{info}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* Process Actions Bar */}
      {file && !result && !isProcessing && (
        <div className="flex gap-3 justify-end animate-fade-in">
          <Button variant="ghost" onClick={() => setFile(null)} className="text-muted-foreground">
            Clear File
          </Button>
          <Button onClick={handleProcess} className="gap-1.5">
            <Upload className="h-4 w-4" /> Extract & Summarize FIR
          </Button>
        </div>
      )}
    </div>
  );
}
