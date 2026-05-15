export type TLoginContainerProps = {}

export type TLoginData = {
  email: string;
  password: string; 
}

export type TLoginViewProps = {
  handleSubmit: () => void,
  handleForgotPassword: () => void,
  handleSignUp: () => void,
  handleUpdateEmail: React.Dispatch<React.SetStateAction<string>>,
  handleUpdatePassword: React.Dispatch<React.SetStateAction<string>>,
}