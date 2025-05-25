import { redirect } from "next/navigation";

export default function UsernameIndex({
  params,
}: {
  params: { username: string };
}) {
  return redirect(`/${params.username}/home`);
}
