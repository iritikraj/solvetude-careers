/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { updateJobDetails } from '@/actions/job-management';
import dynamic from 'next/dynamic';
import { ArrowLeft, Loader2, Save, Plus, Trash2, Lock } from 'lucide-react';
import { toast } from 'sonner';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

export default function EditJobClient({ documentId, initialData }: { documentId: string, initialData: any }) {
  const router = useRouter();

  const [isUpdating, setIsUpdating] = useState(false);
  const [status, setStatus] = useState<{ type: 'idle' | 'success' | 'error', message: string }>({ type: 'idle', message: '' });

  const [jobDescription, setJobDescription] = useState<string>(initialData.jobDescription || "");
  const [formSchema, setFormSchema] = useState<any[]>(initialData.formSchema || []);

  const handleFieldUpdate = (index: number, key: string, value: any) => {
    const updatedSchema = [...formSchema];
    updatedSchema[index][key] = value;

    // Auto-generate camelCase ID from label if label is updated
    if (key === 'label') {
      updatedSchema[index].id = value.replace(/(?:^\w|[A-Z]|\b\w)/g, (word: string, i: number) => {
        return i === 0 ? word.toLowerCase() : word.toUpperCase();
      }).replace(/\s+/g, '');
    }

    setFormSchema(updatedSchema);
  };

  const addField = () => {
    setFormSchema([
      ...formSchema,
      { id: 'newQuestion', type: 'text', label: '', required: true }
    ]);
  };

  const removeField = (indexToRemove: number) => {
    setFormSchema(formSchema.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUpdating(true);
    setStatus({ type: 'idle', message: '' });

    const formData = new FormData(e.currentTarget);
    formData.set('jobDescription', jobDescription);
    formData.set('formSchema', JSON.stringify(formSchema)); // Inject schema

    try {
      await updateJobDetails(documentId, formData);
      toast.success('Job listing updated successfully');
      setStatus({ type: 'success', message: 'Job successfully updated!' });
      setTimeout(() => router.push(`/careers/${initialData.slug}`), 1500);
    } catch (error: any) {
      toast.error('Failed to update job listing');
      setStatus({ type: 'error', message: error.message || 'Failed to update job.' });
      setIsUpdating(false);
    }
  };

  const inputClasses = "w-full bg-[#f4f7fb]/40 border border-[#11192b]/10 rounded-[16px] p-4 text-[#11192b] text-[15px] font-light outline-none focus:bg-white focus:border-[#0b3579] focus:ring-4 focus:ring-[#0b3579]/10 transition-all duration-300 placeholder:text-[#11192b]/30 hover:border-[#0b3579]/40 hover:bg-[#f4f7fb]/80";

  return (
    <div className="min-h-screen bg-[#f4f7fb] p-6 md:p-12 lg:p-16 font-jost text-[#11192b] selection:bg-[#0b3579]/30">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12">
          <Link
            href={`/careers/${initialData.slug}`}
            className="group inline-flex items-center gap-2 text-[#11192b]/50 hover:text-[#0b3579] transition-colors mb-8 text-[11px] uppercase tracking-[0.2em] font-semibold"
          >
            <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1 duration-300" />
            Back to Job Post
          </Link>

          <h1 className="text-4xl md:text-6xl font-light tracking-tight mb-3 font-serif italic">
            Modify <span className="text-[#0b3579] font-serif">Listing.</span>
          </h1>
          <p className="text-lg font-light text-[#11192b]/60 leading-relaxed max-w-2xl">
            Update the metadata, description, and application form fields.
          </p>
        </header>

        <div className="bg-white rounded-4xl p-8 md:p-12 shadow-[0_2px_40px_-12px_rgba(0,0,0,0.03)] border border-[#11192b]/3">
          {status.message && (
            <div className={`p-5 mb-10 rounded-2xl text-sm font-medium flex items-start gap-3 transition-all duration-300 ${status.type === 'success' ? 'bg-emerald-50/50 text-emerald-700 border border-emerald-100' : 'bg-red-50/50 text-red-700 border border-red-100'}`}>
              {status.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-12">

            {/* 1. Core Meta */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="group">
                <label className="flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-[#11192b]/50 font-semibold mb-3">
                  Job Title <span className="text-[#d10808]">*</span>
                </label>
                <input type="text" name="title" required defaultValue={initialData.title} className={inputClasses} />
              </div>
              <div className="group">
                <label className="flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-[#11192b]/50 font-semibold mb-3">
                  Department <span className="text-[#d10808]">*</span>
                </label>
                <input type="text" name="department" required defaultValue={initialData.department} className={inputClasses} />
              </div>
              <div className="group">
                <label className="flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-[#11192b]/50 font-semibold mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#11192b]/20 group-focus-within:bg-[#0b3579] transition-colors duration-300"></span>
                  Job Type <span className="text-[#d10808]">*</span>
                </label>
                <select name="type" required defaultValue={initialData.type || 'Full-Time'} className={inputClasses + " appearance-none cursor-pointer"}>
                  <option value="Full-Time">Full-Time</option>
                  <option value="Contract">Contract</option>
                  <option value="Freelance">Freelance</option>
                  <option value="Part-Time">Part-Time</option>
                </select>
              </div>
              <div className="group">
                <label className="flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-[#11192b]/50 font-semibold mb-3">
                  Years of Experience <span className="text-[#d10808]">*</span>
                </label>
                <input type="number" name="experience" min="0" required defaultValue={initialData.experience} className={inputClasses} />
              </div>
            </div>

            {/* 2. Markdown Editor */}
            <div data-color-mode="light" className="group">
              <label className="flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-[#11192b]/50 font-semibold mb-3">
                Job Description <span className="text-[#d10808]">*</span>
              </label>
              <div className="rounded-[20px] overflow-hidden border border-[#11192b]/10 bg-white transition-all duration-300 focus-within:!border-[#0b3579] focus-within:!ring-4 focus-within:!ring-[#0b3579]/10
                [&_.w-md-editor]:!shadow-none [&_.w-md-editor]:!bg-transparent 
                [&_.w-md-editor-toolbar]:!bg-[#f4f7fb]/50 [&_.w-md-editor-toolbar]:!border-b [&_.w-md-editor-toolbar]:!border-[#11192b]/5 [&_.w-md-editor-toolbar]:!p-2
                [&_.w-md-editor-text-input]:!font-jost [&_.w-md-editor-text-input]:!text-[#11192b] [&_.w-md-editor-text-input]:!text-[15px] 
                [&_.w-md-editor-text]:!font-jost [&_.w-md-editor-preview]:!font-jost"
              >
                <MDEditor
                  value={jobDescription}
                  onChange={(val) => setJobDescription(val || '')}
                  height={450}
                  visibleDragbar={false}
                  className="w-full border-0!"
                  previewOptions={{ className: "prose prose-sm max-w-none font-jost prose-headings:font-serif prose-headings:font-normal prose-p:text-[#565C6B] p-4" }}
                />
              </div>
            </div>

            {/* 3. Dynamic Form Builder */}
            {/* 3. Dynamic Form Builder */}
            <div>
              <div className="flex items-center justify-between mb-8 border-b border-[#11192b]/5 pb-5">
                <div>
                  <label className="flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-[#11192b]/70 font-semibold mb-1">
                    Application Form Schema
                  </label>
                  <p className="text-[13px] text-[#11192b]/40 font-light">
                    Configure the questions candidates must answer to apply.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={addField}
                  className="cursior-pointer group inline-flex items-center gap-2 px-5 py-2.5 bg-[#f4f7fb] hover:bg-[#0b3579] rounded-full text-[10px] font-bold uppercase tracking-[0.15em] text-[#0b3579] hover:text-white transition-all duration-300"
                >
                  <Plus size={14} className="transition-transform group-hover:rotate-90" /> Add Question
                </button>
              </div>

              <div className="space-y-5">
                {formSchema.map((field, index) => {
                  const isCoreField = index < 5; // Lock First Name, Last Name, Email, LinkedIn, Resume

                  return (
                    <div
                      key={index}
                      className="flex flex-col bg-white border border-[#11192b]/10 rounded-2xl relative group/field hover:border-[#0b3579]/40 hover:shadow-[0_8px_30px_-12px_rgba(11,53,121,0.15)] transition-all duration-300 overflow-hidden"
                    >
                      {/* Top Utility Bar */}
                      <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-3 bg-[#f4f7fb]/50 border-b border-[#11192b]/5">
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#11192b]/40">
                            Input {index + 1}
                          </span>
                          {isCoreField && (
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#11192b]/5 rounded text-[9px] uppercase tracking-[0.2em] font-bold text-[#11192b]/50">
                              <Lock size={10} /> Core
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-5">
                          <select
                            value={field.type}
                            onChange={(e) => handleFieldUpdate(index, 'type', e.target.value)}
                            disabled={isCoreField}
                            className="bg-transparent text-[11px] uppercase tracking-[0.1em] font-semibold text-[#11192b]/70 outline-none cursor-pointer disabled:opacity-50 appearance-none hover:text-[#0b3579] transition-colors"
                          >
                            <option value="text">Short Text</option>
                            <option value="email">Email</option>
                            <option value="url">URL</option>
                            <option value="textarea">Paragraph</option>
                            <option value="select">Dropdown</option>
                            <option value="file">File Upload</option>
                          </select>

                          <label className="flex items-center gap-2 text-[11px] uppercase tracking-[0.1em] font-semibold text-[#11192b]/70 cursor-pointer hover:text-[#0b3579] transition-colors">
                            <input
                              type="checkbox"
                              checked={field.required}
                              disabled={isCoreField}
                              onChange={(e) => handleFieldUpdate(index, 'required', e.target.checked)}
                              className="accent-[#0b3579] w-3.5 h-3.5 rounded-sm cursor-pointer disabled:opacity-50"
                            />
                            Required
                          </label>

                          {!isCoreField && (
                            <>
                              <div className="w-px h-4 bg-[#11192b]/10"></div>
                              <button
                                type="button"
                                onClick={() => removeField(index)}
                                className="text-[#11192b]/30 hover:text-red-500 transition-colors"
                                title="Delete Question"
                              >
                                <Trash2 size={14} />
                              </button>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Main Input Area */}
                      <div className="p-6">
                        <textarea
                          value={field.label}
                          onChange={(e) => handleFieldUpdate(index, 'label', e.target.value)}
                          disabled={isCoreField}
                          rows={2}
                          placeholder="Type your question here..."
                          className="w-full bg-transparent text-[#11192b] text-[15px] font-medium outline-none placeholder:text-[#11192b]/30 disabled:opacity-60 resize-y min-h-[50px]"
                        />

                        {field.type === 'select' && !isCoreField && (
                          <div className="mt-4 pt-4 border-t border-[#11192b]/5">
                            <label className="block text-[10px] uppercase tracking-[0.2em] text-[#11192b]/40 font-semibold mb-2">
                              Dropdown Options (Comma Separated)
                            </label>
                            <input
                              type="text"
                              value={field.options?.join(', ') || ''}
                              onChange={(e) => handleFieldUpdate(index, 'options', e.target.value.split(',').map(s => s.trim()))}
                              placeholder="e.g. Yes, No, Maybe"
                              className="w-full bg-[#f4f7fb]/50 border border-[#11192b]/10 rounded-xl px-4 py-3 text-[13px] outline-none focus:bg-white focus:border-[#0b3579]/50 focus:ring-2 focus:ring-[#0b3579]/10 transition-all"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-6 flex items-center justify-center">
                <button
                  type="button"
                  onClick={addField}
                  className="group inline-flex cursor-pointer items-center gap-2 px-5 py-2.5 bg-[#f4f7fb] hover:bg-[#0b3579] rounded-full text-[10px] font-bold uppercase tracking-[0.15em] text-[#0b3579] hover:text-white transition-all duration-300"
                >
                  <Plus size={14} className="transition-transform group-hover:rotate-90" /> Add Question
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isUpdating}
              className="group relative cursor-pointer w-full inline-flex items-center justify-center bg-[#11192b] text-white px-8 py-5 rounded-2xl uppercase tracking-[0.15em] text-xs font-medium overflow-hidden transition-all duration-300 hover:shadow-[0_8px_25px_-5px_rgba(17,25,43,0.3)] disabled:opacity-50 mt-4"
            >
              <span className="relative z-10 flex items-center gap-3">
                {isUpdating ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                {isUpdating ? 'Committing Changes...' : 'Save Updates'}
              </span>
              {!isUpdating && (
                <div className="absolute inset-0 bg-[#0b3579] translate-y-[101%] group-hover:translate-y-0 transition-transform duration-500 ease-out" />
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}