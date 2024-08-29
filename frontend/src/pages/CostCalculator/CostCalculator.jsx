import React, { useState, useEffect } from "react";
import Scroll from "../../hooks/useScroll";
import useUser from "../../hooks/useUser";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAxiosFetch from "../../hooks/useAxiosFetch";

const CostCalculator = () => {
  const [crop, setCrop] = useState("");
  const [area, setArea] = useState(0);
  const [waterResources, setWaterResources] = useState("");
  const [soilType, setSoilType] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [previousCalculations, setPreviousCalculations] = useState([]);
  const [plants, setPlants] = useState([]);
  const { currentUser } = useUser();
  const axiosSecure = useAxiosSecure();
  const axiosFetch = useAxiosFetch();

  useEffect(() => {
    const fetchPreviousCalculations = async () => {
      try {
        const response = await axiosSecure.get("/api/costCalculator/userCalculations", {
          params: { userId: currentUser._id },  // Pass userId as a query parameter
        });
        setPreviousCalculations(response.data);
      } catch (error) {
        console.error("Error fetching previous calculations:", error);
      }
    };

    const fetchPlants = async () => {
      try {
        const response = await axiosFetch.get("/Plant/");
        console.log("Fetched Plants Data:", response.data);
        if (Array.isArray(response.data)) {
          setPlants(response.data); // Store plants data in state
        } else {
          console.error("Unexpected data format:", response.data);
        }
      } catch (err) {
        console.error("Error fetching plants:", err);
      }
    };

    if (currentUser && currentUser._id) {
      fetchPreviousCalculations();
      fetchPlants(); // Fetch plants when component mounts
    }
  }, [currentUser, axiosSecure, axiosFetch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axiosSecure.post("/api/costCalculator/calculate", {
        crop,
        area,
        waterResources,
        soilType,
        userId: currentUser._id, // Include the userId in the request
      });
      setResult(response.data);
      setPreviousCalculations([...previousCalculations, response.data]); // Add new result to previous calculations
    } catch (error) {
      setError("Error calculating cost. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mt-20 mx-auto max-w-4xl p-6 bg-white shadow-lg rounded-lg">
        <Scroll />
        <h1 className="text-4xl font-bold mb-6 text-gray-800 text-center">Cost Calculator</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-lg font-semibold text-gray-700">Crop:</label>
            <div className="flex flex-wrap gap-4 mt-2">
              {plants.map((plant) => (
                <label key={plant._id} className="flex items-center">
                  <input
                    type="radio"
                    value={plant.name}
                    checked={crop === plant.name}
                    onChange={(e) => setCrop(e.target.value)}
                    className="mr-2"
                  />
                  {plant.name}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-lg font-semibold text-gray-700">Area (in acres):</label>
            <input
              type="number"
              className="mt-2 p-2 bg-gray-100 border border-gray-300 rounded-md w-full"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-lg font-semibold text-gray-700">Water Resources:</label>
            <div className="flex flex-wrap gap-4 mt-2">
              {["Abundant", "Moderate", "Scarce", "Limited"].map(waterOption => (
                <label key={waterOption} className="flex items-center">
                  <input
                    type="radio"
                    value={waterOption}
                    checked={waterResources === waterOption}
                    onChange={(e) => setWaterResources(e.target.value)}
                    className="mr-2"
                  />
                  {waterOption}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-lg font-semibold text-gray-700">Soil Type:</label>
            <div className="flex flex-wrap gap-4 mt-2">
              {["Fertile", "Moderately Fertile", "Poor", "Sandy", "Rich"].map(soilOption => (
                <label key={soilOption} className="flex items-center">
                  <input
                    type="radio"
                    value={soilOption}
                    checked={soilType === soilOption}
                    onChange={(e) => setSoilType(e.target.value)}
                    className="mr-2"
                  />
                  {soilOption}
                </label>
              ))}
            </div>
          </div>

          <button
            className="bg-secondary text-white py-2 px-4 rounded-md shadow-md hover:scale-125 transition"
            type="submit"
            disabled={loading}
          >
            {loading ? "Calculating..." : "Calculate"}
          </button>
        </form>

        {error && <p className="text-red-500 mt-4">{error}</p>}
        {result && (
          <div className="mt-8 p-4 border border-gray-300 rounded-md">
            <h2 className="text-2xl font-semibold text-gray-800">Estimated Cost</h2>
            <p className="mt-2">Crop: <span className="font-medium">{result.crop}</span></p>
            <p>Area: <span className="font-medium">{result.area} acres</span></p>
            <p className="font-bold text-lg mt-2">
              Estimated Cost: <span className="text-secondary text-3xl">Rs. {result.estimatedCost.toFixed(2)}</span>
            </p>
            <p>Fertilizer Needs: <span className="font-medium">{result.fertilizerNeeds}</span></p>
            <p>Water Needs: <span className="font-medium">{result.waterNeeds}</span></p>
          </div>
        )}
      </div>

      <div className="mt-16">
        <h2 className="text-2xl font-semibold text-gray-800">Your Previous Calculations</h2>
        {previousCalculations.length === 0 ? (
          <p className="mt-4 text-gray-600">No previous calculations found.</p>
        ) : (
          <div className="overflow-x-auto mt-4">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-200 font-bold text-center">
                <tr>
                  {["Crop", "Area (acres)", "Estimated Cost (Rs.)", "Water Resources", "Soil Type", "Fertilizer Needs", "Water Needs"].map((header) => (
                    <th key={header} className="px-4 py-2 text-left text-gray-600 font-medium">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {previousCalculations.map((calc, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-gray-800">{calc.crop}</td>
                    <td className="px-4 py-2 text-gray-800">{calc.area}</td>
                    <td className="px-4 py-2 text-secondary font-bold text-[20px]">Rs. {calc.estimatedCost}</td>
                    <td className="px-4 py-2 text-gray-800">{calc.waterResources}</td>
                    <td className="px-4 py-2 text-gray-800">{calc.soilType}</td>
                    <td className="px-4 py-2 text-gray-800">{calc.fertilizerNeeds}</td>
                    <td className="px-4 py-2 text-gray-800">{calc.waterNeeds}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default CostCalculator;
