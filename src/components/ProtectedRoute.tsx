import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated, validateWithServer } from "@/lib/session";

interface ProtectedRouteProps {
  children: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        // First try server-validated session (works when backend sets http-only cookie)
        const serverData = await validateWithServer();
        if (!mounted) return;

        if (serverData) {
          setAuthed(true);
          setLoading(false);
          return;
        }

        // Fallback to client-side cookie presence
        if (isAuthenticated()) {
          setAuthed(true);
        } else {
          setAuthed(false);
        }
      } catch (err) {
        // on error, fallback to client cookie
        setAuthed(isAuthenticated());
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (!authed) return <Navigate to="/login" replace />;

  return children;
};

export default ProtectedRoute;
