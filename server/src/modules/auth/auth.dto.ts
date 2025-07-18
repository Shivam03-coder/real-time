type SignUpUserType = {
  name: string;
  email: string;
  password: string;
  isAccepted: boolean;
};

type SignInUserType = {
  email: string;
  password: string;
};

export { SignUpUserType, SignInUserType };
