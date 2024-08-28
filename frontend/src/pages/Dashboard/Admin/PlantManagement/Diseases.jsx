import React, { useEffect, useState } from "react";
import useAxiosFetch from "../../../../hooks/useAxiosFetch";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import { useNavigate, useParams } from "react-router-dom";
import Modal from "../../../../components/Modal/Modal";
import DiseaseForm from "./DiseaseForm";
import { ToastContainer, toast } from "react-toastify";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";

function Diseases() {
  const axiosFetch = useAxiosFetch();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const { plantId } = useParams();
  const [diseases, setDiseases] = useState([]);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedDisease, setSelectedDisease] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchDiseases();
  }, [plantId]);

  const fetchDiseases = async () => {
    try {
      const response = await axiosFetch.get(`/api/diseases/plant/${plantId}`);
      console.log("Fetched Diseases Data:", response.data); // Debug log
      if (Array.isArray(response.data)) {
        setDiseases(response.data);
      } else {
        console.error("Unexpected data format:", response.data);
        toast.error("Unexpected data format from server.");
      }
    } catch (err) {
      console.error("Error fetching diseases:", err);
      toast.error("Failed to fetch diseases.");
    }
  };

  const handleAddModalOpen = () => setAddModalOpen(true);
  const handleAddModalClose = () => setAddModalOpen(false);

  const handleEditModalOpen = (disease) => {
    setSelectedDisease(disease);
    setEditModalOpen(true);
  };
  const handleEditModalClose = () => setEditModalOpen(false);

  const handleDelete = async (id) => {
    try {
      await axiosSecure.delete(`/api/diseases/${id}`);
      toast.success("Disease Deleted!");
      fetchDiseases(); // Ensure data is refreshed after deletion
      handleCloseDeleteModal();
    } catch (err) {
      console.error("Error deleting disease:", err);
      toast.error("Failed to delete disease.");
    }
  };

  const handleAddSubmit = async (formData) => {
    try {
      await axiosSecure.post(`/api/diseases`, { ...formData, plantId });
      toast.success("Disease Added!");
      handleAddModalClose();
      fetchDiseases(); // Refresh data after adding a disease
    } catch (err) {
      console.error("Error adding disease:", err);
      toast.error("Failed to add disease.");
    }
  };

  const handleEditSubmit = async (formData) => {
    try {
      await axiosSecure.put(`/api/diseases/${formData._id}`, formData);
      toast.success("Disease Updated!");
      handleEditModalClose();
      fetchDiseases(); // Refresh data after editing a disease
    } catch (err) {
      console.error("Error updating disease:", err);
      toast.error("Failed to update disease.");
    }
  };

  const handleShowDeleteModal = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };
  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setDeleteId(null);
  };

  return (
    <div className="mt-10 p-4 bg-gray-50">
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-700">
              Plant Diseases
            </h2>
            <h6 className="text-sm text-gray-500">
              Manage diseases for this plant
            </h6>
          </div>
          <div className="flex space-x-4">
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded-lg"
              onClick={handleAddModalOpen}
            >
              Add Disease
            </button>
          </div>
        </div>

        {/* Add Disease Modal */}
        <Modal
          isOpen={addModalOpen}
          onClose={handleAddModalClose}
          title="Add Disease"
        >
          <DiseaseForm handleSubmit={handleAddSubmit} />
        </Modal>

        {/* Edit Disease Modal */}
        <Modal
          isOpen={editModalOpen}
          onClose={handleEditModalClose}
          title="Edit Disease"
        >
          <DiseaseForm
            handleSubmit={handleEditSubmit}
            initialData={selectedDisease}
          />
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={showDeleteModal}
          onClose={handleCloseDeleteModal}
          title="Confirm Delete"
        >
          <p>Are you sure you want to delete this disease?</p>
          <div className="mt-6 flex justify-end">
            <button
              className="px-4 py-2 mr-4 bg-gray-300 rounded hover:bg-gray-400"
              onClick={handleCloseDeleteModal}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              onClick={() => handleDelete(deleteId)}
            >
              Delete
            </button>
          </div>
        </Modal>

        <table className="w-full mt-6 bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Description</th>
              <th className="p-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {diseases.length ? (
              diseases.map((disease) => (
                <tr key={disease._id} className="border-b">
                  <td className="p-4">{disease.name}</td>
                  <td className="p-4">{disease.description}</td>
                  <td className="p-4 flex space-x-2">
                    <button
                      className="text-blue-500 hover:underline"
                      onClick={() => handleEditModalOpen(disease)}
                    >
                      <FaEdit className="text-3xl" />
                    </button>
                    <button
                      className="text-red-500 hover:underline"
                      onClick={() => handleShowDeleteModal(disease._id)}
                    >
                      <MdDelete className="text-3xl" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="p-4 text-center text-gray-500">
                  No Data
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default Diseases;
