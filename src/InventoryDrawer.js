import React, { useState } from "react";
import { hostaddress } from "./App";

const InventoryDrawer = ({ isOpen, closeDrawer, fetchInventory }) => {
  const [inventoryData, setInventoryData] = useState({
    item: "",

    price_from_supplier: "",
    retail_price: "",
    supplier_name: "",
    supplier_email: "",
    barcode: "",
    model: "",
    brand: "",
    brief_description: "",
    image_url: "",
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = async (event) => {
    const { name, value, files } = event.target;
    if (name === "image") {
      try {
        const imageUrl = await handleImageUpload(files[0]);
        setInventoryData((prevData) => ({
          ...prevData,
          image_url: imageUrl,
        }));
      } catch (error) {
        console.error("Image upload failed:", error);
      }
    } else {
      setInventoryData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${hostaddress}/upload-image`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to upload image");
    }

    const data = await response.json();
    return data.imageUrl;
  };

  const validateForm = () => {
    const newErrors = {};

    if (!inventoryData.item) {
      newErrors.item = "Item name is required.";
    }

    if (
      !inventoryData.price_from_supplier ||
      isNaN(inventoryData.price_from_supplier)
    ) {
      newErrors.price_from_supplier = "Price from supplier must be a number.";
    }
    if (!inventoryData.retail_price || isNaN(inventoryData.retail_price)) {
      newErrors.retail_price = "Retail price must be a number.";
    }
    if (!inventoryData.supplier_name) {
      newErrors.supplier_name = "Supplier name is required.";
    }
    if (!inventoryData.supplier_email) {
      newErrors.supplier_email = "Supplier email is required.";
    }
    // Continue for other fields
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      console.error("Validation failed:", errors);
      return;
    }

    try {
      const response = await fetch(`${hostaddress}/inventory`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inventoryData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save inventory data");
      }

      await response.json();
      closeDrawer();
      fetchInventory();
      setInventoryData({
        item: "",

        price_from_supplier: "",
        retail_price: "",
        supplier_name: "",
        supplier_email: "",
        barcode: "",
        model: "",
        brand: "",
        brief_description: "",
        image_url: "",
      });
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to add inventory: " + error.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="overflow-auto fixed right-0 top-0 w-96 h-full bg-white shadow-lg z-50 p-4">
      <h2 className="text-lg font-semibold">Add New Inventory</h2>
      <form onSubmit={handleSubmit}>
        {Object.entries(inventoryData).map(([key, value]) =>
          key !== "image_url" ? (
            <label className="block mt-4" key={key}>
              <span className="text-gray-700">
                {key
                  .replace(/_/g, " ")
                  .replace(/^./, (str) => str.toUpperCase())}
              </span>
              <input
                type={
                  key === "retail_price" ||
                  key === "price_from_supplier" ||
                  key === "quantity"
                    ? "number"
                    : "text"
                }
                name={key}
                value={value}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder={`Enter ${key
                  .replace(/_/g, " ")
                  .replace(/^./, (str) => str.toUpperCase())}`}
              />
            </label>
          ) : (
            <label className="block mt-4" key={key}>
              <span className="text-gray-700">Image</span>
              <input
                type="file"
                name="image"
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </label>
          )
        )}
        <div className="mt-6 flex justify-between">
          <button
            type="submit"
            className="bg-orange-400 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
          >
            Save Inventory
          </button>
          <button
            type="button"
            onClick={closeDrawer}
            className="bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded"
          >
            Close
          </button>
        </div>
      </form>
    </div>
  );
};

export default InventoryDrawer;
