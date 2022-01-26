import { useParams } from "react-router-dom";
import { PageBlock } from "../components/block";
import { Layout } from "../components/layout";
import { usePageBlockChildren } from "../hooks/blocks";

export default function Page() {
  const { id } = useParams<{ id: string }>();
  const { data: blocks } = usePageBlockChildren(id);

  console.log(blocks);

  return (
    <Layout title="Page">
      <PageBlock id={id!} root />
    </Layout>
  );
}
