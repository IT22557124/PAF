import React from "react";
import { Link, useNavigate } from "react-router-dom";

const PlanList = ({ plans }) => {

  const navigate = useNavigate()

  return (
    <div className="p-6  min-h-screen">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Learning Plans
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 cursor-pointer"
            onClick={()=>{
                navigate("/plans/"+plan.id)
            }}
          >
            {/* Header Section */}
            <div className="p-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white">
              <h2 className="text-xl font-semibold">{plan.title}</h2>
              <p className="text-sm mt-1">{plan.category} | {plan.skillLevel}</p>
            </div>

            {/* Body Section */}
            <div className="p-4">
              <p className="text-gray-700 mb-4">{plan.description}</p>
              <div className="flex justify-between items-center text-sm text-gray-600">
                <span>Estimated Hours: {plan.estimatedHours}</span>
                <span>
                  Completion: {plan.completionPercentage.toFixed(2)}%
                </span>
              </div>

              {/* Tags */}
              <div className="mt-4 flex flex-wrap gap-2">
                {plan.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Owner Info  */}
            
              
              
            </div>

            
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlanList;