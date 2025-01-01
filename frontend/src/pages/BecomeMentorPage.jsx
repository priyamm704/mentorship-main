import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AOS from "aos";
import "aos/dist/aos.css";
import axios from "axios";

const BecomeMentorPage = () => {
  const [mentors, setMentors] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    expertise: "",
    price: "",
    rating: "",
    description: "",
    image: null,
  });

  useEffect(() => {
    AOS.init({ duration: 1000 });

    const fetchMentors = async () => {
      try {
        const response = await axios.get("/api/mentors");
        setMentors(response.data.mentors);
      } catch (error) {
        console.error("Error fetching mentors:", error);
      }
    };

    fetchMentors();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("expertise", formData.expertise);
    formDataToSend.append("price", formData.price);
    formDataToSend.append("rating", formData.rating);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("image", formData.image);

    try {
      const response = await axios.post("/api/mentors", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Mentor created successfully!");
      setMentors((prev) => [...prev, response.data.mentor]);
    } catch (error) {
      console.error("Error creating mentor:", error);
      alert("Failed to create mentor.");
    }
  };

  return (
    <div className="pt-20 bg-gradient-to-r from-teal-500 to-blue-600">
      <Navbar />

      <section className="py-16 bg-white text-center">
        <h2 className="text-3xl font-semibold text-teal-600 mb-8">Become a Mentor</h2>
        <form
          className="max-w-2xl mx-auto bg-gray-100 p-8 rounded-lg shadow-md"
          onSubmit={handleSubmit}
        >
          <div className="mb-4">
            <label className="block text-left text-gray-600 mb-2" htmlFor="image">
              Mentor Image
            </label>
            <input
              type="file"
              id="image"
              name="image"
              className="w-full p-2 border rounded"
              onChange={handleImageChange}
              required
            />
          </div>

          <button
            type="submit"
            className="bg-teal-500 text-white px-6 py-2 rounded shadow hover:bg-teal-600 transition"
          >
            Submit
          </button>
        </form>
      </section>

      <section className="py-16 bg-teal-50 text-center">
        <h2 className="text-3xl font-semibold text-teal-600 mb-8">Our Mentors</h2>
        <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mentors.map((mentor) => (
            <div key={mentor._id} className="p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-teal-600">{mentor.name}</h3>
              <img
                src={mentor.image}
                alt={mentor.name}
                className="w-24 h-24 object-cover rounded-full mx-auto mb-4"
              />
              <p className="text-gray-700">Expertise: {mentor.expertise}</p>
              <p className="text-gray-700">Price: ${mentor.price}/hr</p>
              <p className="text-gray-700">Rating: {mentor.rating}</p>
              <p className="text-gray-700">{mentor.description}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BecomeMentorPage;

