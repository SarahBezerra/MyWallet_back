import db from "../db.js"

export async function validateToken(req, res, next) {
  const authorization = req.headers.authorization;
  
  const token = authorization?.replace("Bearer ", "");
  if (!token) {
    return res.send("-Faça cadastro/login para continuar").status(401);
  }

  const session = await db.collection("sessions").findOne({ token });
  if (!session) {
    return res.send("--Faça cadastro/login para continuar").status(401);
  }

  const user = await db.collection("userData").findOne({ _id: session.userId });
  if (!user) {
    return res.send("---Faça cadastro/login para continuar").status(401);
  }

  res.locals.user = user;
  
  next();
}