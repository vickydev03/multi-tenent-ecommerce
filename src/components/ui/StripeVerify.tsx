import React from "react";
import { Button, Link } from "@payloadcms/ui";
function StripeVerify() {
  return (
    <Link href={"stripe-verify"}>
      <Button>Verify account</Button>
    </Link>
  );
}

export default StripeVerify;
