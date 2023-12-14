import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { apiConnector } from "../../services/apiConnector";
import CountryCode from "../../data/countrycode.json";
import { contactUsEndpoint } from "../../services/api";

const ContactUsForm = () => {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errros, isSubmitSuccessfull },
  } = useForm();

  const submitContactForm = async (data) => {
   // console.log("Logging Data", data);
    try {
      setLoading(true);
      const response = await apiConnector(
        "POST",
        contactUsEndpoint.CONTACT_US_API,
        data
      );
      //const response = { status: "OK" };
      console.log("Logging response", response);
      setLoading(false);
    } catch (error) {
      console.log("Error Message -", error.message);
      setLoading(false);
    }
  };
  useEffect(() => {
    // if form ka data successfull submit hogya then reset the form
    if (!isSubmitSuccessfull) {
      reset({
        email: "",
        firstname: "",
        lastname: "",
        message: "",
        phoneNo: "",
      });
    }
  }, [reset, isSubmitSuccessfull]);

  return (
    <form
      onSubmit={handleSubmit(submitContactForm)}
      className="flex flex-col gap-7"
    >
      <div className="flex flex-col gap-5 lg:flex-row">
        {/*firstname */}
        <div className="flex flex-col gap-2 lg:w-[48%]">
          <label htmlFor="firstname" className="lable-style">
            First Name
          </label>
          <input
            type="text"
            name="firstname"
            id="firstname"
            placeholder="Enter First Name"
            className="form-style"
            {...register("firstname", { required: true })}
          />
          {errros?.firstname && (
            <span className="-mt-1 text-[12px] text-yellow-100">
              {" "}
              Please enter Your name
            </span>
          )}
        </div>

        {/*lastname */}
        <div className="flex flex-col gap-2 lg:w-[48%]">
          <label htmlFor="lastname" className="lable-style">
            Last Name
          </label>
          <input
            type="text"
            name="lastname"
            id="lastname"
            placeholder="Enter Last Name"
            className="form-style"
            {...register("lastname")}
          />
        </div>
      </div>

      {/*email */}
      <div className="flex flex-col gap-2 ">
        <label htmlFor="email" className="lable-style">
          Email Address
        </label>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Enter Email here"
          className="form-style"
          {...register("email", { required: true })}
        />
        {errros?.email && (
          <span className="-mt-1 text-[12px] text-yellow-100">
            Please enter Your email
          </span>
        )}
      </div>
      {/*phone no */}
      <div className="flex flex-col gap-2">
        <label htmlFor="phonenumber" className="lable-style">
          Phone Number
        </label>
        <div className="flex gap-5">
          <div className=" flex w-[81px] flex-col gap-2">
            {/*dropdown */}
            <select
              name="dropdown"
              id="dropdown"
              className="form-style"
              {...register("countryCode", { register: true })}
            >
              {CountryCode.map((element, index) => {
                return (
                  <option key={index} value={element.code}>
                    {element.code} - {element.country}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="flex w-[calc(100%-90px)] flex-col gap-2">
            <input
              type="number"
              name="phonenumber"
              id="phonenumber"
              placeholder="12345 67890"
              className="form-style"
              {...register("phoneNo", {
                required: {
                  value: true,
                  message: "Please enter your Phone Number",
                },
                maxLength: { value: 10, message: "Invalid Phone Number" },
                minLnegth: { value: 8, message: "Invalid Phone Number" },
              })}
            />
          </div>
        </div>
        {errros?.phoneNo && (
          <span className="-mt-1 text-[12px] text-yellow-100">
            {errros?.phoneNo.message}
          </span>
        )}
      </div>
      {/*message */}
      <div className="flex flex-col gap-2">
        <label htmlFor="message" className="lable-style">
          Message
        </label>
        <textarea
          name="message"
          id="message"
          cols="30"
          rows="7"
          placeholder="Enter Your message here"
          className="form-style"
          {...register("message", { required: true })}
        />
        {errros?.message && (
          <span className="-mt-1 text-[12px] text-yellow-100">
            Please enter Your message
          </span>
        )}
      </div>

      {/*button */}
      <button
        disabled={loading}
        type="submit"
        className={`rounded-md bg-yellow-50 px-6 py-3 text-center text-[13px]
         font-bold text-black shadow-[2px_2px_0px_0px_rgba(255,255,255,0.18)] 
         ${
           !loading &&
           "transition-all duration-200 hover:scale-95 hover:shadow-none"
         }  disabled:bg-richblack-500 sm:text-[16px] `}
      >
        Send Message
      </button>
    </form>
  );
};

export default ContactUsForm;
