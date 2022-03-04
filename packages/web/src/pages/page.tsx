import { useParams } from "react-router-dom";
import { RootPageBlockChildren } from "../components/RootPageBlockChildren";
import { RootPageBlock } from "../components/RootPageBlock";
import { Layout } from "../components/layout";
import { useFetchBlockChildren } from "../hooks/fetch";

export default function Page() {
  const { id } = useParams<{ id: string }>();
  useFetchBlockChildren(id);

  return (
    <Layout title="Page">
      <RootPageBlock id={id!}>
        <RootPageBlockChildren id={id!}>
          <p>Write something</p>
        </RootPageBlockChildren>
      </RootPageBlock>
    </Layout>
  );
}
