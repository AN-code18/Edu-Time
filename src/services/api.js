//kon se link pr call krne jana h --> end points / paths
const BASE_URL = process.env.REACT_APP_BASE_URL;


// CATAGORIES API
export const categories = {
  CATEGORIES_API: BASE_URL + "/course/showAllCategories", 
};

// CATALOG PAGE DATA
export const catalogData = {
  CATALOGPAGEGDATA_API: BASE_URL + "/course/getCategoryPageDetails",
};
