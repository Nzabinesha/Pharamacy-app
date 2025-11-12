import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '@/store/cartStore';

export function Prescription() {
  const navigate = useNavigate();
  const { items, total } = useCartStore();
  const [fileName, setFileName] = useState<string | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'verifying' | 'approved' | 'rejected'>('idle');
  const [delivery, setDelivery] = useState(true);
  const [address, setAddress] = useState('');
  const [placing, setPlacing] = useState(false);

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setFileName(file.name);
    setStatus('uploading');
    
    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
    
    await new Promise(r => setTimeout(r, 800));
    setStatus('verifying');
    await new Promise(r => setTimeout(r, 1500));
    setStatus('approved');
  }

  async function handlePlaceOrder(e: React.FormEvent) {
    e.preventDefault();
    if (status !== 'approved' && items.some(item => item.requiresPrescription)) {
      alert('Please upload and verify your prescription first');
      return;
    }
    
    setPlacing(true);
    await new Promise(r => setTimeout(r, 1000));
    setPlacing(false);
    navigate('/notifications');
  }

  const requiresPrescription = items.some(item => item.requiresPrescription === true);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-8">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">📋 Prescription & Order</h1>
          <p className="text-primary-100">Upload your prescription and complete your order</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Order Summary */}
            {items.length > 0 && (
              <div className="card">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span>🛒</span> Order Summary
                </h2>
                <div className="space-y-3">
                  {items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-primary-600">
                        {(item.priceRWF * item.quantity).toLocaleString()} RWF
                      </p>
                    </div>
                  ))}
                  <div className="border-t pt-3 flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Total:</span>
                    <span className="text-2xl font-bold text-primary-600">
                      {total().toLocaleString()} RWF
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Prescription Upload */}
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span>📄</span> Prescription Upload
                {requiresPrescription && (
                  <span className="ml-auto text-sm bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full font-semibold">
                    Required
                  </span>
                )}
              </h2>
              
              {!requiresPrescription && (
                <div className="mb-4 p-4 bg-primary-50 border border-primary-200 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Note:</span> Your order doesn't require a prescription, but you can upload one if needed.
                  </p>
                </div>
              )}

              <div className="space-y-4">
                {/* File Upload Area */}
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-primary-400 transition-colors">
                  <input
                    type="file"
                    id="prescription-upload"
                    accept="image/*,application/pdf"
                    onChange={onUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="prescription-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <span className="text-lg font-semibold text-gray-700 mb-2">
                      {fileName ? 'Change File' : 'Upload Prescription'}
                    </span>
                    <span className="text-sm text-gray-500">
                      PDF, JPG, PNG (Max 10MB)
                    </span>
                  </label>
                </div>

                {/* File Preview */}
                {filePreview && (
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                    <img src={filePreview} alt="Prescription preview" className="max-w-full h-auto rounded border" />
                  </div>
                )}

                {/* File Name */}
                {fileName && !filePreview && (
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{fileName}</p>
                      <p className="text-sm text-gray-600">PDF Document</p>
                    </div>
                  </div>
                )}

                {/* Status */}
      {status !== 'idle' && (
                  <div className={`p-4 rounded-lg ${
                    status === 'approved' ? 'bg-pharmacy-50 border border-pharmacy-200' :
                    status === 'rejected' ? 'bg-red-50 border border-red-200' :
                    'bg-primary-50 border border-primary-200'
                  }`}>
                    <div className="flex items-center gap-3">
                      {status === 'uploading' && (
                        <>
                          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary-600"></div>
                          <p className="text-primary-700 font-medium">Uploading prescription...</p>
                        </>
                      )}
                      {status === 'verifying' && (
                        <>
                          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary-600"></div>
                          <p className="text-primary-700 font-medium">Verifying with pharmacy...</p>
                        </>
                      )}
                      {status === 'approved' && (
                        <>
                          <svg className="w-6 h-6 text-pharmacy-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <p className="text-pharmacy-700 font-medium">Prescription verified and approved!</p>
                        </>
                      )}
                      {status === 'rejected' && (
                        <>
                          <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          <p className="text-red-700 font-medium">Prescription was rejected. Please upload a valid prescription.</p>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Delivery Options */}
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span>🚚</span> Delivery Options
              </h2>
              <div className="space-y-4">
                <label className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer hover:border-primary-400 transition-colors">
                  <input
                    type="radio"
                    name="delivery"
                    checked={!delivery}
                    onChange={() => setDelivery(false)}
                    className="w-5 h-5 text-primary-600"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">Pickup from Pharmacy</p>
                    <p className="text-sm text-gray-600">Collect your order from the pharmacy</p>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer hover:border-primary-400 transition-colors">
                  <input
                    type="radio"
                    name="delivery"
                    checked={delivery}
                    onChange={() => setDelivery(true)}
                    className="w-5 h-5 text-primary-600"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">Home Delivery</p>
                    <p className="text-sm text-gray-600">Get your medicines delivered to your address</p>
                  </div>
                </label>
                {delivery && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Delivery Address
                    </label>
                    <textarea
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required={delivery}
                      className="input-field"
                      rows={3}
                      placeholder="Enter your full delivery address..."
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Actions */}
            <div className="card bg-primary-50 border-2 border-primary-200">
              <h3 className="font-bold text-gray-900 mb-4">Order Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Items:</span>
                  <span className="font-medium text-gray-900">{items.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total:</span>
                  <span className="font-bold text-primary-600 text-lg">
                    {total().toLocaleString()} RWF
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery:</span>
                  <span className="font-medium text-gray-900">
                    {delivery ? 'Home Delivery' : 'Pickup'}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handlePlaceOrder}
                disabled={placing || (requiresPrescription && status !== 'approved')}
                className={`w-full btn-primary ${placing || (requiresPrescription && status !== 'approved') ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {placing ? 'Placing Order...' : 'Place Order'}
              </button>
              <Link to="/cart" className="block w-full btn-secondary text-center">
                Back to Cart
              </Link>
            </div>

            {/* Info Card */}
            <div className="card bg-yellow-50 border border-yellow-200">
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <span>ℹ️</span> Important
              </h3>
              <p className="text-sm text-gray-700">
                {requiresPrescription 
                  ? 'Your order requires a valid prescription. Please upload it before placing the order.'
                  : 'For prescription medicines, ensure you have a valid doctor\'s prescription.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



