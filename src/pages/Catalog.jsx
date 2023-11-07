import React, { useEffect, useState } from "react";
import Footer from "../components/common/Footer";
import { apiConnector } from "../services/apiConnector";
import { categories } from "../services/api";
import { useParams } from "react-router-dom";

const Catalog = () => {
  const [catalogName] = useParams;
  const [catalogPageData, setCatalogPageData] = useState(null);

  // kb kon kis category pr clk kr de uss category ki course dekhne k liye so that we need categoryId to keep track of this
  const [categoryId, setCategoryId] = useState("");

  //Fetch all categories-> whenever i clicked on any category of dropdown a new URL will generate and inside URL there is parameter we set(catalogName) ,
  // that parameter value get cahnged after every new click ....on every new URL useEffect code will run... And
  useEffect(() => {
    const getCategories = async () => {
      const res = await apiConnector("GET", categories.CATEGORIES_API);
      //console.log(res);

      //finding categoryId which is currently selected in dropdown
      const category_id = res?.data?.data?.filter(
        (ct) => ct.name.split(" ").join("-").toLowerCase() === catalogName
      )[0]._id;
      setCategoryId(category_id);
    };
    getCategories();
  }, [catalogName]);


  useEffect(() => {
    const getCategoryPageDetails = async () => {
      try {
        const result = await getCategoryPageDetails(categoryId);
        console.log("printing result :" , result)
        setCatalogPageData(result);
      } catch (error) {
        console.log(error);
      }
    };
  }, [categoryId]);

  return (
    <div className="text-white">
      {/**Total there is 5 sections in this components */}
      {/**Hero Section */}
      <div>
        <p>{`Home / Catalog /`}
        <span>
          </span></p>
        <p></p>
        <p></p>
      </div>
      <div>
        {/**section -1 */}
        <div>
          <div className="flex gap-x-3">
            <p>Most Popular</p>
            <p>New</p>
          </div>
          {/** courses are displaying in Slider view  */}
          { /*<CourseSlider />*/}
        </div>

        {/*section -2 */}
        <div>
          <p>Top Courses</p>
          <div>
           { /*<CourseSlider />*/}
          </div>
        </div>

        {/** section -3 */}
        <div>
          <p>Frequently Bought Together</p>
        </div>
      </div>
      {/**Section -4 */}
      <Footer />
    </div>
  );
};

export default Catalog;
