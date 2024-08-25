import GitHub from "@auth/core/providers/github";
import Google from "@auth/core/providers/google";
import { DataModel } from "./_generated/dataModel";
import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";

const CustomPassword = Password<DataModel>({
  profile(params) {
    return {
      email: params.email as string,
      name: params.name as string,
    }
  }
})

export const { auth, signIn, signOut, store } = convexAuth({
  providers: [GitHub, Google, CustomPassword],
});
