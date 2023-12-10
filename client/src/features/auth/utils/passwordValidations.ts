export const passwordValidations = {
  isMinLength8: (password: string) =>
    password.length >= 8 || 'password should be at least 8 characters',

  isUppercase: (password: string) =>
    /[A-Z]/.test(password) || 'password should contain at least one uppercase',

  isLowercase: (password: string) =>
    /[a-z]/.test(password) || 'password should contain at least one lowercase',

  isDigit: (password: string) =>
    /\d/.test(password) || 'Password should contain at least one digit',

  isSpecialChar: (password: string) =>
    /[!@#$%^&*()\-=_+[\]{}|;:'",.<>?]/.test(password) ||
    'password should contain at least one special character',
}
