import { useState, useEffect } from 'react';
import axios from 'axios';

export default function MissionVisionForm() {
  const [formData, setFormData] = useState({
    heading: '',
    subHeading: '',
    missionTitle: '',
    missionDescription: '',
    visionTitle: '',
    visionDescription: '',
    missionPoints: [],
    visionPoints: []
  });

  const [editingMissionPointIndex, setEditingMissionPointIndex] = useState(null);
  const [editingVisionPointIndex, setEditingVisionPointIndex] = useState(null);
  const [editingPointText, setEditingPointText] = useState('');

  useEffect(() => {
    fetchMissionVision();
  }, []);

  const fetchMissionVision = async () => {
    try {
      const res = await axios.get('/api/missionVision/get');
      const data = res.data?.data?.[0];
      if (data) {
        setFormData(data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddPoint = (type) => {
    const point = prompt(`Enter new ${type === 'missionPoints' ? 'Mission' : 'Vision'} Point:`);
    if (point && point.trim() !== '') {
      const updatedPoints = [...formData[type], point.trim()];
      updatePointsArray(type, updatedPoints);
    }
  };

  const handleRemovePoint = async (type, point) => {
    try {
      await axios.put('/api/missionVision/deleteSpecificPoint', { type, point });
      setFormData((prev) => ({
        ...prev,
        [type]: prev[type].filter((p) => p !== point),
      }));
    } catch (error) {
      console.error('Error deleting point:', error);
    }
  };

  const startEditingPoint = (type, index, currentText) => {
    if (type === 'missionPoints') setEditingMissionPointIndex(index);
    if (type === 'visionPoints') setEditingVisionPointIndex(index);
    setEditingPointText(currentText);
  };

  const cancelEditing = () => {
    setEditingMissionPointIndex(null);
    setEditingVisionPointIndex(null);
    setEditingPointText('');
  };

  const saveUpdatedPoint = async (type, index) => {
    try {
      const updatedPoints = [...formData[type]];
      updatedPoints[index] = editingPointText.trim();
      await axios.put('/api/missionVision/updateById', {
        ...formData,
        [type]: updatedPoints
      });
      setFormData((prev) => ({
        ...prev,
        [type]: updatedPoints,
      }));
      cancelEditing();
    } catch (error) {
      console.error('Error updating point:', error);
    }
  };

  const updatePointsArray = async (type, updatedPoints) => {
    try {
      await axios.put('/api/missionVision/updateById', {
        ...formData,
        [type]: updatedPoints
      });
      setFormData((prev) => ({
        ...prev,
        [type]: updatedPoints
      }));
    } catch (error) {
      console.error('Error updating points array:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put('/api/missionVision/updateById', formData);
      alert('Updated successfully!');
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Mission & Vision Form</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-1 font-semibold">Heading</label>
            <input type="text" name="heading" value={formData.heading} onChange={handleInputChange} className="border p-2 rounded w-full" />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Sub Heading</label>
            <input type="text" name="subHeading" value={formData.subHeading} onChange={handleInputChange} className="border p-2 rounded w-full" />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Mission Title</label>
            <input type="text" name="missionTitle" value={formData.missionTitle} onChange={handleInputChange} className="border p-2 rounded w-full" />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Mission Description</label>
            <textarea name="missionDescription" value={formData.missionDescription} onChange={handleInputChange} className="border p-2 rounded w-full"></textarea>
          </div>
          <div>
            <label className="block mb-1 font-semibold">Vision Title</label>
            <input type="text" name="visionTitle" value={formData.visionTitle} onChange={handleInputChange} className="border p-2 rounded w-full" />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Vision Description</label>
            <textarea name="visionDescription" value={formData.visionDescription} onChange={handleInputChange} className="border p-2 rounded w-full"></textarea>
          </div>
        </div>

        {/* Mission Points */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-bold">Mission Points</h2>
            <button type="button" onClick={() => handleAddPoint('missionPoints')} className="bg-blue-500 text-white px-3 py-1 rounded">
              + Add Point
            </button>
          </div>
          {formData.missionPoints.map((point, idx) => (
            <div key={idx} className="flex items-center gap-2 mb-2">
              {(editingMissionPointIndex === idx) ? (
                <>
                  <input
                    type="text"
                    value={editingPointText}
                    onChange={(e) => setEditingPointText(e.target.value)}
                    className="border p-2 rounded w-full"
                  />
                  <button type="button" onClick={() => saveUpdatedPoint('missionPoints', idx)} className="bg-green-500 text-white px-2 py-1 rounded">
                    Save
                  </button>
                  <button type="button" onClick={cancelEditing} className="bg-gray-400 text-white px-2 py-1 rounded">
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <span>{idx + 1}. {point}</span>
                  <button type="button" onClick={() => startEditingPoint('missionPoints', idx, point)} className="text-blue-500">
                    Edit
                  </button>
                  <button type="button" onClick={() => handleRemovePoint('missionPoints', point)} className="text-red-500">
                    Remove
                  </button>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Vision Points */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-bold">Vision Points</h2>
            <button type="button" onClick={() => handleAddPoint('visionPoints')} className="bg-blue-500 text-white px-3 py-1 rounded">
              + Add Point
            </button>
          </div>
          {formData.visionPoints.map((point, idx) => (
            <div key={idx} className="flex items-center gap-2 mb-2">
              {(editingVisionPointIndex === idx) ? (
                <>
                  <input
                    type="text"
                    value={editingPointText}
                    onChange={(e) => setEditingPointText(e.target.value)}
                    className="border p-2 rounded w-full"
                  />
                  <button type="button" onClick={() => saveUpdatedPoint('visionPoints', idx)} className="bg-green-500 text-white px-2 py-1 rounded">
                    Save
                  </button>
                  <button type="button" onClick={cancelEditing} className="bg-gray-400 text-white px-2 py-1 rounded">
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <span>{idx + 1}. {point}</span>
                  <button type="button" onClick={() => startEditingPoint('visionPoints', idx, point)} className="text-blue-500">
                    Edit
                  </button>
                  <button type="button" onClick={() => handleRemovePoint('visionPoints', point)} className="text-red-500">
                    Remove
                  </button>
                </>
              )}
            </div>
          ))}
        </div>

        <div>
          <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded font-semibold mt-4">
            Save All Changes
          </button>
        </div>
      </form>
    </div>
  );
}
