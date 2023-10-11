import React, { useEffect, useState } from "react";
import Logo from "../../assets/Logo/Logo-Full-Light.png";
import { Link, matchPath, useLocation } from "react-router-dom";
import { NavbarLinks } from "../../data/navbar-links";
import { useSelector } from "react-redux";
import { AiOutlineShoppingCart, AiOutlineMenu } from "react-icons/ai";
import ProfileDropDown from "../core/Auth/ProfileDropDown";
import { apiConnector } from "../../services/apiConnector";
import { categories } from "../../services/api";
import { BsChevronDown } from "react-icons/bs";

const subLinks = [
  {
    title: "Python",
    link: "/catalog/python",
  },
  {
    title: "web",
    link: "/catalog/web-development",
  },
];

const Header = () => {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const { totalItems } = useSelector((state) => state.cart);
  const location = useLocation();

  //const [subLinks, setSubLinks] = useState([]);

  // const fetchSubLinks = async () => {
  //   try {
  //     //api call isliye ki h taki sari category ki list lane k liye
  //     const result = await apiConnector("GET", categories.CATEGORIES_API);
  //     console.log("Printing Sublinks result", result);
  //     setSubLinks(result.data.data);
  //   } catch (error) {
  //     console.log("Could not fetch the category list");
  //   }
  // };

  // useEffect(() => {
  //   fetchSubLinks();
  // });

  const matchRoute = (route) => {
    // route send kr rhe yha se  === current url ka route
    return matchPath({ path: route }, location.pathname);
  };

  return (
    <div className="flex items-center justify-center border-b-[1px] border-b-richblack-700 h-14 ">
      <div className="w-11/12 flex max-w-maxContent justify-between items-center">
        <Link to="/">
          <img src={Logo} width={160} height={42} loading="lazy" />
        </Link>

        {/**nav link */}
        <nav>
          <ul className="flex text-richblack-25 gap-x-6">
            {NavbarLinks.map((link, index) => {
              return (
                <li key={index}>
                  {link.title === "Catalog" ? (
                    <div className="relative flex items-center gap-2 group">
                      <p>{link.title}</p>
                      <BsChevronDown />
                      <div
                        className="invisible absolute left-[50%] top-[50%] z-[1000] flex w-[200px] translate-x-[-50%] translate-y-[3em] flex-col rounded-lg 
                        bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-[1.65em]
                        group-hover:opacity-100 lg:w-[300px]"
                      >
                        <div className="absolute left-[50%] top-0 -z-10 h-6 w-6 translate-x-[80%] translate-y-[-40%] rotate-45 select-none rounded bg-richblack-5 "></div>
                        {subLinks.length ? (
                          subLinks?.map((subLink, i) => (
                            <Link
                              to={`${subLink.link}`}
                              className="rounded-lg bg-transparent py-4 pl-4 hover:bg-richblack-50"
                              key={i}
                            >
                              <p>{subLink.title}</p>
                            </Link>
                          ))
                        ) : (
                          <div></div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <Link to={link?.path}>
                      <p
                        className={`${
                          matchRoute(link?.path)
                            ? "text-yellow-25"
                            : "text-richblack-25"
                        }`}
                      >
                        {link.title}
                      </p>
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/**LOGIN SIGNUP CART */}
        <div className="flex gap-x-4 items-center">
          {user && user?.accountType != "Instructor" && (
            <Link to="/dashboard/cart" className="relative">
              <AiOutlineShoppingCart className="text-2xl text-richblack-100" />
              {totalItems > 0 && (
                <span className="absolute -bottom-2 -right-2 grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-richblack-600 text-center text-xs font-bold text-yellow-100">
                  {totalItems}
                </span>
              )}
            </Link>
          )}

          {token === null && (
            <Link to="/login">
              <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                Log in
              </button>
            </Link>
          )}
          {token === null && (
            <Link to="/signup">
              <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                sign up
              </button>
            </Link>
          )}

          {token !== null && <ProfileDropDown />}
        </div>
        <button className="mr-4 md:hidden">
          <AiOutlineMenu fontSize={24} fill="#AFB2BF" />
        </button>
      </div>
    </div>
  );
};

export default Header;
