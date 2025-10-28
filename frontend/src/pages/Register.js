// pages/register.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Register() {
const navigate = useNavigate();
const [formData, setFormData] = useState({
name: '',
email: '',
password: ''
});
const [error, setError] = useState('');

const handleChange = (e) => {
const { name, value } = e.target;
setFormData({ ...formData, [name]: value });
};

const handleSubmit = async (e) => {
e.preventDefault();
try {
const response = await axios.post('[http://localhost:5000/api/auth/register](http://localhost:5000/api/auth/register)', formData);
if (response.status === 201) {
alert('Registration successful!');
navigate('/login');
}
} catch (err) {
setError(err.response?.data?.message || 'Registration failed.');
}
};

return ( <div className="flex items-center justify-center min-h-screen bg-purple-100"> <div className="bg-white p-8 rounded-2xl shadow-lg w-96"> <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>
{error && <p className="text-red-500 text-center mb-4">{error}</p>} <form onSubmit={handleSubmit} className="space-y-4"> <input
         type="text"
         name="name"
         placeholder="Full Name"
         value={formData.name}
         onChange={handleChange}
         required
         className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
       /> <input
         type="email"
         name="email"
         placeholder="Email Address"
         value={formData.email}
         onChange={handleChange}
         required
         className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
       /> <input
         type="password"
         name="password"
         placeholder="Password"
         value={formData.password}
         onChange={handleChange}
         required
         className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
       /> <button
         type="submit"
         className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 rounded-lg"
       >
Register </button> </form> <p className="text-center text-sm text-gray-600 mt-4">
Already have an account?{' '}
<span
className="text-purple-500 cursor-pointer hover:underline"
onClick={() => navigate('/login')}
>
Login </span> </p> </div> </div>
);
}
