import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const PlansPage = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      // TODO: Implement API call to fetch plans
      const response = await fetch('/api/learning-plans');
      const data = await response.json();
      setPlans(data);
    } catch (error) {
      toast.error('Failed to load learning plans');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePlan = () => {
    setShowCreateModal(true);
  };

  const handleEditPlan = (plan) => {
    setSelectedPlan(plan);
    setShowUpdateModal(true);
  };

  const handleViewPlan = (planId) => {
    navigate(`/plans/${planId}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Learning Plans</h1>
        <button
          onClick={handleCreatePlan}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create New Plan
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="border rounded-lg p-4 hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-2">{plan.title}</h2>
            <p className="text-gray-600 mb-4">{plan.description}</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => handleViewPlan(plan.id)}
                className="text-blue-500 hover:text-blue-700"
              >
                View
              </button>
              <button
                onClick={() => handleEditPlan(plan)}
                className="text-green-500 hover:text-green-700"
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal components will be rendered here */}
      {showCreateModal && (
        <CreatePlanModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={fetchPlans}
        />
      )}
      
      {showUpdateModal && selectedPlan && (
        <UpdatePlanModal
          plan={selectedPlan}
          onClose={() => {
            setShowUpdateModal(false);
            setSelectedPlan(null);
          }}
          onSuccess={fetchPlans}
        />
      )}
    </div>
  );
};

export default PlansPage;
