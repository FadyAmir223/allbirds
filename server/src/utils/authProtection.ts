function isPasswordComplex(password) {
  return /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()\-=_+[\]{}|;:'",.<>?]).{8,}$/.test(
    password
  );
}

export { isPasswordComplex };
