'use client';

import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { Button, Input, Card, Modal } from '@/components/ui';
import { useState } from 'react';
import { Upload as UploadIcon, File, X } from 'lucide-react';
import Link from 'next/link';

export default function UploadPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [title, setTitle] = useState('');

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;
    setIsUploading(true);
    // Simulate upload
    setTimeout(() => {
      setIsUploading(false);
      setIsComplete(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar activePath="/upload" />
      <div className="flex-1 flex flex-col">
        <Header title="Upload Contract" />
        <main className="flex-1 p-6">
          <div className="max-w-2xl mx-auto">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-primary">Upload New Contract</h2>
              <p className="text-gray-600 text-sm mt-1">
                Upload a contract document to begin processing
              </p>
            </div>

            {!isComplete ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <Input
                    placeholder="e.g., Acme Services Agreement"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Document
                  </label>
                  <div
                    onDrop={handleDrop}
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onClick={() => document.getElementById('file-input')?.click()}
                    className={`
                      border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
                      transition-colors
                      ${isDragging ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary/50'}
                    `}
                  >
                    <UploadIcon className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                    <p className="text-gray-600 font-medium">
                      {selectedFile ? selectedFile.name : 'Drag and drop your file here'}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {selectedFile
                        ? `${(selectedFile.size / 1024).toFixed(1)} KB`
                        : 'PDF, DOCX, or other formats'}
                    </p>
                    <input id="file-input" type="file" className="hidden" onChange={(e) => {
                      if (e.target.files) setSelectedFile(e.target.files[0]);
                    }} />
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button type="submit" disabled={!selectedFile || isUploading}>
                    {isUploading ? 'Uploading...' : 'Upload Contract'}
                  </Button>
                  <Button variant="ghost" asChild>
                    <Link href="/contracts">Cancel</Link>
                  </Button>
                </div>
              </form>
            ) : (
              <Card>
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <UploadIcon className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-primary mb-2">
                    Upload Complete
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Your contract "{title || selectedFile?.name}" has been uploaded and is being processed.
                  </p>
                  <div className="flex gap-3 justify-center">
                    <Button asChild>
                      <Link href="/contracts">View All Contracts</Link>
                    </Button>
                    <Button variant="ghost" asChild>
                      <Link href="/upload">Upload Another</Link>
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}