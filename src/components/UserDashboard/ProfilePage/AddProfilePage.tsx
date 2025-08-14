import React from "react";
import AssignedUser from "./AssignedUser";
import { Eye, EyeOff } from "lucide-react";

const AddProfilePage = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showRePassword, setShowRePassword] = React.useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const toggleRePasswordVisibility = () => {
    setShowRePassword(!showRePassword);
  };

  return (
    <div>
      {/* Assign user form */}
      <div className="max-w-4xl border p-10 rounded-xl border-blue-950 mx-auto mt-8">
        <h1
          className="text-xl text-center 
           font-bold text-blue-950"
        >
          Assign A User
        </h1>
        <form>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="username"
            >
              Username<span className="text-red-500">*</span>
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
              Email<span className="text-red-500">*</span>
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
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
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
          <div className="mb-6 relative">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password<span className="text-red-500">*</span>
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
              Confirm Password<span className="text-red-500">*</span>
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

          <button
            type="submit"
            className="bg-blue-950 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
          >
            Assign User
          </button>
        </form>
      </div>
      {/* Assigned User part */}
      <div className="py-10 max-w-4xl mx-auto">
        <h1
          className="text-xl 
           font-bold text-blue-950 mb-5"
        >
          Assigned User
        </h1>
        <AssignedUser />
      </div>
    </div>
  );
};

export default AddProfilePage;
