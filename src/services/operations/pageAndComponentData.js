//this component is interacting with API (get (/categoryPageDetails) of Server(backend))
// yeh (/categoryPageDetails) wali API call kr k data laa kr deta h
import React from "react";
import { toast } from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { catalogData } from "../api";

export const pageAndComponentData = async (categoryId) => {
  const toastId = toast.loading("Loading...");
  // abhi course ka data nhi h isliye empty array se initialize kiya
  let result = [];
  try {
    const response = await apiConnector(
      "POST",
      catalogData.CATALOGPAGEGDATA_API,
      { categoryId: categoryId }
    );

    if (!response?.data?.success)
      throw new Error("Could not Fetch Category page data");

    result = response?.data;
  } catch (error) {
    console.log("CATALOG PAGE DATA API ERROR....", error);
    toast.error(error.message);
    result = error.response?.data;
  }
  toast.dismiss(toastId);
  return result;
};
