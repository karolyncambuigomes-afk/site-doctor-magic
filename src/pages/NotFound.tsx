import { Link } from "react-router-dom";
import { useSafeLocation } from '@/hooks/useSafeRouter';
import { useEffect } from "react";

const NotFound = () => {
  const location = useSafeLocation();

  // Safety check for router context
  if (!location) {
    return <div>Page not found</div>;
  }

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted">
      <div className="text-center">
        <h1 className="luxury-heading-xl mb-4">404</h1>
        <p className="luxury-body-lg text-muted-foreground mb-4">Oops! Page not found</p>
        <Link to="/" className="text-primary hover:text-primary/80 underline luxury-body-base">
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
