import { useEffect } from "react";

//  This hook detects clicks outside of the specified component and calls the provided handler function

export default function useOnClickOutside(ref, handler) {
  useEffect(() => {
    // Define the listener function to be called on click/touch events
    const listener = (event) => {
      //console.log("event occured" , event)

      // If the click/touch event originated inside the ref element, do nothing

      // console.log("current ref" , ref.current)
      //event.target -> it will say where the click is actually happend 
      //if event.target is not in current ref -> setOpen(false) -> bahr clk hua h -> close dropdown
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      // console.log("current ref conatins" , ref.current.contains(event.target))
      // Otherwise, call the provided handler function
   
      handler(event);
    };

    // Add event listeners for mousedown and touchstart events on the document
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    // Cleanup function to remove the event listeners when the component unmounts or when the ref/handler dependencies change
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
    // Only run this effect when the ref or handler function changes
  }, [ref, handler]);
}
