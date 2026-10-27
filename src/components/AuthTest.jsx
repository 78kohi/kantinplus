
import { signIn, getCurrentUser } from "../services/authService";

export default function AuthTest() {
  async function handleTest() {
    try {
      const data = await signIn(
        "tataemery15@gmail.com",
        "ilovemorin!!"
      );

      console.log("Login successful:", data.user);

      const user = await getCurrentUser();
      console.log("Current user:", user);
    } catch (error) {
      console.error("Login failed:", error.message);
    }
  }

  return <button onClick={handleTest}>Test login</button>;
}
