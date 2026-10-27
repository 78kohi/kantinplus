
import { useAuth } from "../context/AuthContext";

export default function AuthStatus() {
  const { user, loading, signOut } = useAuth();

  if (loading) return <p>Checking login...</p>;

  if (!user) return <p>Not logged in</p>;

  return (
    <div>
      <p>Logged in as: {user.email}</p>

      <button onClick={signOut}>
        Log out
      </button>
    </div>
  );
}
