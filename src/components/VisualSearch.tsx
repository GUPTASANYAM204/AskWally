import React, { useState, useRef } from 'react';
import { Camera, Upload, X, Loader2, Search, AlertCircle, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { processImageWithAI } from '../utils/imageProcessor';
import { getFilteredProducts } from '../data/mockProducts';
import type { Product } from '../data/mockProducts';

interface VisualSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ImageAnalysisResult {
  category: string;
  keywords: string[];
  brand?: string;
  color?: string;
  confidence: number;
}

export const VisualSearch: React.FC<VisualSearchProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ImageAnalysisResult | null>(null);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setSelectedImage(imageUrl);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    try {
      setError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setIsCameraActive(true);
      }
    } catch (error) {
      setError('Camera access denied. Please allow camera permissions or try uploading an image instead.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const imageUrl = canvas.toDataURL('image/jpeg', 0.8);
        setSelectedImage(imageUrl);
        stopCamera();
        setError(null);
      }
    }
  };

  const processImage = async () => {
    if (!selectedImage) return;

    setIsProcessing(true);
    setError(null);

    try {
      // Simulate AI image processing
      const result = await processImageWithAI(selectedImage);
      setAnalysisResult(result);

      // Search for products based on AI analysis
      const products = getFilteredProducts(result.category, {
        color: result.color,
        brand: result.brand,
      });

      // Filter by keywords if no direct matches
      let filteredProducts = products;
      if (products.length === 0 && result.keywords.length > 0) {
        filteredProducts = getFilteredProducts().filter(product => 
          result.keywords.some(keyword => 
            product.name.toLowerCase().includes(keyword.toLowerCase()) ||
            product.category.toLowerCase().includes(keyword.toLowerCase())
          )
        );
      }

      setSearchResults(filteredProducts.slice(0, 12)); // Limit to 12 results
    } catch (error) {
      setError('Failed to process image. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleViewAllResults = () => {
    if (analysisResult) {
      const searchQuery = `${analysisResult.keywords.join(' ')} ${analysisResult.category}`.trim();
      navigate('/products', {
        state: {
          query: searchQuery,
          parsedQuery: {
            category: analysisResult.category,
            filters: {
              color: analysisResult.color,
              brand: analysisResult.brand,
            }
          },
          searchPerformed: true,
          visualSearch: true
        }
      });
      onClose();
    }
  };

  const resetSearch = () => {
    setSelectedImage(null);
    setAnalysisResult(null);
    setSearchResults([]);
    setError(null);
    setIsProcessing(false);
    stopCamera();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-walmart-blue to-walmart-blue-dark rounded-xl flex items-center justify-center">
                <Search className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Visual Search</h2>
                <p className="text-sm text-gray-600">Find products by uploading or capturing an image</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <div className="p-6">
            {/* Error Display */}
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-800 font-medium">Error</p>
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              </div>
            )}

            {/* Image Upload/Capture Section */}
            {!selectedImage && !isCameraActive && (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    How would you like to search?
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Upload an image or use your camera to find similar products
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Upload Button */}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-2xl hover:border-walmart-blue hover:bg-walmart-blue/5 transition-all duration-200 group"
                  >
                    <Upload className="w-12 h-12 text-gray-400 group-hover:text-walmart-blue mb-4" />
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">Upload Image</h4>
                    <p className="text-gray-600 text-center">
                      Choose a photo from your device
                    </p>
                  </button>

                  {/* Camera Button */}
                  <button
                    onClick={startCamera}
                    className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-2xl hover:border-walmart-blue hover:bg-walmart-blue/5 transition-all duration-200 group"
                  >
                    <Camera className="w-12 h-12 text-gray-400 group-hover:text-walmart-blue mb-4" />
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">Use Camera</h4>
                    <p className="text-gray-600 text-center">
                      Take a photo with your camera
                    </p>
                  </button>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            )}

            {/* Camera View */}
            {isCameraActive && (
              <div className="space-y-4">
                <div className="relative bg-black rounded-2xl overflow-hidden">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-64 md:h-80 object-cover"
                  />
                  <div className="absolute inset-0 border-2 border-white/30 rounded-2xl pointer-events-none">
                    <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-white/60"></div>
                    <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-white/60"></div>
                    <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-white/60"></div>
                    <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-white/60"></div>
                  </div>
                </div>
                
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={capturePhoto}
                    className="bg-walmart-blue hover:bg-walmart-blue-dark text-white px-6 py-3 rounded-xl font-semibold transition-colors duration-200 flex items-center space-x-2"
                  >
                    <Camera className="w-5 h-5" />
                    <span>Capture Photo</span>
                  </button>
                  <button
                    onClick={stopCamera}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Selected Image Preview */}
            {selectedImage && !isProcessing && !analysisResult && (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Image Selected
                  </h3>
                  <div className="relative inline-block">
                    <img
                      src={selectedImage}
                      alt="Selected for search"
                      className="max-w-full max-h-64 rounded-2xl shadow-lg"
                    />
                  </div>
                </div>
                
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={processImage}
                    className="bg-gradient-to-r from-walmart-blue to-walmart-blue-dark text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
                  >
                    <Search className="w-5 h-5" />
                    <span>Search Similar Products</span>
                  </button>
                  <button
                    onClick={resetSearch}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold transition-colors duration-200 flex items-center space-x-2"
                  >
                    <RefreshCw className="w-5 h-5" />
                    <span>Try Again</span>
                  </button>
                </div>
              </div>
            )}

            {/* Processing State */}
            {isProcessing && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-br from-walmart-blue to-walmart-blue-dark rounded-full flex items-center justify-center mx-auto mb-6">
                  <Loader2 className="w-8 h-8 text-white animate-spin" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Analyzing Image...
                </h3>
                <p className="text-gray-600 mb-4">
                  Our AI is identifying products and finding matches
                </p>
                <div className="flex items-center justify-center space-x-2 text-walmart-blue">
                  <div className="w-2 h-2 bg-walmart-blue rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-walmart-blue rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-walmart-blue rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            )}

            {/* Results */}
            {analysisResult && searchResults.length > 0 && (
              <div className="space-y-6">
                {/* Analysis Summary */}
                <div className="bg-walmart-blue/5 rounded-2xl p-6 border border-walmart-blue/20">
                  <h3 className="text-lg font-semibold text-walmart-blue mb-4">
                    AI Analysis Results
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Category</p>
                      <p className="text-walmart-blue font-semibold capitalize">{analysisResult.category}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Keywords</p>
                      <p className="text-gray-800">{analysisResult.keywords.join(', ')}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Confidence</p>
                      <p className="text-green-600 font-semibold">{Math.round(analysisResult.confidence * 100)}%</p>
                    </div>
                  </div>
                </div>

                {/* Search Results */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Similar Products ({searchResults.length} found)
                    </h3>
                    <button
                      onClick={handleViewAllResults}
                      className="text-walmart-blue hover:text-walmart-blue-dark font-semibold text-sm transition-colors duration-200"
                    >
                      View All Results →
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {searchResults.map((product) => (
                      <div
                        key={product.id}
                        className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-200 cursor-pointer group"
                        onClick={() => {
                          navigate(`/product/${product.id}`);
                          onClose();
                        }}
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-32 object-cover rounded-lg mb-3 group-hover:scale-105 transition-transform duration-200"
                        />
                        <h4 className="font-semibold text-gray-800 text-sm mb-1 line-clamp-2">
                          {product.name}
                        </h4>
                        <p className="text-xs text-gray-600 mb-2">{product.brand}</p>
                        <p className="text-lg font-bold text-walmart-blue">${product.price}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-center space-x-4">
                  <button
                    onClick={handleViewAllResults}
                    className="bg-gradient-to-r from-walmart-blue to-walmart-blue-dark text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
                  >
                    View All Results
                  </button>
                  <button
                    onClick={resetSearch}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold transition-colors duration-200 flex items-center space-x-2"
                  >
                    <RefreshCw className="w-5 h-5" />
                    <span>New Search</span>
                  </button>
                </div>
              </div>
            )}

            {/* No Results */}
            {analysisResult && searchResults.length === 0 && !isProcessing && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  No Similar Products Found
                </h3>
                <p className="text-gray-600 mb-6">
                  We couldn't find products matching your image. Try a different image or browse our categories.
                </p>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={resetSearch}
                    className="bg-walmart-blue hover:bg-walmart-blue-dark text-white px-6 py-3 rounded-xl font-semibold transition-colors duration-200 flex items-center space-x-2"
                  >
                    <RefreshCw className="w-5 h-5" />
                    <span>Try Another Image</span>
                  </button>
                  <button
                    onClick={() => {
                      navigate('/products');
                      onClose();
                    }}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold transition-colors duration-200"
                  >
                    Browse Products
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Hidden canvas for photo capture */}
          <canvas ref={canvasRef} className="hidden" />
        </div>
      </div>
    </>
  );
};