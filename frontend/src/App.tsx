import React, { useState, useRef } from 'react';
import { Camera, Upload, FileText, FlipHorizontal, RotateCcw, Loader2, ImagePlus } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

type InputMode = 'text' | 'image' | 'camera';

function App() {
  const [mode, setMode] = useState<InputMode>('text');
  const [text, setText] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [dragActive, setDragActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const startCamera = async () => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const handleCapture = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg');
        setCapturedImage(imageData);
        stopCamera();
      }
    }
  };

  const handleRecapture = () => {
    setCapturedImage(null);
    startCamera();
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files[0]);
    }
  };

  const handleFiles = (file: File) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFiles(file);
    }
  };

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      let data;
      if (mode === 'text') {
        data = { text };
      } else if (mode === 'camera') {
        data = { image: capturedImage };
      } else {
        data = { image };
      }
      console.log("Base64 image data:", data.image); // Log base64 image data
      const response = await fetch('http://127.0.0.1:8000', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      setResult(result.message);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (mode === 'camera' && !capturedImage) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [mode, facingMode, capturedImage]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-2xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-8 py-2">
          Ingredient Safety Analyzer
        </h1>

        <div className="flex justify-center space-x-2 bg-gray-800 p-2 rounded-lg">
          <button
            onClick={() => {
              setMode('text');
              setCapturedImage(null);
            }}
            className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
              mode === 'text' ? 'bg-cyan-500 text-white' : 'text-gray-400 hover:text-white'
            }`}
            title="Text Input"
          >
            <FileText size={20} />
            <span className="hidden sm:inline">Text</span>
          </button>
          <button
            onClick={() => {
              setMode('image');
              setCapturedImage(null);
            }}
            className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
              mode === 'image' ? 'bg-cyan-500 text-white' : 'text-gray-400 hover:text-white'
            }`}
            title="Upload Image"
          >
            <Upload size={20} />
            <span className="hidden sm:inline">Image</span>
          </button>
          <button
            onClick={() => {
              setMode('camera');
              setImage(null);
            }}
            className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
              mode === 'camera' ? 'bg-cyan-500 text-white' : 'text-gray-400 hover:text-white'
            }`}
            title="Use Camera"
          >
            <Camera size={20} />
            <span className="hidden sm:inline">Camera</span>
          </button>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
          <div className="space-y-6">
            {mode === 'text' && (
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste ingredients list here..."
                className="w-full h-48 p-4 bg-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              />
            )}

            {mode === 'image' && (
              <div className="space-y-4">
                {!image ? (
                  <div
                    className={`relative group ${
                      dragActive ? 'border-cyan-500 shadow-[0_0_15px_rgba(34,211,238,0.5)]' : 'border-gray-600'
                    } border-2 border-dashed rounded-lg transition-all hover:border-cyan-500 hover:shadow-[0_0_15px_rgba(34,211,238,0.3)]`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <input
                      ref={inputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <div className="flex flex-col items-center justify-center p-8 space-y-4 cursor-pointer"
                         onClick={() => inputRef.current?.click()}>
                      <div className="p-4 bg-gray-700 rounded-full group-hover:bg-gray-600 transition-colors">
                        <ImagePlus size={32} className="text-cyan-400" />
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-medium text-gray-300">
                          Drop your image here, or <span className="text-cyan-400">browse</span>
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Supports JPG, PNG, GIF up to 10MB
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="relative group overflow-hidden rounded-lg">
                    <img src={image} alt="Preview" className="w-full rounded-lg" />
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        onClick={() => setImage(null)}
                        className="p-2 bg-red-500 rounded-full hover:bg-red-600 transition-colors transform hover:scale-110"
                      >
                        <RotateCcw size={20} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {mode === 'camera' && (
              <div className="relative">
                {!capturedImage ? (
                  <>
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full rounded-lg"
                    />
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center justify-center space-x-4">
                      <button
                        onClick={handleCapture}
                        className="inline-flex items-center justify-center p-4 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
                      >
                        <Camera size={24} />
                      </button>
                      <button
                        onClick={() => setFacingMode(prev => 
                          prev === 'user' ? 'environment' : 'user'
                        )}
                        className="inline-flex items-center justify-center p-4 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors"
                      >
                        <FlipHorizontal size={24} />
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="relative group overflow-hidden rounded-lg">
                    <img src={capturedImage} alt="Captured" className="w-full rounded-lg" />
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        onClick={handleRecapture}
                        className="p-2 bg-red-500 rounded-full hover:bg-red-600 transition-colors transform hover:scale-110"
                      >
                        <RotateCcw size={20} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-center">
              <button
                onClick={handleAnalyze}
                disabled={loading || 
                  (mode === 'text' && !text) || 
                  (mode === 'image' && !image) ||
                  (mode === 'camera' && !capturedImage)
                }
                className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg font-semibold 
                  disabled:opacity-50 disabled:cursor-not-allowed hover:from-cyan-600 hover:to-purple-600 
                  transition-all"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={20} />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <span>Analyze Ingredients</span>
                )}
              </button>
            </div>
          </div>
        </div>

        {result && (
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
            <h2 className="text-xl font-semibold mb-4 text-cyan-400">Analysis Result</h2>
            <div className="prose prose-invert max-w-none">
              <ReactMarkdown>{result}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
