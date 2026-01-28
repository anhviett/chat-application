import { useEffect, useState } from "react";
import { UserType } from "@/types/user-type";
import { userApi } from "@/api/user";

export function useUserList() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getListUser = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await userApi.getAll();
        setUsers(data);
      } catch (err) {
        setError((err as Error)?.message || "Failed to fetch users");
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };
    getListUser();
  }, []);

  return {
    users,
    loading,
    error,
  };
}