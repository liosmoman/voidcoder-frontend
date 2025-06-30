// src/ImageUploader.js
import React, { useState, useRef, useCallback, useEffect } from 'react'; // Added useEffect
import { useDropzone } from 'react-dropzone';
import { analyzeImage } from './apiService';
import toast from 'react-hot-toast';
import { ArrowUpTrayIcon } from '@heroicons/react/24/outline'; 

function ImageUploader() {
  const [imageEntries, setImageEntries] = useState([]);
  const [sessionName, setSessionName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState('');
  const [copiedStates, setCopiedStates] = useState({});
  // No longer using fileInputRef with useDropzone, but keeping it in case of other needs. It can be removed.
  const fileInputRef = useRef(null); 

  // --- Add this useEffect to watch for changes to analysisResult ---
  useEffect(() => {
    // console.log("ImageUploader: analysisResult state changed to:", analysisResult);
  }, [analysisResult]);
  // ---

  let consolidatedPromptText = '';
  if (analysisResult && analysisResult.prompts && analysisResult.prompts.length > 0) {
    consolidatedPromptText = analysisResult.prompts
      .map(p => `<!-- ${p.prompt_type.replace(/_/g, ' ').toUpperCase()} -->\n${p.prompt_text}\n\n`)
      .join('')
      .trim();
  }

  const onDrop = useCallback((acceptedFiles) => {
    // console.log("onDrop triggered!"); // Check if this is called unexpectedly
    if (acceptedFiles && acceptedFiles.length > 0) {
      const newImageEntries = acceptedFiles.map(file => ({
        id: `${file.name}-${Date.now()}-${Math.random()}`,
        file: file,
        title: file.name.replace(/\.[^/.]+$/, ""), 
        preview: URL.createObjectURL(file)
      }));
      setImageEntries(prevEntries => [...prevEntries, ...newImageEntries]);
      setAnalysisResult(null); // This resets the result on new file selection
      setError('');
      setCopiedStates({});
    }
  }, []); 

  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
    onDrop,
    accept: { 
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/webp': ['.webp'],
    },
    multiple: true
  });

  const handleSessionNameChange = (event) => {
    setSessionName(event.target.value);
  };

  const handleTitleChange = (id, newTitle) => {
    setImageEntries(prevEntries =>
      prevEntries.map(entry =>
        entry.id === id ? { ...entry, title: newTitle } : entry
      )
    );
  };

  const handleRemoveImage = (idToRemove) => {
    setImageEntries(prevEntries => {
      const entryToRemove = prevEntries.find(entry => entry.id === idToRemove);
      if (entryToRemove && entryToRemove.preview) {
        URL.revokeObjectURL(entryToRemove.preview);
      }
      return prevEntries.filter(entry => entry.id !== idToRemove);
    });
  };
  
  const handleCopyPrompt = (textToCopy, promptKey) => {
    navigator.clipboard.writeText(textToCopy)
    .then(() => {
      toast.success('Prompt copied!');
      setCopiedStates(prev => ({ ...prev, [promptKey]: true }));
      setTimeout(() => {
        setCopiedStates(prev => ({ ...prev, [promptKey]: false }));
      }, 1500);
    })
    .catch(err => {
      toast.error('Failed to copy prompt.');
      console.error('Failed to copy text: ', err);
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (imageEntries.length === 0) {
      setError('Please select at least one image file.');
      return;
    }

    setIsLoading(true);
    setError('');
    // console.log("handleSubmit: Resetting analysisResult to null before API call.");
    setAnalysisResult(null);
    setCopiedStates({});

    const formData = new FormData();

    if (sessionName.trim() !== '') {
      formData.append('session_name', sessionName.trim());
    }

    imageEntries.forEach((entry) => {
      formData.append('image_files', entry.file, entry.file.name);
      formData.append('image_titles', entry.title || `Untitled`);
    });
    
    try {
      const result = await analyzeImage(formData); 
    //  console.log("handleSubmit: API call successful. Received result:", result);
      setAnalysisResult(result);
    } catch (err) {
      let displayErrorMessage = 'An unknown error occurred. Please check the console.';
      if (err.data && err.data.detail) {
        if (Array.isArray(err.data.detail)) {
          displayErrorMessage = err.data.detail.map(d => `${d.loc ? d.loc.join(' -> ') : 'Error'}: ${d.msg}`).join('; ');
        } else if (typeof err.data.detail === 'string') {
          displayErrorMessage = err.data.detail;
        }
      } else if (err.message) {
        displayErrorMessage = err.message;
      }
      setError(displayErrorMessage);
      console.error("ImageUploader error details:", err.data || err);
    } finally {
      setIsLoading(false);
    }
  };

  // Styling for the dropzone
  const baseStyle = "flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-200 ease-in-out";
  const activeStyle = "border-nimbus-primary-accent bg-blue-50";
  const acceptStyle = "border-green-500 bg-green-50";
  const rejectStyle = "border-red-500 bg-red-50";

  let dzClassName = `${baseStyle} border-slate-300 hover:border-nimbus-primary-accent/70`;
  if (isDragActive) {
    dzClassName = `${baseStyle} ${activeStyle}`;
  }
  if (isDragAccept) {
    dzClassName = `${baseStyle} ${acceptStyle}`;
  }
  if (isDragReject) {
    dzClassName = `${baseStyle} ${rejectStyle}`;
  }

  // Debug log for every render
 // console.log(`Rendering ImageUploader. Is analysisResult truthy? ${!!analysisResult}`);

  return (
    <div className="p-4 sm:p-6 bg-nimbus-card-bg rounded-lg shadow-xl">
      <h2 className="text-xl sm:text-2xl font-semibold text-nimbus-text-dark mb-6 text-center sm:text-left">
        Upload UI Screenshot(s) for Analysis
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="sessionName" className="block text-sm font-medium text-nimbus-text-medium mb-1">
            Overall Session Name (Optional):
          </label>
          <input
            type="text"
            id="sessionName"
            value={sessionName}
            onChange={handleSessionNameChange}
            placeholder="e.g., My E-commerce App"
            className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-nimbus-primary-accent focus:ring-1 focus:ring-nimbus-primary-accent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-nimbus-text-medium mb-1">
            Choose or Drag Image(s) Here:
          </label>
          <div {...getRootProps({ className: dzClassName })}>
            <input {...getInputProps()} />
            <ArrowUpTrayIcon className="w-12 h-12 text-slate-400 mb-2" />
            {isDragActive ? (
              <p className="text-nimbus-primary-accent">Drop the files here ...</p>
            ) : (
              <p className="text-slate-500 text-sm">Drag 'n' drop some image files here, or click to select files</p>
            )}
            {isDragReject && <p className="text-red-500 text-xs mt-1">Only image files (PNG, JPG, WEBP) are accepted.</p>}
          </div>
        </div>

        {imageEntries.length > 0 && (
          <div className="space-y-4 mt-4 border-t border-slate-200 pt-4">
            <h3 className="text-md font-semibold text-nimbus-text-dark">Selected Pages/Images: ({imageEntries.length})</h3>
            {imageEntries.map((entry) => (
              <div key={entry.id} className="flex items-start space-x-3 p-3 bg-slate-50 rounded-md border">
                <img src={entry.preview} alt={entry.title || `preview`} className="w-20 h-20 object-contain border rounded-md"/>
                <div className="flex-grow">
                  <label htmlFor={`title-${entry.id}`} className="block text-xs font-medium text-slate-500">Page Title:</label>
                  <input
                    type="text"
                    id={`title-${entry.id}`}
                    value={entry.title}
                    onChange={(e) => handleTitleChange(entry.id, e.target.value)}
                    placeholder="e.g., Landing Page, Product Details"
                    className="mt-0.5 block w-full px-2 py-1.5 bg-white border border-slate-300 rounded-md text-sm shadow-sm"
                  />
                </div>
                <button 
                  type="button" 
                  onClick={() => handleRemoveImage(entry.id)} 
                  className="ml-2 text-red-500 hover:text-red-700 text-2xl leading-none p-1 self-start"
                  title="Remove Image"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
        
        <button 
          type="submit" 
          disabled={isLoading || imageEntries.length === 0}
          className="w-full flex justify-center items-center px-4 py-2.5 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-slate-300 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing...
            </>
          ) : `Analyze Image${imageEntries.length > 1 ? 's' : ''}`}
        </button>
      </form>

      {error && (
         <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-400 text-red-700 text-sm rounded-r-md">
          <p><strong>Error:</strong> {error}</p>
        </div>
      )}

      {analysisResult && (
        <div className="mt-8">
          <h3 className="text-xl sm:text-2xl font-semibold text-nimbus-text-dark border-b border-slate-200 pb-2 mb-4">
            Analysis Complete!
          </h3>
          <div className="text-sm text-slate-600 mb-4 space-y-1">
            <p><strong>Session:</strong> {analysisResult.session_name || 'N/A'}</p>
            <p><strong>Image(s) Processed:</strong> {analysisResult.image_filename || imageEntries.map(e=>e.file.name).join(', ') || 'N/A'}</p>
          </div>
          {consolidatedPromptText ? (
            <div className="my-6 p-4 bg-sky-50 border border-sky-200 rounded-lg shadow">
              <strong className="block mb-2 text-sky-700 font-semibold">Consolidated Prompt:</strong>
              <pre className="bg-white p-3 border border-slate-300 rounded text-xs whitespace-pre-wrap break-words max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 hover:scrollbar-thumb-slate-400">
                {consolidatedPromptText}
              </pre>
              <button 
                onClick={() => handleCopyPrompt(consolidatedPromptText, 'consolidated')}
                className="mt-3 px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-sky-500"
              >
                {copiedStates['consolidated'] ? 'Copied!' : 'Copy Consolidated Prompt'}
              </button>
            </div>
          ) : (
            <p className="text-slate-500 mt-6">No prompts were generated.</p>
          )}
          {/* Debug <details> section removed as requested */}
        </div>
      )}
    </div>
  );
}

export default ImageUploader;