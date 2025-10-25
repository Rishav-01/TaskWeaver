import { Dispatch, SetStateAction } from "react";

export interface LoginFormProps {
  setAuthTab: Dispatch<SetStateAction<"login" | "signup">>;
}

export interface SignUpFormProps {
  setAuthTab: Dispatch<SetStateAction<"login" | "signup">>;
}
