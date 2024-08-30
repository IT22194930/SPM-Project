const Disease = require("../../models/PlantManagement/Disease");

// Create a new disease
exports.createDisease = async (req, res) => {
  try {
    const {
      imageUrl,
      name,
      causalAgent,
      diseaseTransmission,
      diseaseSymptoms,
      control,
      fertilizers,
      plantId,
    } = req.body;

    // Ensure fertilizers is an array
    const formattedFertilizers = Array.isArray(fertilizers)
      ? fertilizers
      : [fertilizers];

    const newDisease = new Disease({
      imageUrl,
      name,
      causalAgent,
      diseaseTransmission,
      diseaseSymptoms,
      control,
      fertilizers: formattedFertilizers,
      plantId,
    });
    await newDisease.save();
    res.status(201).json(newDisease);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all diseases for a specific plant
exports.getDiseasesByPlantId = async (req, res) => {
  try {
    const { plantId } = req.params;
    const diseases = await Disease.find({ plantId });
    res.status(200).json(diseases);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a specific disease by ID
exports.getDiseaseById = async (req, res) => {
  try {
    const { id } = req.params;
    const disease = await Disease.findById(id);
    if (!disease) return res.status(404).json({ message: "Disease not found" });
    res.status(200).json(disease);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a disease
exports.updateDisease = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      imageUrl,
      name,
      causalAgent,
      diseaseTransmission,
      diseaseSymptoms,
      control,
      fertilizers,
    } = req.body;

    // Ensure fertilizers is an array
    const formattedFertilizers = Array.isArray(fertilizers)
      ? fertilizers
      : [fertilizers];

    const disease = await Disease.findByIdAndUpdate(
      id,
      {
        imageUrl,
        name,
        causalAgent,
        diseaseTransmission,
        diseaseSymptoms,
        control,
        fertilizers: formattedFertilizers,
      },
      { new: true }
    );
    if (!disease) return res.status(404).json({ message: "Disease not found" });
    res.status(200).json(disease);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a disease
exports.deleteDisease = async (req, res) => {
  try {
    const { id } = req.params;
    const disease = await Disease.findByIdAndDelete(id);
    if (!disease) return res.status(404).json({ message: "Disease not found" });
    res.status(200).json({ message: "Disease deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
