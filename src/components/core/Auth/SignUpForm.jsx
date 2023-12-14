import React, { useState } from "react";
import Tab from "../../common/Tab";
import { toast } from "react-hot-toast";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ACCOUNT_TYPE } from "../../../utils/constant";
import { setSignupData } from "../../../slices/authSlices";
import { sendOtp } from "../../../services/operations/authAPI";

const SignUpForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [accountType, setAccountType] = useState(ACCOUNT_TYPE.STUDENT);
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { firstname, lastname, email, password, confirmPassword } = formData;

  //handle input field when some value get change
  const handleOnChange = (e) => {
    //console.log(e.target.value);
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  //handle from submission
  const handelOnSubmit = (e) => {
    e.preventDefault();
    //console.log(fromData);

    if (password !== confirmPassword) {
      toast.error("Password do not match");
      return;
    }

    const signupData = {
      ...formData,
      accountType,
    };
    //setting signup data to store to be used after otp verification
    dispatch(setSignupData(signupData));

    //send OTP to user for verification
     dispatch(sendOtp(formData.email , navigate))

    //Reset form data
    setFormData({
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setAccountType(ACCOUNT_TYPE.STUDENT);
  };
  // data to pass to Tab component
  const tabData = [
    {
      id: 1,
      tabName: "Student",
      type: ACCOUNT_TYPE.STUDENT,
    },
    {
      id: 2,
      tabName: "Instructor",
      type: ACCOUNT_TYPE.INSTRUCTOR,
    },
  ];

  return (
    <div>
      {/*Tab */}
      <Tab tabData={tabData} field={accountType} setField={setAccountType} />

      {/*Form */}
      <form onSubmit={handelOnSubmit} className="w-full gap-y-4 flex flex-col">
        <div className="flex gap-x-4">
          <label>
            <p className=" mb-1  text-[0.875rem] leading-[1.375rem] text-richblack-5">
              First Name <sup className="text-pink-200">*</sup>
            </p>
            <input
              required
              type="text"
              name="firstname"
              placeholder="Enter first name"
              value={firstname}
              onChange={handleOnChange}
              style={{
                boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
              }}
              className="text-richblack-5 bg-richblack-800 rounded-[0.5rem] w-full p-[12px]"
            />
          </label>

          <label>
            <p className=" mb-1  text-[0.875rem] leading-[1.375rem] text-richblack-5">
              Last Name <sup className="text-pink-200">*</sup>
            </p>
            <input
              required
              type="text"
              name="lastname"
              placeholder="Enter last name"
              value={lastname}
              onChange={handleOnChange}
              style={{
                boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
              }}
              className="text-richblack-5 bg-richblack-800 rounded-[0.5rem] w-full p-[12px]"
            />
          </label>
        </div>

        <label className="w-full">
          <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
            Email <sup className="text-pink-200">*</sup>
          </p>
          <input
            required
            type="text"
            name="email"
            placeholder="Enter email address"
            value={email}
            onChange={handleOnChange}
            style={{
              boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
            }}
            className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5"
          />
        </label>

        <div className="flex gap-x-4">
          <label className="relative">
            <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
              Create Password <sup className="text-pink-200">*</sup>
            </p>
            <input
              required
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter Password"
              value={password}
              onChange={handleOnChange}
              style={{
                boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
              }}
              className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] pr-10
               text-richblack-5"
            />
            <span
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-[38px] x-[10] cursor-pointer"
            >
              {showPassword ? (
                <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
              ) : (
                <AiOutlineEye fontSize={24} fill="#AFB2BF" />
              )}
            </span>
          </label>

          <label className="relative">
            <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
              Confrim Password <sup className="text-pink-200">*</sup>
            </p>
            <input
              required
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleOnChange}
              placeholder="Confirm Password"
              style={{
                boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
              }}
              className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] pr-10
               text-richblack-5"
            />
            <span
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-3 top-[38px] z-[10] cursor-pointer"
            >
              {showConfirmPassword ? (
                <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
              ) : (
                <AiOutlineEye fontSize={24} fill="#AFB2BF" />
              )}
            </span>
          </label>
        </div>
        <button
          type="submit"
          className="mt-6 rounded-[8px] bg-yellow-50 py-[8px] px-[12px] font-medium text-richblack-900"
        >
          Create Account
        </button>
      </form>
    </div>
  );
};

export default SignUpForm;
