import type { LoginDto, SignupDto } from "../schemas/auth.schema"
import type { AuthUser, AuthError } from "../types/auth.types"

const mockDelay = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms))

export async function loginUser(dto: LoginDto): Promise<AuthUser> {
  await mockDelay(800)
  if (dto.identifier === "error@test.com") {
    const error: AuthError = {
      code: "INVALID_CREDENTIALS",
      message: "Invalid email or password.",
    }
    throw error
  }
  return {
    id: "mock-user-1",
    username: "bisaya_artist",
    email: dto.identifier,
    token: "mock-jwt-token-12345",
  }
}

export async function signupUser(dto: SignupDto): Promise<AuthUser> {
  await mockDelay(800)
  if (dto.username === "reserved_user") {
    const error: AuthError = {
      code: "USERNAME_TAKEN",
      message: "That username is already taken.",
    }
    throw error
  }
  return {
    id: "mock-user-2",
    username: dto.username,
    email: dto.email,
    token: "mock-jwt-token-67890",
  }
}
