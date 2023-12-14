import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";
import { getPasswordResetToken } from "../services/operations/authAPI";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  const handleOnSubmit = (e) => {
    e.preventDefault();
    dispatch(getPasswordResetToken(email , setEmailSent))
  };
  return (
    <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center ">
      {loading ? (
        <div className="spinner"></div>
      ) : (
        <div className="max-w-[500px] p-4 lg:p-8">
          <h1 className="text-[1.875rem] font-semibold leading-[2.375rem] text-richblack-5"
          >{!emailSent ? "Reset your password" : "Check email"}</h1>
          <p className="text-richblack-100 text-[1.125rem] leading-[1.625rem] my-4">
            {!emailSent
              ? "Have no fear. We'll email you instructions to reset your password. If you dont have access to your email we can try account recovery"
              : `We have sent the reset email to ${email} `}
          </p>

          <form onSubmit={handleOnSubmit}>
            {!emailSent && (
              <label className="w-full">
                <p className="text-[0.875rem] leading-[1.375rem] text-richblack-5 mb-1">
                  Email Address <sup className="text-pink-200">*</sup>
                </p>
                <input
                  required
                  type="email"
                  name="email"
                  value={email}
                  placeholder="Enter email address"
                  className="form-style w-full"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>
            )}
            <button type="submit"
            className="bg-yellow-50 rounded-[8px] w-full mt-6 py-[12px] px-[12px] font-medium text-richblack-900">
              {!emailSent ? "Submit" : "Resend Email"}
            </button>
          </form>
          <div className="mt-6 item-center flex justify-between">
            <Link to="/login">
              <p className="text-richblack-5 flex gap-x-2 items-center">
                <BiArrowBack /> Back To Login
              </p>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
