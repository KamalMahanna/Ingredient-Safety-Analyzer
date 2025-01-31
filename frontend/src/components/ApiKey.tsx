import React, { useState, useEffect } from 'react';
import { Key, Save, Trash2, Loader2, Info } from 'lucide-react';
import Popup from './Popup';

interface ApiKeyProps {
  onClose?: () => void;
}

export default function ApiKey({ onClose }: ApiKeyProps) {
  const [apiKey, setApiKey] = useState<string>('');
  const [hasKey, setHasKey] = useState<boolean>(false);
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    const savedKey = localStorage.getItem('gemini_api_key');
    if (savedKey) {
      setHasKey(true);
      setApiKey(savedKey);
    }
  }, []);

  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string>('');

  const handleSaveKey = async () => {
    if (!apiKey.trim()) return;
    
    setVerifying(true);
    setError('');
    
    try {
      const response = await fetch('https://ingredient-safety-analyzer.onrender.com/verify-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ api_key: apiKey.trim() }),
      });

      const data = await response.json();

      if (data.valid) {
        localStorage.setItem('gemini_api_key', apiKey.trim());
        setHasKey(true);
        if (onClose) onClose();
      } else {
        setError(data.error || 'Invalid API key');
      }
    } catch (error) {
      setError('Failed to verify API key');
      console.error('API key verification failed:', error);
    } finally {
      setVerifying(false);
    }
  };

  const handleDeleteKey = () => {
    localStorage.removeItem('gemini_api_key');
    setApiKey('');
    setHasKey(false);
  };

  return (
    <>
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Key className="text-cyan-400" size={24} />
            <h2 className="text-xl font-semibold text-white">API Key Management</h2>
          </div>
          {!hasKey && (
            <button 
              onClick={() => setShowGuide(true)}
              className="p-2 hover:bg-gray-700 rounded-full transition-colors"
              title="How to get an API key"
            >
              <Info size={20} className="text-cyan-400" />
            </button>
          )}
        </div>

        {!hasKey ? (
          <div className="space-y-4">
            <div className="text-center">
              <label htmlFor="apiKey" className="block text-sm font-medium text-gray-300 mb-2">
                Enter your Gemini API Key
              </label>
              <input
                id="apiKey"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Your API key here..."
                className="w-full p-3 bg-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:outline-none mb-4"
              />
              <div className="flex justify-center">
                <button
                  onClick={handleSaveKey}
                  disabled={!apiKey.trim()}
                  className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg font-semibold 
                    disabled:opacity-50 disabled:cursor-not-allowed hover:from-cyan-600 hover:to-purple-600 
                    transition-all"
                >
                  {verifying ? (
                    <Loader2 size={18} className="animate-spin mr-2" />
                  ) : (
                    <Save size={18} className="mr-2" />
                  )}
                  Save API Key
                </button>
              </div>
              {error && (
                <p className="text-red-500 text-sm mt-2">{error}</p>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4 text-center">
            <p className="text-gray-300">Your API key is securely stored</p>
            <div className="flex justify-center">
              <button
                onClick={handleDeleteKey}
                className="inline-flex items-center justify-center px-6 py-3 bg-red-500 hover:bg-red-600 rounded-lg font-semibold 
                  transition-all text-white"
              >
                <Trash2 size={18} className="mr-2" />
                Delete API Key
              </button>
            </div>
          </div>
        )}
      </div>

      <Popup isOpen={showGuide} onClose={() => setShowGuide(false)}>
        <div className="text-white">
          <h3 className="text-lg font-medium text-cyan-400 mb-4">How to Get Your API Key</h3>
          <ol className="list-decimal list-inside space-y-3 text-gray-300">
            <li>Visit <a href="https://aistudio.google.com/" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">Google AI Studio</a></li>
            <li>Sign in with your Google account</li>
            <li>Click on "Get API key" in the top navigation</li>
            <li>Create a new API key or use an existing one</li>
            <li>Copy your API key and paste it into the input field</li>
          </ol>
        </div>
      </Popup>
    </>
  );
}
