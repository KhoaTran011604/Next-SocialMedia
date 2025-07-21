import Link from "next/link";
import GoogleSignupButton from "../GoogleSignupButton";
import SignupWithPassword from "../SignupWithPassword";

export default function Signup() {
  return (
    <>
      <div>
        <SignupWithPassword />
      </div>

      <div className="mt-6 text-center">
        <p>
          You have any account?{" "}
          <Link href="/auth/sign-in" className="text-primary">
            Sign In
          </Link>
        </p>
      </div>
    </>
  );
}
