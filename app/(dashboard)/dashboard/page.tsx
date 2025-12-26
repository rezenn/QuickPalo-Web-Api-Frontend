import Link from "next/link";

export default function Dashboard() {
  return (
    <div>
      <div> Dashboard Screen</div>
      <Link href="/login"> Login</Link>
      <Link href="/register"> Register</Link>
    </div>
  );
}
