import { useState } from 'react';
import { Link } from 'react-router-dom';

interface Order {
  id: string;
  customerName: string;
  items: string[];
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'ready' | 'delivered' | 'cancelled';
  prescriptionStatus: 'pending' | 'verified' | 'rejected';
  delivery: boolean;
  address?: string;
  createdAt: string;
}

interface MedicineStock {
  id: string;
  name: string;
  strength: string;
  quantity: number;
  priceRWF: number;
  requiresPrescription: boolean;
}

export function PharmacyDashboard() {
  const [activeTab, setActiveTab] = useState<'orders' | 'stock'>('orders');
  const [orders] = useState<Order[]>([
    {
      id: 'ORD-001',
      customerName: 'John Doe',
      items: ['Amoxicillin 500mg x 2', 'Paracetamol 500mg x 1'],
      total: 5500,
      status: 'pending',
      prescriptionStatus: 'pending',
      delivery: true,
      address: 'Kacyiru, KG 123 St',
      createdAt: '2024-01-15 10:30'
    },
    {
      id: 'ORD-002',
      customerName: 'Jane Smith',
      items: ['Ibuprofen 200mg x 1'],
      total: 800,
      status: 'confirmed',
      prescriptionStatus: 'verified',
      delivery: false,
      createdAt: '2024-01-15 09:15'
    },
    {
      id: 'ORD-003',
      customerName: 'Bob Johnson',
      items: ['Azithromycin 250mg x 1'],
      total: 3500,
      status: 'processing',
      prescriptionStatus: 'verified',
      delivery: true,
      address: 'Remera, KG 456 St',
      createdAt: '2024-01-15 08:45'
    }
  ]);

  const [stock] = useState<MedicineStock[]>([
    { id: 'med-1', name: 'Amoxicillin', strength: '500mg', quantity: 24, priceRWF: 2500, requiresPrescription: true },
    { id: 'med-2', name: 'Paracetamol', strength: '500mg', quantity: 100, priceRWF: 500, requiresPrescription: false },
    { id: 'med-3', name: 'Ibuprofen', strength: '200mg', quantity: 40, priceRWF: 800, requiresPrescription: false },
    { id: 'med-4', name: 'Azithromycin', strength: '250mg', quantity: 12, priceRWF: 3500, requiresPrescription: true },
  ]);

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    // In a real app, this would call an API
    console.log(`Updating order ${orderId} to ${newStatus}`);
  };

  const updatePrescriptionStatus = (orderId: string, newStatus: Order['prescriptionStatus']) => {
    // In a real app, this would call an API
    console.log(`Updating prescription status for order ${orderId} to ${newStatus}`);
  };

  const updateStock = (medicineId: string, quantity: number, price: number) => {
    // In a real app, this would call an API
    console.log(`Updating stock for ${medicineId}: quantity=${quantity}, price=${price}`);
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-primary-100 text-primary-800';
      case 'ready': return 'bg-pharmacy-100 text-pharmacy-800';
      case 'delivered': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">🏥 Pharmacy Dashboard</h1>
              <p className="text-primary-100">Manage your pharmacy operations</p>
            </div>
            <Link to="/" className="btn-secondary bg-white/20 text-white border-white hover:bg-white/30">
              Back to Home
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="mb-6">
          <div className="flex gap-4 border-b">
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-6 py-3 font-semibold transition-colors ${
                activeTab === 'orders'
                  ? 'border-b-2 border-primary-600 text-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              📋 Orders ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab('stock')}
              className={`px-6 py-3 font-semibold transition-colors ${
                activeTab === 'stock'
                  ? 'border-b-2 border-primary-600 text-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              💊 Stock Management
            </button>
          </div>
        </div>

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="card">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <h3 className="text-lg font-bold text-gray-900">Order {order.id}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                      {order.prescriptionStatus === 'pending' && (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
                          ⏳ Prescription Pending
                        </span>
                      )}
                      {order.prescriptionStatus === 'verified' && (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-pharmacy-100 text-pharmacy-800">
                          ✓ Prescription Verified
                        </span>
                      )}
                    </div>
                    <div className="space-y-2 text-sm text-gray-700">
                      <p><span className="font-semibold">Customer:</span> {order.customerName}</p>
                      <p><span className="font-semibold">Items:</span> {order.items.join(', ')}</p>
                      <p><span className="font-semibold">Total:</span> {order.total.toLocaleString()} RWF</p>
                      <p><span className="font-semibold">Delivery:</span> {order.delivery ? `Yes - ${order.address}` : 'No (Pickup)'}</p>
                      <p><span className="font-semibold">Created:</span> {order.createdAt}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    {order.prescriptionStatus === 'pending' && (
                      <>
                        <button
                          onClick={() => updatePrescriptionStatus(order.id, 'verified')}
                          className="btn-primary text-sm py-2"
                        >
                          ✓ Verify Prescription
                        </button>
                        <button
                          onClick={() => updatePrescriptionStatus(order.id, 'rejected')}
                          className="btn-secondary border-red-600 text-red-600 hover:bg-red-50 text-sm py-2"
                        >
                          ✗ Reject Prescription
                        </button>
                      </>
                    )}
                    {order.status === 'pending' && order.prescriptionStatus === 'verified' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'confirmed')}
                        className="btn-primary text-sm py-2"
                      >
                        Confirm Order
                      </button>
                    )}
                    {order.status === 'confirmed' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'processing')}
                        className="btn-primary text-sm py-2"
                      >
                        Start Processing
                      </button>
                    )}
                    {order.status === 'processing' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'ready')}
                        className="btn-primary text-sm py-2 bg-pharmacy-600 hover:bg-pharmacy-700"
                      >
                        Mark Ready
                      </button>
                    )}
                    {order.status === 'ready' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'delivered')}
                        className="btn-primary text-sm py-2"
                      >
                        Mark Delivered
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stock Tab */}
        {activeTab === 'stock' && (
          <div className="space-y-4">
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Medicine Stock</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="text-left p-3 text-sm font-semibold text-gray-700">Medicine</th>
                      <th className="text-left p-3 text-sm font-semibold text-gray-700">Strength</th>
                      <th className="text-left p-3 text-sm font-semibold text-gray-700">Quantity</th>
                      <th className="text-left p-3 text-sm font-semibold text-gray-700">Price (RWF)</th>
                      <th className="text-left p-3 text-sm font-semibold text-gray-700">Prescription</th>
                      <th className="text-left p-3 text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {stock.map((med) => (
                      <tr key={med.id} className="hover:bg-gray-50">
                        <td className="p-3 font-medium text-gray-900">{med.name}</td>
                        <td className="p-3 text-gray-600">{med.strength}</td>
                        <td className="p-3">
                          <input
                            type="number"
                            defaultValue={med.quantity}
                            className="w-20 border rounded px-2 py-1 text-sm"
                            onBlur={(e) => updateStock(med.id, Number(e.target.value), med.priceRWF)}
                          />
                        </td>
                        <td className="p-3">
                          <input
                            type="number"
                            defaultValue={med.priceRWF}
                            className="w-24 border rounded px-2 py-1 text-sm"
                            onBlur={(e) => updateStock(med.id, med.quantity, Number(e.target.value))}
                          />
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            med.requiresPrescription
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {med.requiresPrescription ? 'Required' : 'No'}
                          </span>
                        </td>
                        <td className="p-3">
                          <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                            Update
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="card bg-primary-50 border-2 border-primary-200">
              <h3 className="font-bold text-gray-900 mb-2">💡 Quick Tips</h3>
              <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                <li>Update stock quantities as medicines are sold or restocked</li>
                <li>Adjust prices when needed to reflect current market rates</li>
                <li>Verify prescriptions before confirming orders</li>
                <li>Update order status as you process each order</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

