import { useParams } from "react-router-dom";
import { PageBlock } from "../components/block";
import { Layout } from "../components/layout";
import { useFetchBlockChildren } from "../hooks/fetch";

export default function Page() {
  const { id } = useParams<{ id: string }>();
  useFetchBlockChildren(id);

  return (
    <Layout title="Page">
      <PageBlock id={id!} root />
    </Layout>
  );
}
