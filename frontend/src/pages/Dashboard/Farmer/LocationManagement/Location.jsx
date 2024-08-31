import React, { useEffect, useState } from "react";
import useAxiosFetch from "../../../../hooks/useAxiosFetch";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import { useNavigate } from "react-router-dom";
import Modal from "../../../../components/Modal/Modal";
import LocationForm from "./LocationForm";
import SearchBar from "../../../../components/Search/SearchBar";
import { ToastContainer, toast } from "react-toastify";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import Pagination from "../../../../components/Pagination/Pagination";

function Location() {
  const axiosFetch = useAxiosFetch();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  
  const [location, setLocation] = useState([]);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [filteredDataList, setFilteredDataList] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [locationsPerPage] = useState(2); // Adjust as needed

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const response = await axiosFetch.get("/Location/");
      console.log("Fetched Locations Data:", response.data); // Debug log
      // Verify the data structure
      if (Array.isArray(response.data)) {
        setDataList(response.data);
        setFilteredDataList(response.data);
      } else {
        console.error("Unexpected data format:", response.data);
        toast.error("Unexpected data format from server.");
      }
    } catch (err) {
      console.error("Error fetching locations:", err);
      toast.error("Failed to fetch locations.");
    }
  };

  const handleSearch = (query) => {
    const filteredList = dataList.filter((location) => {
      const city = `${location.city}`;
      return city.toLowerCase().includes(query.toLowerCase());
    });
    setFilteredDataList(filteredList);
  };

  const handleRefreshClick = () => {
    fetchLocations();
  };

  const handleAddModalOpen = () => setAddModalOpen(true);
  const handleAddModalClose = () => setAddModalOpen(false);

  const handleEditModalOpen = (location) => {
    setSelectedLocation(location);
    setEditModalOpen(true);
  };
  const handleEditModalClose = () => setEditModalOpen(false);

  const handleDelete = async (id) => {
    try {
      await axiosSecure.delete(`/Location/delete/${id}`);
      toast.success("Successfully Deleted!");
      fetchLocations(); // Ensure data is refreshed after deletion
      handleCloseDeleteModal();
    } catch (err) {
      console.error("Error deleting location:", err);
      toast.error("Failed to delete location.");
    }
  };

  const handleAddSubmit = async (formData) => {
    try {
      await axiosSecure.post("/Location/add", formData);
      toast.success("Location Added!");
      handleAddModalClose();
      fetchLocations(); // Refresh data after adding a location
    } catch (err) {
      console.error("Error adding location:", err);
      toast.error("Failed to add location.");
    }
  };

  const handleEditSubmit = async (formData) => {
    try {
      await axiosSecure.put(`/Location/update/${formData._id}`, formData);
      toast.success("Location Updated!");
      handleEditModalClose();
      fetchLocations(); // Refresh data after editing a location
    } catch (err) {
      console.error("Error updating location:", err);
      toast.error("Failed to update location.");
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

  const handleViewCrops = (locationId) => {
    navigate(`/dashboard/location/crops/${locationId}`);
  };

  // Pagination calculations
  const indexOfLastLocation = currentPage * locationsPerPage;
  const indexOfFirstLocation = indexOfLastLocation - locationsPerPage;
  const currentLocation = filteredDataList.slice(
    indexOfFirstLocation,
    indexOfLastLocation
  );
  const totalPages = Math.ceil(filteredDataList.length / locationsPerPage);
  
  return (
    <div className="mt-10 p-4 bg-gray-50">
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-700">
              Location Details
            </h2>
            <h6 className="text-sm text-gray-500">Manage location details</h6>
          </div>
          <div className="flex space-x-4">
            <button
              className="text-blue-500 hover:underline"
              onClick={handleRefreshClick}
            >
              Refresh
            </button>
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded-lg"
              onClick={handleAddModalOpen}
            >
              Add Location
            </button>
          </div>
        </div>

        {/* Add Location Modal */}
        <Modal
          isOpen={addModalOpen}
          onClose={handleAddModalClose}
          title="Add Location"
        >
          <LocationForm handleSubmit={handleAddSubmit} />
        </Modal>

        {/* Edit Location Modal */}
        <Modal
          isOpen={editModalOpen}
          onClose={handleEditModalClose}
          title="Edit Location"
        >
          <LocationForm
            handleSubmit={handleEditSubmit}
            initialData={selectedLocation}
          />
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={showDeleteModal}
          onClose={handleCloseDeleteModal}
          title="Confirm Delete"
        >
          <p>Are you sure you want to delete this record?</p>
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

        <SearchBar onSearch={handleSearch} />

        <table className="w-full mt-6 bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">Province</th>
              <th className="p-4 text-left">District</th>
              <th className="p-4 text-left">City</th>
              <th className="p-4 text-left">Latitude</th>
              <th className="p-4 text-left">Longitude</th>
              <th className="p-4 text-left">Area Size</th>
              <th className="p-4 text-left">Soil Type</th>
              <th className="p-4 text-left">Irrigation Type</th>
              <th className="p-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentLocation.length ? (
              currentLocation.map((location) => (
                <tr key={location._id} className="border-b">
                  <td className="p-4">{location.province}</td>
                  <td className="p-4">{location.district}</td>
                  <td className="p-4">{location.city}</td>
                  <td className="p-4">{location.latitude}</td>
                  <td className="p-4">{location.longitude}</td>
                  <td className="p-4">{location.areaSize}</td>
                  <td className="p-4">{location.soilType}</td>
                  <td className="p-4">{location.irrigationType}</td>
                  <td className="p-4 flex space-x-2">
                    <button
                      className="text-green-500 hover:underline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewCrops(location._id);
                      }}
                    >
                      View Crops
                    </button>
                    <button
                      className="text-blue-500 hover:underline"
                      onClick={() => handleEditModalOpen(location)}
                    >
                      <FaEdit className="text-3xl" />
                    </button>
                    <button
                      className="text-red-500 hover:underline"
                      onClick={() => handleShowDeleteModal(location._id)}
                    >
                      <MdDelete className="text-3xl" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="p-4 text-center text-gray-500">
                  No Data
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
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

export default Location;
