export type AuthUser = {
  id: string
  username: string
  email: string
  token: string
}

export type AuthError = {
  code: string
  message: string
}

export type ForgotPasswordResponse = {
  message: string
}

export type ResetPasswordResponse = {
  message: string
}
