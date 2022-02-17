import axios from "redaxios";

export const fetcher = (key: string) => axios.get(key).then(({ data }) => data);
