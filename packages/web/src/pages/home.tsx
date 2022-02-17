import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSpaces } from "../hooks/spaces";

export default function Home() {
  const { data: spaces } = useSpaces();
  const navigate = useNavigate();

  useEffect(() => {
    if (spaces?.[0]?.handle) {
      navigate(`${spaces[0].handle}/somepage`);
    }
  }, [spaces?.[0]?.handle]);

  return null;
}
