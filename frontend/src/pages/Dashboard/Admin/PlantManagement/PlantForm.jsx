import React, { useState, useEffect } from "react";
import storage from "../../../../config/firebase.init";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const PlantForm = ({ handleSubmit, initialData }) => {
  const [img, setImg] = useState(undefined);
  const [imgPerc, setImgPerc] = useState(0);
  const [formData, setFormData] = useState({
    imageUrl: "",
    name: "",
    date: "",
    description: "",
    climate: "",
    soilPh: "",
    landPreparation: "",
    fertilizers: [],
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    img && uploadFile(img, "imageUrl");
  }, [img]);

  const uploadFile = (file, fileType) => {
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, "images/plants/" + fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    setUploading(true);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImgPerc(Math.round(progress));
      },
      (error) => {
        console.log(error);
        setUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData((prev) => ({
            ...prev,
            [fileType]: downloadURL,
          }));
          setUploading(false);
        });
      }
    );
  };

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFertilizersChange = (e, index) => {
    const newFertilizers = [...formData.fertilizers];
    newFertilizers[index] = e.target.value;
    setFormData((prev) => ({
      ...prev,
      fertilizers: newFertilizers,
    }));
  };

  const handleAddFertilizer = () => {
    setFormData((prev) => ({
      ...prev,
      fertilizers: [...prev.fertilizers, ""],
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSubmit(formData);
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-4">
      <div className="mb-4">
        <label
          htmlFor="imageUrl"
          className="block text-gray-700 font-semibold mb-1"
        >
          {uploading ? `Uploading: ${imgPerc}%` : "Image"}
        </label>
        <input
          type="file"
          className="w-full p-2 border border-gray-300 rounded-md"
          name="imageUrl"
          onChange={(e) => setImg(e.target.files[0])}
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="name"
          className="block text-gray-700 font-semibold mb-1"
        >
          Plant Name
        </label>
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded-md"
          name="name"
          placeholder="Plant Name"
          onChange={handleChange}
          value={formData.name}
          required
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="date"
          className="block text-gray-700 font-semibold mb-1"
        >
          Date
        </label>
        <input
          type="date"
          className="w-full p-2 border border-gray-300 rounded-md"
          name="date"
          onChange={handleChange}
          value={formData.date}
          required
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="description"
          className="block text-gray-700 font-semibold mb-1"
        >
          Description
        </label>
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded-md"
          name="description"
          placeholder="Description"
          onChange={handleChange}
          value={formData.description}
          required
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="climate"
          className="block text-gray-700 font-semibold mb-1"
        >
          Climate
        </label>
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded-md"
          name="climate"
          placeholder="Climate"
          onChange={handleChange}
          value={formData.climate}
          required
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="soilPh"
          className="block text-gray-700 font-semibold mb-1"
        >
          Soil pH
        </label>
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded-md"
          name="soilPh"
          placeholder="Soil pH"
          onChange={handleChange}
          value={formData.soilPh}
          required
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="landPreparation"
          className="block text-gray-700 font-semibold mb-1"
        >
          Land Preparation
        </label>
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded-md"
          name="landPreparation"
          placeholder="Land Preparation"
          onChange={handleChange}
          value={formData.landPreparation}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-1">
          Fertilizers
        </label>
        {formData.fertilizers.map((fertilizer, index) => (
          <input
            key={index}
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md mt-2"
            name="fertilizers"
            placeholder="Fertilizer"
            value={fertilizer}
            onChange={(e) => handleFertilizersChange(e, index)}
          />
        ))}
        <button
          type="button"
          onClick={handleAddFertilizer}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add Fertilizer
        </button>
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          disabled={uploading}
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default PlantForm;
