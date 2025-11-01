"use client";

import { useMeetings } from "@/hooks/useMeetings";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Upload,
  FileText,
  Users,
  Calendar,
  Clock,
  X,
  Plus,
  Bot,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Snackbar } from "@/components/common/Snackbar";

const sampleParticipants = [
  { name: "John Doe", email: "john@example.com", role: "Product Manager" },
  { name: "Jane Smith", email: "jane@example.com", role: "Designer" },
  { name: "Mike Johnson", email: "mike@example.com", role: "Developer" },
];

export default function UploadMeetingPage() {
  const [participants, setParticipants] = useState(sampleParticipants);
  const [autoExtract, setAutoExtract] = useState(true);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const { uploadMeeting, isUploading } = useMeetings();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const addParticipant = () => {
    setParticipants([...participants, { name: "", email: "", role: "" }]);
  };

  const removeParticipant = (index: number) => {
    setParticipants(participants.filter((_, i) => i !== index));
  };

  const updateParticipant = (index: number, field: string, value: string) => {
    const updated = [...participants];
    updated[index] = { ...updated[index], [field]: value };
    setParticipants(updated);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setUploadedFile(file);
    }
  };

  const handleProcessMeeting = async () => {
    if (!uploadedFile) {
      setError("Please upload a file first.");
      return;
    }
    setError(null);
    setIsProcessing(true);
    try {
      await uploadMeeting(uploadedFile);

      // Handle success (e.g., show a success message or redirect)
      Snackbar.success("Meeting uploaded successfully!");
      router.push("/dashboard");
    } catch (e) {
      // Error is already handled in the hook, but you can add page-specific logic here
      setError("An error occurred while processing the meeting.");
      Snackbar.error("An error occurred while processing the meeting.");
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Upload New Meeting</h1>
        <p className="text-muted-foreground">
          Upload a meeting transcript and let AI extract action items
          automatically
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Meeting Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Meeting Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* <div className="space-y-2">
                <Label htmlFor="title">Meeting Title</Label>
                <Input id="title" placeholder="e.g., Product Strategy Review" />
              </div> */}

              {/* <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input id="date" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <Input id="time" type="time" />
                </div>
              </div> */}

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of the meeting..."
                  className="h-20"
                />
              </div>
            </CardContent>
          </Card>

          {/* File Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Upload className="h-5 w-5" />
                <span>Upload Transcript</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <div className="space-y-2">
                  <p className="text-lg font-medium">Drop your files here</p>
                  <p className="text-sm text-muted-foreground">
                    Supports TXT, PDF, DOC, and DOCX files
                  </p>
                  <Input
                    type="file"
                    accept=".txt,.pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={handleFileChange}
                    className="pt-2"
                  />
                </div>
              </div>

              {uploadedFile && (
                <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
                  <FileText className="h-4 w-4" />
                  <span className="flex-1 truncate">{uploadedFile.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setUploadedFile(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}

              {/* <div className="flex items-center space-x-2 p-4 border rounded-lg">
                <Bot className="h-5 w-5 text-primary" />
                <div className="flex-1">
                  <div className="font-medium">AI-Powered Processing</div>
                  <div className="text-sm text-muted-foreground">
                    Automatically extract action items and key insights from your transcript
                  </div>
                </div>
                <Switch checked={autoExtract} onCheckedChange={setAutoExtract} />
              </div> */}
            </CardContent>
          </Card>

          {/* Participants */}
          {/* <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Participants</span>
                </div>
                <Button variant="outline" size="sm" onClick={addParticipant}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Participant
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
                <Bot className="h-4 w-4 text-blue-600" />
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Participants can be automatically extracted from the
                  transcript or manually added below.
                </p>
              </div>

              {participants.map((participant, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-4 p-4 border rounded-lg"
                >
                  <Avatar>
                    <AvatarFallback>
                      {participant.name
                        ? participant.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                        : "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 grid grid-cols-3 gap-3">
                    <Input
                      placeholder="Full Name"
                      value={participant.name}
                      onChange={(e) =>
                        updateParticipant(index, "name", e.target.value)
                      }
                    />
                    <Input
                      placeholder="Email"
                      value={participant.email}
                      onChange={(e) =>
                        updateParticipant(index, "email", e.target.value)
                      }
                    />
                    <Input
                      placeholder="Role"
                      value={participant.role}
                      onChange={(e) =>
                        updateParticipant(index, "role", e.target.value)
                      }
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeParticipant(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card> */}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* <Card>
            <CardHeader>
              <CardTitle>Processing Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span className="text-sm">Upload ready</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-gray-300"></div>
                <span className="text-sm">Transcript analysis</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-gray-300"></div>
                <span className="text-sm">Action item extraction</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-gray-300"></div>
                <span className="text-sm">Final review</span>
              </div>
            </CardContent>
          </Card> */}

          {/* <Card>
            <CardHeader>
              <CardTitle>AI Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Auto-extract participants</span>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Generate action items</span>
                <Switch
                  checked={autoExtract}
                  onCheckedChange={setAutoExtract}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Key insights summary</span>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Meeting sentiment analysis</span>
                <Switch />
              </div>
            </CardContent>
          </Card> */}

          <div className="space-y-3">
            <Button
              className="w-full"
              size="lg"
              onClick={handleProcessMeeting}
              disabled={isUploading || !uploadedFile}
            >
              {isUploading ? "Processing..." : "Process Meeting"}
            </Button>
            {/* <Button variant="outline" className="w-full">
              Save as Draft
            </Button> */}
          </div>
        </div>
      </div>
    </div>
  );
}
