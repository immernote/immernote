import { useParams } from "react-router-dom";
import { Layout } from "~/components/layout";
import { useFetchBlockChildren } from "~/hooks/fetch";
import RootBlock from "~/components/RootBlock";

export default function Page() {
  const { id } = useParams<{ id: string }>();
  useFetchBlockChildren(id);

  return (
    <Layout title="Page">
      <RootBlock id={id!} />
    </Layout>
  );
}
