import React, { useEffect, useState } from "react";
import useAxiosFetch from "../../../../hooks/useAxiosFetch";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import { useNavigate } from "react-router-dom";
import LargeModal from "../../../../components/Modal/LargeModal";
import Modal from "../../../../components/Modal/Modal";
import SearchBar from "../../../../components/Search/SearchBar";
import { ToastContainer, toast } from "react-toastify";
import { MdDelete } from "react-icons/md";
import { FaEdit, FaFilePdf, FaFileExcel } from "react-icons/fa";
import { HiRefresh } from "react-icons/hi";
import * as XLSX from "xlsx";
import { writeFile } from "xlsx";
import PlantForm from "./PlantForm";
import PlantReport from "./PlantReport";
import { BlobProvider } from "@react-pdf/renderer";
import Pagination from "../../../../components/Pagination/Pagination";

function Plant() {
  const axiosFetch = useAxiosFetch();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [filteredDataList, setFilteredDataList] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [plantsPerPage] = useState(3); // Adjust as needed

  useEffect(() => {
    fetchPlants();
  }, []);

  const fetchPlants = async () => {
    try {
      const response = await axiosFetch.get("/Plant/");
      console.log("Fetched Plants Data:", response.data);
      if (Array.isArray(response.data)) {
        setDataList(response.data);
        setFilteredDataList(response.data);
      } else {
        console.error("Unexpected data format:", response.data);
        toast.error("Unexpected data format from server.");
      }
    } catch (err) {
      console.error("Error fetching plants:", err);
      toast.error("Failed to fetch plants.");
    }
  };

  const handleSearch = (query) => {
    const filteredList = dataList.filter((plant) => {
      const fullName = `${plant.name} `;
      return fullName.toLowerCase().includes(query.toLowerCase());
    });
    setFilteredDataList(filteredList);
  };

  const generateExcelFile = () => {
    const rearrangedDataList = dataList.map((plant) => ({
      Plant_Name: plant.name,
      Description: plant.description,
      Climate: plant.climate,
      Soil_pH: plant.soilPh,
      Land_Preparation: plant.landPreparation,
      Fertilizers: plant.fertilizers,
    }));

    const ws = XLSX.utils.json_to_sheet(rearrangedDataList);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Plant Report");
    writeFile(wb, "plant_report.xlsx");
  };

  const handleRefreshClick = () => {
    fetchPlants();
  };
  const handleButtonClick = () => {
    generateExcelFile();
  };

  const handleAddModalOpen = () => setAddModalOpen(true);
  const handleAddModalClose = () => setAddModalOpen(false);

  const handleEditModalOpen = (plant) => {
    setSelectedPlant(plant);
    setEditModalOpen(true);
  };
  const handleEditModalClose = () => setEditModalOpen(false);

  const handleDelete = async (id) => {
    try {
      await axiosSecure.delete(`/Plant/delete/${id}`);
      toast.success("Successfully Deleted!");
      fetchPlants();
      handleCloseDeleteModal();
    } catch (err) {
      console.error("Error deleting plant:", err);
      toast.error("Failed to delete plant.");
    }
  };

  const handleAddSubmit = async (formData) => {
    try {
      await axiosSecure.post("/Plant/add", formData);
      toast.success("Plant Added!");
      handleAddModalClose();
      fetchPlants();
    } catch (err) {
      console.error("Error adding plant:", err);
      toast.error("Failed to add plant.");
    }
  };

  const handleEditSubmit = async (formData) => {
    try {
      await axiosSecure.put(`/Plant/update/${formData._id}`, formData);
      toast.success("Plant Updated!");
      handleEditModalClose();
      fetchPlants();
    } catch (err) {
      console.error("Error updating plant:", err);
      toast.error("Failed to update plant.");
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

  const handleViewDiseases = (plantId) => {
    navigate(`/dashboard/manage-plant/diseases/${plantId}`);
  };

  // Pagination calculations
  const indexOfLastPlant = currentPage * plantsPerPage;
  const indexOfFirstPlant = indexOfLastPlant - plantsPerPage;
  const currentPlants = filteredDataList.slice(
    indexOfFirstPlant,
    indexOfLastPlant
  );
  const totalPages = Math.ceil(filteredDataList.length / plantsPerPage);

  return (
    <div className="mt-10 p-4 bg-gray-50">
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-700">
              Plant Details
            </h2>
            <h6 className="text-sm text-gray-500">Manage plant details</h6>
          </div>
          <div className="flex space-x-4">
            <BlobProvider
              document={<PlantReport dataList={dataList} />}
              fileName="FruitReport.pdf"
            >
              {({ url, blob }) => (
                <li className="flex items-center">
                  <a href={url} target="_blank" className="flex items-center">
                    <FaFilePdf className="text-3xl text-red-600" />
                  </a>
                </li>
              )}
            </BlobProvider>
            <li className="flex items-center">
              <a
                href="#"
                onClick={handleButtonClick}
                className="flex items-center"
              >
                <FaFileExcel className="text-3xl text-green-600" />
              </a>
            </li>

            <button
              className="text-blue-500 hover:underline"
              onClick={handleRefreshClick}
            >
              <HiRefresh className="text-3xl" />
            </button>
            <button
              className="bg-secondary hover:scale-105 text-white py-2 px-4 rounded-lg"
              onClick={handleAddModalOpen}
            >
              Add Plant
            </button>
          </div>
        </div>

        <LargeModal
          isOpen={addModalOpen}
          onClose={handleAddModalClose}
          title="Add Plant"
        >
          <PlantForm handleSubmit={handleAddSubmit} />
        </LargeModal>

        <LargeModal
          isOpen={editModalOpen}
          onClose={handleEditModalClose}
          title="Edit Plant"
        >
          <PlantForm
            handleSubmit={handleEditSubmit}
            initialData={selectedPlant}
          />
        </LargeModal>

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
              <th className="p-4 text-left">Image</th>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Description</th>
              <th className="p-4 text-left">Climate</th>
              <th className="p-4 text-left">Soil pH</th>
              <th className="p-4 text-left">Land Preparation</th>
              <th className="p-4 text-left">Fertilizers</th>
              <th className="p-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentPlants.length ? (
              currentPlants.map((plant) => (
                <React.Fragment key={plant._id}>
                  <tr className="border-b">
                    <td className="p-4">
                      {plant.imageUrl && (
                        <img
                          src={plant.imageUrl}
                          alt="Plant"
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                      )}
                    </td>
                    <td className="p-4">{plant.name}</td>
                    <td className="p-4">{plant.description}</td>
                    <td className="p-4">{plant.climate}</td>
                    <td className="p-4">{plant.soilPh}</td>
                    <td className="p-4">{plant.landPreparation}</td>
                    <td className="p-4 w-40">
                      <ul className="list-disc list-inside">
                        {plant.fertilizers.map((fertilizer, index) => (
                          <li key={index}>{fertilizer}</li>
                        ))}
                      </ul>
                    </td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        <button
                          className="text-3xl text-blue-600 hover:text-blue-800"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditModalOpen(plant);
                          }}
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="text-3xl text-red-600 hover:text-red-800"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleShowDeleteModal(plant._id);
                          }}
                        >
                          <MdDelete />
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr onClick={() => handleViewDiseases(plant._id)}>
                    <td
                      colSpan="9"
                      className=" border-b-2 border-gray-500 text-center hover:bg-secondary hover:animate-pulse"
                    >
                      <button
                        className="text-green-600 hover:text-green-800"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewDiseases(plant._id);
                        }}
                      >
                        <p>
                          Diseases{" "}
                          <span className="animate-bounce">&gt;&gt;</span>{" "}
                        </p>
                      </button>
                    </td>
                  </tr>
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td
                  colSpan="9"
                  className="text-center  p-4 text-gray-500 font-semibold"
                >
                  No plants found.
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

export default Plant;
