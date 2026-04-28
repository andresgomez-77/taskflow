// ─── JwtPayload ───────────────────────────────────────────────────────────────
// Esta es la información que se CODIFICA dentro del token JWT.
// Regla de oro: NO guardes información sensible aquí (passwords, tarjetas, etc.)
// El payload es visible para cualquiera que tenga el token — solo está firmado,
// no cifrado. Guarda el mínimo necesario para identificar al usuario.
export interface JwtPayload {
  sub: string;   // "subject" — estándar JWT, aquí va el userId
  email: string;
}
