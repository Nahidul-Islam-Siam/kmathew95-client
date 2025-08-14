import React from "react";

import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
const AssignedUser = () => {
  const [modal, setModal] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showRePassword, setShowRePassword] = React.useState(false);

  const handleViewDetails = () => {
    setModal(true);
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const toggleRePasswordVisibility = () => {
    setShowRePassword(!showRePassword);
  };

  return (
    <>
      <div>
        <div
          className="flex flex-col md:flex-row gap-5 justify-between  
      items-center border border-blue-950 p-5 rounded-lg"
        >
          {/* profile and name */}
          <div className="flex gap-5 items-center">
            <Image width={100} height={100} src='/images/profiles/avatar1.png' alt="profile"/>
            <div className="text-blue-950">
              <h1 className="text-lg font-semibold">Henry Jr.</h1>
              <h1>henry82@gmail.com</h1>
            </div>
          </div>
          {/* button */}
          <div className="flex gap-5">
            <button
              onClick={handleViewDetails}
              className="border border-blue-950 font-bold text-blue-950 px-4 
            py-2  hover:bg-blue-950 rounded-sm hover:text-white transition-colors"
            >
              View Details
            </button>
            <button
              className="border border-blue-950 font-bold text-blue-950 px-4 
            py-2  hover:bg-red-500 hover:border-red-500 rounded-sm hover:text-white transition-colors"
            >
              Remove User
            </button>
          </div>
        </div>
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white border p-10 rounded-xl border-blue-950 w-full max-w-3xl mx-auto mt-8">
            <div className="flex justify-end items-end">
              <button
                onClick={() => setModal(false)}
                className=" bg-red-500 hover:bg-red-700 text-white px-[10px] py-1 rounded"
              >
                X
              </button>
            </div>
            <h1 className="text-xl text-center font-bold text-blue-950">
              User Details
            </h1>
            <form>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="username"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  placeholder="Enter username"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-6">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="Enter email"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-6">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="address"
                >
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  placeholder="Enter Address"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-6">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="phone"
                >
                  Phone Number
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  id="phone"
                  placeholder="Enter phone number"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  onInput={(e) => {
                    const input = e.target as HTMLInputElement;
                    input.value = input.value.replace(/[^0-9]/g, "");
                  }}
                />
              </div>
              <div className="mb-6 relative">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="password"
                >
                  Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Enter Password"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-[36px] text-blue-950 font-medium"
                >
                  {showPassword ? <Eye /> : <EyeOff />}
                </button>
              </div>
              <div className="mb-6 relative">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="rePassword"
                >
                  Confirm Password
                </label>
                <input
                  type={showRePassword ? "text" : "password"}
                  id="rePassword"
                  placeholder="Confirm Password"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10"
                />
                <button
                  type="button"
                  onClick={toggleRePasswordVisibility}
                  className="absolute right-3 top-[36px] text-blue-950 font-medium"
                >
                  {showRePassword ? <Eye /> : <EyeOff />}
                </button>
              </div>
              <div className="mb-6">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="email"
                >
                  Upload Image
                </label>
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="flex items-center justify-center gap-5">
                <button
                  onClick={() => setModal(false)}
                  className="bg-blue-950 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline "
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="bg-blue-950 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline "
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AssignedUser;
