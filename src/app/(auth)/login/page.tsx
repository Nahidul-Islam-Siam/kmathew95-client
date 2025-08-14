import React from "react";
import Signin from "@/components/Auth/SignIn"

const LoginPage = () => {
  return (
    <div className="">
      <div className="container min-h-[90vh] flex items-center justify-center py-10">
        <Signin/>
      </div>
    </div>
  );
};

export default LoginPage;
