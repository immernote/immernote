import { useParams } from "react-router-dom";
import { PageBlock } from "../components/block";
import { Layout } from "../components/layout";

export default function Page() {
  const { id } = useParams<{ id: string }>();

  return (
    <Layout title="Page">
      <PageBlock id={id!} root />
    </Layout>
  );
}
