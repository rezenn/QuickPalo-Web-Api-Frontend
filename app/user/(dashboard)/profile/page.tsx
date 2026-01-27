import { notFound } from "next/navigation";
import UpdateForm from "../_component/UpdateForm";
import { handleGetUser } from "@/lib/actions/auth-action";

export default async function Profile() {
  const result = await handleGetUser();

  if (!result.success) {
    throw new Error("Error fetching user data");
  }
  if (!result.data) {
    notFound();
  }
  return (
    <div>
      <UpdateForm user={result.data} />
    </div>
  );
}
