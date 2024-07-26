import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faTrash,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { hostaddress } from "./App";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const InventoryItems = () => {
  const [inventory, setInventory] = useState([]);
  const { itemId } = useParams();
  const [itemDetails, setItemDetails] = useState(null);
  const [newProduct, setNewProduct] = useState({
    serial_number: "",
    status: "In Stock",
  });
  const [showPopup, setShowPopup] = useState(false);
  const [editProductIndex, setEditProductIndex] = useState(null);
  const [editProductStatus, setEditProductStatus] = useState("");
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); // search bar
  const [allItems, setAllItems] = useState([]);

  useEffect(() => {
    fetchItemDetails(itemId);
  }, [itemId]);

  const fetchItemDetails = (itemId) => {
    if (itemId) {
      const url = `${hostaddress}/inventory/${itemId}`;
      fetch(url)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          console.log(data);
          setItemDetails(data);
          setAllItems(data.products || []);
        })
        .catch((error) => {
          console.error("Error fetching item details:", error);
          alert("Failed to fetch item details");
        });
    }
  };

  const handleSearch = () => {
    const filteredProducts = allItems.filter((product) =>
      product.serial_number.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setItemDetails({ ...itemDetails, products: filteredProducts });
  };

  const handleAddProduct = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`${hostaddress}/inventory/${itemId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inventory_id: itemId,
          serial_number: newProduct.serial_number,
          status: newProduct.status,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to add product");
      }
      setShowPopup(false);
      fetchItemDetails(itemId);
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product");
    }
  };

  const handleEditClick = (index) => {
    setEditProductIndex(index);
    setEditProductStatus(itemDetails.products[index].status);
  };

  const handleDeleteProduct = async (index) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirmDelete) return;
    try {
      const response = await fetch(
        `${hostaddress}/inventory/${itemId}/products/${itemDetails.products[index].serial_number}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete product");
      }
      fetchItemDetails(itemId);
      toast.success("Product deleted successfully");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    }
  };

  const handleSaveEdit = async (index) => {
    const updatedProduct = itemDetails.products[index];
    updatedProduct.status = editProductStatus;

    try {
      const response = await fetch(`${hostaddress}/inventory/${itemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          serial_number: updatedProduct.serial_number,
          status: editProductStatus,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to update product");
      }
      setEditProductIndex(null);
      fetchItemDetails(itemId);
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product");
    }
  };

  if (!itemDetails) {
    return <div>Loading...</div>;
  }

  const goToInventoryManagement = () => {
    navigate("/inventory");
  };

  const getTotalCount = (status) => {
    return itemDetails.products.filter((product) => product.status === status)
      .length;
  };

  const graphData = {
    labels: ["In Stock", "Purchased", "Damaged"],
    datasets: [
      {
        label: "Products",
        data: [
          getTotalCount("In Stock"),
          getTotalCount("Purchased"),
          getTotalCount("Damaged"),
        ],
        backgroundColor: [
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(255, 99, 132, 0.2)",
        ],
        borderColor: [
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(255, 99, 132, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="container mx-auto px-4 mt-20">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <div
            className="flex items-center justify-center border border-black rounded-full w-6 h-6 mr-2"
            style={{ marginTop: "-10px" }}
          >
            <FontAwesomeIcon
              icon={faArrowLeft}
              className="text-black cursor-pointer"
              onClick={goToInventoryManagement}
            />
          </div>
        </div>

        <div className="flex-1 flex justify-between items-center mx-4">
          <h2 className="text-2xl font-bold mb-4 inline">
            Inventory - {itemDetails ? itemDetails.item : ""}
          </h2>
          <div className="relative w-1/3">
            <input
              type="text"
              placeholder="Search Item..."
              className="border p-2 pl-10 rounded-full w-full"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              onClick={handleSearch}
            />
          </div>
        </div>
        <div className="ml-4">
          <button
            className="bg-orange-400 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => setShowPopup(true)}
          >
            Add Product
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Left side: Product table and filters */}
        <div className="lg:w-2/3 mb-4 lg:mb-0">
          <div className="flex justify-end mb-4">
            {/* Filtering options */}
            <div className="relative">
              <select
                className="block appearance-none w-36 bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">Filter by Status</option>
                <option value="In Stock">In Stock</option>
                <option value="Purchased">Purchased</option>
                <option value="Damaged">Damaged</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9 11l4-4h-8l4 4z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto shadow-md sm:rounded-lg max-h-[calc(85vh-90px)] overflow-y-auto">
            <table className="min-w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="bg-orange-400 text-white">
                <tr>
                  <th className="text-center py-3 px-4 uppercase font-semibold text-sm">
                    Number
                  </th>
                  <th className="text-center py-3 px-4 uppercase font-semibold text-sm">
                    Serial Number
                  </th>
                  <th className="text-left py-3 px-4 uppercase font-semibold text-sm">
                    Status
                  </th>
                  <th className="text-center py-3 px-4 uppercase font-semibold text-sm">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {itemDetails?.products &&
                  itemDetails.products
                    .filter(
                      (product) =>
                        !statusFilter || product.status === statusFilter
                    )
                    .map((product, index) => (
                      <tr
                        key={index}
                        className="bg-white border-b hover:bg-gray-50 transition ease-in-out duration-150"
                      >
                        <td className="text-center py-3 px-4 text-blue-600 font-semibold">
                          {index + 1}
                        </td>
                        <td className="text-center py-3 px-4">
                          {product.serial_number}
                        </td>
                        <td className="text-left py-3 px-4">
                          {editProductIndex === index ? (
                            <select
                              value={editProductStatus}
                              onChange={(e) =>
                                setEditProductStatus(e.target.value)
                              }
                              className="border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            >
                              <option value="In Stock">In Stock</option>
                              <option value="Purchased">Purchased</option>
                              <option value="Damaged">Damaged</option>
                            </select>
                          ) : (
                            product.status
                          )}
                        </td>
                        <td className="text-center py-3 px-4">
                          {editProductIndex === index ? (
                            <>
                              <button
                                className="bg-blue-500 text-white px-4 py-1 rounded-md hover:bg-blue-600 focus:outline-none mr-2"
                                onClick={() => handleSaveEdit(index)}
                              >
                                Save
                              </button>
                              <button
                                className="bg-gray-500 text-white px-4 py-1 rounded-md hover:bg-gray-600 focus:outline-none"
                                onClick={() => setEditProductIndex(null)}
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <FontAwesomeIcon
                                icon={faEdit}
                                className="text-blue-500 hover:text-blue-700 cursor-pointer"
                                onClick={() => handleEditClick(index)}
                              />
                              <FontAwesomeIcon
                                icon={faTrash}
                                className="ml-2 text-red-500 hover:text-red-700 cursor-pointer"
                                onClick={() => handleDeleteProduct(index)}
                              />
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right side: Item details and graph */}
        <div className="lg:w-1/7 lg:pl-5">
          <div className="mb-6 border border-gray-300 rounded p-4">
            <h3 className="text-lg font-semibold mb-4">Item Details</h3>
            <div className="space-y-2">
              <div className="flex items-center border border-gray-300 rounded p-4 mb-2">
                <div className="md:w-1/7 mr-4">
                  <img
                    src={itemDetails.image_url}
                    alt={itemDetails.item}
                    width={200}
                    height={200}
                    className="rounded-md shadow-lg"
                  />
                </div>
                <div>
                  <div className="flex items-center mb-2">
                    <p className="text-sm font-semibold mr-2">Brand:</p>
                    <p className="text-sm">{itemDetails.brand}</p>
                  </div>
                  <div className="flex items-center mb-2">
                    <p className="text-sm font-semibold mr-2">Model:</p>
                    <p className="text-sm">{itemDetails.model}</p>
                  </div>
                  <div className="flex items-center mb-2">
                    <p className="text-sm font-semibold mr-2">Supplier:</p>
                    <p className="text-sm">{itemDetails.supplier}</p>
                  </div>
                  <div className="flex items-center mb-2">
                    <p className="text-sm font-semibold mr-2">
                      Brief Description:
                    </p>
                    <p className="text-sm">{itemDetails.brief_description}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="border border-gray-300 rounded p-4">
            <h3 className="text-lg font-semibold mb-4">Inventory Summary</h3>
            <div className="flex justify-between space-x-4">
              <div className="flex items-center">
                <p className="text-sm font-semibold mr-2">In Stock:</p>
                <div className="w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center">
                  <p className="text-white">{getTotalCount("In Stock")}</p>
                </div>
              </div>
              <div className="flex items-center">
                <p className="text-sm font-semibold mr-2">Purchased:</p>
                <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                  <p className="text-white">{getTotalCount("Purchased")}</p>
                </div>
              </div>
              <div className="flex items-center">
                <p className="text-sm font-semibold mr-2">Damaged:</p>
                <div className="w-6 h-6 bg-red-400 rounded-full flex items-center justify-center">
                  <p className="text-white">{getTotalCount("Damaged")}</p>
                </div>
              </div>
            </div>
            <Bar data={graphData} />
          </div>
        </div>
      </div>

      <Popup open={showPopup} onClose={() => setShowPopup(false)}>
        <div className="p-4 bg-white rounded-lg shadow-lg">
          <h3 className="text-lg font-bold mb-4">Add New Product</h3>
          <form onSubmit={handleAddProduct}>
            <div className="mb-4">
              <label
                htmlFor="serial_number"
                className="block text-sm font-medium text-gray-700"
              >
                Serial Number
              </label>
              <input
                type="text"
                id="serial_number"
                value={newProduct.serial_number}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    serial_number: e.target.value,
                  })
                }
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700"
              >
                Status
              </label>
              <select
                id="status"
                value={newProduct.status}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, status: e.target.value })
                }
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              >
                <option value="In Stock">In Stock</option>
                <option value="Purchased">Purchased</option>
                <option value="Damaged">Damaged</option>
              </select>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none"
              >
                Add Product
              </button>
            </div>
          </form>
        </div>
      </Popup>
    </div>
  );
};

export default InventoryItems;
