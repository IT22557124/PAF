import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProgressUpdateApi from "../api/progressApi";

const ProgressPage = () => {
  const navigate = useNavigate();
  const currentUserId = localStorage.getItem("userId");
  const [progressUpdates, setProgressUpdates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch progress updates on component mount
  useEffect(() => {
    const fetchProgressUpdates = async () => {
      try {
        const updates = await ProgressUpdateApi.getAllProgressUpdates();
        setProgressUpdates(updates);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load progress updates");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProgressUpdates();
  }, [currentUserId]);

  // Handle delete progress update
  const handleDelete = async (id) => {
    if (
      window.confirm("Are you sure you want to delete this progress update?")
    ) {
      try {
        await ProgressUpdateApi.deleteProgressUpdate(id);
        setProgressUpdates(
          progressUpdates.filter((update) => update.id !== id)
        );
        toast.success("Progress update deleted successfully");
      } catch (error) {
        console.error(error);
        toast.error("Failed to delete progress update");
      }
    }
  };

  // Format date to readable format
  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-indigo-700">Progress Updates</h1>
        <button
          onClick={() => navigate("/create-progress")}
          className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white rounded-md"
        >
          + New Update
        </button>
      </div>

      {progressUpdates.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            You haven't created any progress updates yet.
          </p>
          <button
            onClick={() => navigate("/create-progress")}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Create Your First Update
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {progressUpdates.map((update) => (
            <div
              key={update.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              {/* Header with user info and actions */}
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-start">
                <Link
                  to={
                    currentUserId === update.user.id
                      ? "/profile"
                      : "/profile/" + update.user.id
                  }
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={
                        update.user.profileImageUrl ||
                        "https://via.placeholder.com/40"
                      }
                      alt={update.user.username}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium text-gray-900">
                        {update.user.username}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatDate(update.createdAt)}
                      </p>
                    </div>
                  </div>
                </Link>

                {update.user.id === currentUserId && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => navigate(`/edit-progress/${update.id}`)}
                      className="text-indigo-600 hover:text-indigo-800"
                      title="Edit"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(update.id)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                )}
              </div>

              {/* Progress content */}
              <div className="px-6 py-4">
                <div className="flex justify-between items-start mb-3">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {update.title}
                  </h2>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      update.type === "MILESTONE"
                        ? "bg-purple-100 text-purple-800"
                        : update.type === "DAILY_UPDATE"
                        ? "bg-blue-100 text-blue-800"
                        : update.type === "CHALLENGE"
                        ? "bg-orange-100 text-orange-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {update.type.toLowerCase().replace("_", " ")}
                  </span>
                </div>

                <p className="text-gray-700 mb-4 whitespace-pre-line">
                  {update.content}
                </p>

                {/* Stats and metadata */}
                <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {update.hoursSpent} hours spent
                  </div>

                  {update.rating && (
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      Rating: {update.rating}/5
                    </div>
                  )}

                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Feeling: {update.sentiment.toLowerCase()}
                  </div>
                </div>

                {/* Challenges and Achievements */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {update.challenges.length > 0 && (
                    <div className="bg-red-50 p-3 rounded-lg">
                      <h3 className="font-medium text-red-800 mb-2 flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Challenges
                      </h3>
                      <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                        {update.challenges.map((challenge, index) => (
                          <li key={index}>{challenge}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {update.achievements.length > 0 && (
                    <div className="bg-green-50 p-3 rounded-lg">
                      <h3 className="font-medium text-green-800 mb-2 flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Achievements
                      </h3>
                      <ul className="list-disc list-inside text-sm text-green-700 space-y-1">
                        {update.achievements.map((achievement, index) => (
                          <li key={index}>{achievement}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProgressPage;
