"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

const MainPage = () => {
  const router = useRouter();
  useEffect(() => {
    router.push("/social");
  }, []);
  return null;
};
export default MainPage;
