import { Link } from 'react-router-dom';
import { useCartStore } from '@/store/cartStore';

export function Cart() {
  const { items, remove, clear, total, setQuantity, add } = useCartStore();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-8">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">🛒 Shopping Cart</h1>
          <p className="text-primary-100">Review your items before checkout</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {items.length === 0 ? (
          <div className="card text-center py-12">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h3>
            <p className="text-gray-600 mb-6">Start adding medicines to your cart to continue.</p>
            <Link to="/pharmacies" className="btn-primary">
              Browse Pharmacies
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="md:col-span-2 space-y-4">
              {items.map((i) => (
                <div key={`${i.pharmacyId}-${i.medicineId}`} className="card">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-900 mb-1">{i.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {i.priceRWF.toLocaleString()} RWF each
                      </p>
                      {i.requiresPrescription && (
                        <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">
                          📋 Prescription Required
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 border-2 border-gray-300 rounded-lg">
                        <button
                          className="px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                          onClick={() => setQuantity(i.pharmacyId, i.medicineId, i.quantity - 1)}
                          disabled={i.quantity <= 1}
                        >
                          −
                        </button>
                        <input
                          className="w-16 border-0 text-center focus:outline-none"
                          type="number"
                          min={1}
                          value={i.quantity}
                          onChange={(e) => setQuantity(i.pharmacyId, i.medicineId, Math.max(1, Number(e.target.value || 1)))}
                        />
                        <button
                          className="px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                          onClick={() => add({ ...i, quantity: 1 })}
                        >
                          +
                        </button>
                      </div>
                      <div className="w-24 text-right">
                        <p className="font-bold text-lg text-primary-600">
                          {(i.priceRWF * i.quantity).toLocaleString()} RWF
                        </p>
                      </div>
                      <button
                        onClick={() => remove(i.pharmacyId, i.medicineId)}
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                        title="Remove item"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="flex justify-between items-center pt-4">
                <button
                  onClick={clear}
                  className="text-red-600 hover:text-red-700 font-medium transition-colors"
                >
                  Clear Cart
                </button>
                <Link to="/pharmacies" className="text-primary-600 hover:text-primary-700 font-medium transition-colors">
                  Continue Shopping →
                </Link>
              </div>
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              <div className="card bg-primary-50 border-2 border-primary-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Items ({items.length}):</span>
                    <span className="font-medium text-gray-900">
                      {items.reduce((sum, i) => sum + i.quantity, 0)} items
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium text-gray-900">
                      {total().toLocaleString()} RWF
                    </span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-900">Total:</span>
                      <span className="text-2xl font-bold text-primary-600">
                        {total().toLocaleString()} RWF
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Link to="/prescription" className="block w-full btn-primary text-center">
                  Proceed to Checkout
                </Link>
                <Link to="/pharmacies" className="block w-full btn-secondary text-center">
                  Continue Shopping
                </Link>
              </div>

              {items.some(i => i.requiresPrescription) && (
                <div className="card bg-yellow-50 border border-yellow-200">
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <span>ℹ️</span> Prescription Required
                  </h3>
                  <p className="text-sm text-gray-700">
                    Some items in your cart require a prescription. You'll be asked to upload it during checkout.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}



