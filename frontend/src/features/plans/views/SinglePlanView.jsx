import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import planApi from "../api/planApi";

// This component displays a single learning plan's details
// It fetches the plan data from the API using the planId from the URL parameters
const SinglePlanView = () => {
  const currentUserId = localStorage.getItem("userId");
  const { planId } = useParams();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const fetchedPlan = await planApi.getLearningPlanById(planId);
        setPlan(fetchedPlan);
        setLoading(false);
      } catch (err) {
        setError(err.message || "Failed to load plan");
        setLoading(false);
      }
    };

    fetchPlan();
  }, [planId]);

  const handleDelete = async (planId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this learning plan?");
    
    if (confirmDelete) {
      try {
        await planApi.deleteLearningPlan(planId);
       
        console.log("Learning plan deleted successfully.");
        window.location.href="/plans"
      } catch (error) {
     
        console.error("Error deleting learning plan:", error);
      }
    } else {
      console.log("Delete action was canceled.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl font-medium text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-500 text-lg font-medium">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">{plan.title}</h1>
        <p className="text-sm text-gray-600">
          Created on:{" "}
          {new Date(plan.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>

        <p className="text-sm text-gray-600 mt-2">
          Category: {plan.category} | Skill Level: {plan.skillLevel}
        </p>
      </div>

      {/* Description Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Description
        </h2>
        <p className="text-gray-700">{plan.description}</p>
      </div>

      {/* Learning Units Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Learning Units
        </h2>
        <div className="space-y-4">
          {plan.learningUnits.map((unit) => (
            <div
              key={unit.unitId}
              className="p-4 bg-gray-50 rounded-lg border border-gray-200"
            >
              <h3 className="text-lg font-medium text-gray-800">
                {unit.title}
              </h3>
              <p className="text-gray-600 mt-2">{unit.description}</p>
              <div className="mt-2 flex justify-between items-center text-sm text-gray-600">
                <span>Estimated Hours: {unit.estimatedHours}</span>
                <span>
                  Status:{" "}
                  <span
                    className={`font-medium ${
                      unit.completed ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {unit.completed ? "Completed" : "Not Completed"}
                  </span>
                </span>
              </div>
              <div className="mt-2">
                <h4 className="text-sm font-medium text-gray-700">
                  Objectives:
                </h4>
                <ul className="list-disc list-inside text-gray-600">
                  {unit.objectives.map((objective, index) => (
                    <li key={index}>{objective}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tags Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Tags</h2>
        <div className="flex flex-wrap gap-2">
          {plan.tags.map((tag, index) => (
            <span
              key={index}
              className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Resources Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Resources</h2>
        {plan.resources.length > 0 ? (
          <ul className="list-disc list-inside text-gray-600">
            {plan.resources.map((resource, index) => (
              <li key={index}>
                <a
                  href={resource}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {resource}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No resources available.</p>
        )}
      </div>

      {/* Owner Info Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Plan Owner</h2>
        <div className="flex items-center">
          <img
            src={plan.owner.profileImageUrl || "https://via.placeholder.com/40"}
            alt={plan.owner.username}
            className="w-12 h-12 rounded-full object-cover mr-4"
          />
          <div>
            <p className="font-medium text-gray-800">
              {plan.owner.firstName} {plan.owner.lastName}
            </p>
            <p className="text-sm text-gray-600">@{plan.owner.username}</p>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center text-gray-600">
          <div>
            <p className="text-sm">
              Views: {plan.viewCount} | Forks: {plan.forkCount}
            </p>
            <p className="text-sm">
              Completion Percentage: {plan.completionPercentage.toFixed(2)}%
            </p>
          </div>
          <div>
            {plan.public ? (
              <span className="text-green-500 font-medium">Public</span>
            ) : (
              <span className="text-red-500 font-medium">Private</span>
            )}
          </div>
        </div>
      </div>
      {/* Footer Section */}
      <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
        <div className="text-gray-600 text-sm">
          Views: {plan.viewCount} | Forks: {plan.forkCount}
        </div>
        {currentUserId === plan.owner.id && (
          <div className="space-x-2">
            <Link 
               to={"/edit-plan/"+plan?.id}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
              Edit
            </Link>
            <button 
            onClick={()=>{handleDelete(plan?.id)}}
            
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors">
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SinglePlanView;
