import * as React from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile(): boolean {
  // Define state tracker of mobile status.
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(
    undefined
  );

  React.useEffect(() => {
    // Set a watch on the window size.
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);

    // Define handler for setting mobile status based on window size.
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    // Add listener to watch for changes in window size with call to mobile status handler.
    mql.addEventListener("change", onChange);

    // Set the initial mobile status based on window size.
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);

    // On cleanup, remove the listener.
    return () => mql.removeEventListener("change", onChange);
  }, []);

  // Return the mobile status with undefined as false.
  return !!isMobile;
}
