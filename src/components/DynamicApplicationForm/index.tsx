'use client';

import { useState } from 'react';
import { submitCandidateApplication } from '@/actions/cadidate-actions';
import { LockIcon } from 'lucide-react';

interface FormField {
  id: string;
  type: string;
  label: string;
  required?: boolean;
  options?: string[];
}

export function DynamicApplicationForm({
  jobId,
  formSchema
}: {
  jobId: number | string;
  formSchema: FormField[];
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: 'idle' | 'success' | 'error', message: string }>({ type: 'idle', message: '' });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: 'idle', message: '' });

    const formData = new FormData(e.currentTarget);
    formData.append('jobId', jobId.toString());

    // Call the server action to securely post this to Strapi
    const response = await submitCandidateApplication(formData, formSchema);

    if (response.success) {
      setStatus({ type: 'success', message: 'Application submitted successfully. We will be in touch.' });
      e.currentTarget.reset();
    } else {
      setStatus({ type: 'error', message: response.error || 'Something went wrong. Please try again.' });
    }
    setIsSubmitting(false);
  };

  // The engine that decides what UI element to render based on the AI's JSON
  const renderField = (field: FormField) => {
    const baseClasses = "w-full bg-[#14181F]/[0.02] border border-[#14181F]/10 rounded-[12px] p-4 text-[#14181F] text-[15px] font-light outline-none focus:bg-white focus:border-[#0b3579]/50 focus:ring-1 focus:ring-[#0b3579]/30 transition-all duration-300 placeholder:text-[#14181F]/30";

    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            id={field.id}
            name={field.id}
            required={field.required}
            rows={4}
            className={`${baseClasses} resize-y min-h-30`}
            placeholder={`Enter ${field.label.toLowerCase()}...`}
          />
        );

      case 'select':
        return (
          <div className="relative group">
            <select
              id={field.id}
              name={field.id}
              required={field.required}
              defaultValue=""
              className={`${baseClasses} appearance-none cursor-pointer pr-12`}
            >
              <option value="" disabled className="text-[#14181F]/40">Select an option...</option>
              {field.options?.map((opt, i) => (
                <option key={i} value={opt}>{opt}</option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#14181F]/30 group-hover:text-[#0b3579] transition-colors duration-300">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
              </svg>
            </div>
          </div>
        );

      case 'file':
        return (
          <div className="relative group border border-dashed border-[#14181F]/20 rounded-2xl p-8 text-center bg-[#14181F]/1 hover:border-[#0b3579]/50 hover:bg-[#0b3579]/2 transition-all duration-300 cursor-pointer overflow-hidden">
            <input
              type="file"
              id={field.id}
              name={field.id}
              required={field.required}
              accept=".pdf,.doc,.docx"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className="relative z-0 flex flex-col items-center justify-center">
              <svg className="w-8 h-8 text-[#14181F]/20 group-hover:text-[#0b3579] transition-colors duration-300 mb-4 group-hover:-translate-y-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-[#14181F]/60 text-[14px] font-light mb-2">
                Drag and drop or <span className="text-[#0b3579] font-medium">browse</span> to upload {field.label.toLowerCase()}
              </p>
              <p className="text-[#14181F]/30 text-[10px] uppercase tracking-[0.2em] font-semibold">
                PDF, DOC up to 5MB
              </p>
            </div>
          </div>
        );

      default: // text, email, url
        return (
          <input
            type={field.type}
            id={field.id}
            name={field.id}
            required={field.required}
            className={baseClasses}
            placeholder={`Enter ${field.label.toLowerCase()}`}
          />
        );
    }
  };

  return (
    <div className="w-full relative overflow-hidden font-jost">
      {status.type === 'success' ? (

        /* Premium Success State */
        <div className="text-center py-16 animate-in fade-in zoom-in duration-500">
          <div className="w-20 h-20 bg-[#0b3579]/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-[#0b3579]/20 relative">
            <div className="absolute inset-0 border border-[#0b3579]/20 rounded-full animate-ping opacity-20"></div>
            <svg className="w-8 h-8 text-[#0b3579]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-3xl text-[#14181F] font-light tracking-tight mb-4">Transmission Complete</h3>
          <p className="text-[#565C6B] font-light text-[15px] max-w-sm mx-auto leading-relaxed">
            {status.message}
          </p>
        </div>

      ) : (

        /* Form rendering */
        <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
          {formSchema.map((field) => (
            <div key={field.id} className="flex flex-col">
              <label htmlFor={field.id} className="text-[11px] uppercase tracking-[0.2em] text-[#14181F]/50 font-semibold mb-3 flex items-center gap-1">
                {field.label}
                {field.required && <span className="text-red-500">*</span>}
              </label>
              {renderField(field)}
            </div>
          ))}

          {status.type === 'error' && (
            <div className="p-4 rounded-xl bg-red-50/50 border border-red-100 text-red-600 text-sm font-light flex items-center gap-3">
              <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              {status.message}
            </div>
          )}

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="group cursor-pointer relative w-full inline-flex items-center justify-center bg-[#14181F] text-white px-8 py-5 rounded-2xl uppercase tracking-[0.2em] text-[11px] font-semibold overflow-hidden transition-all duration-300 hover:shadow-[0_8px_25px_-5px_rgba(20,24,31,0.3)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none hover:-translate-y-0.5"
            >
              <span className="relative z-10 flex items-center gap-3">
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    Submit Application
                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-1 duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                )}
              </span>
              {!isSubmitting && (
                <div className="absolute inset-0 bg-[#0b3579] translate-y-[101%] group-hover:translate-y-0 transition-transform duration-500 ease-out"></div>
              )}
            </button>
            <p className="text-center text-[10px] text-[#14181F]/40 uppercase tracking-widest mt-4 flex justify-center items-center">
              <LockIcon className="w-4 h-4 inline-block" />&nbsp;Protected by enterprise-grade encryption
            </p>
          </div>
        </form>
      )}
    </div>
  );
}