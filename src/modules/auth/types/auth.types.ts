// @module: auth
// @layer: types
// @scope: module
// @deps: none

export type AuthUser = {
  id: string
  email: string
  accessToken: string
}

export type AuthError = {
  message: string
  status?: number
}

export type ForgotPasswordResponse = {
  message: string
}

export type ResetPasswordResponse = {
  message: string
}
