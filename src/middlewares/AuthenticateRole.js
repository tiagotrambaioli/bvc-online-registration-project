export default function AuthenticateRole(role) {
  return (req, res, next) => {
    if (req.body.uuid !== req.user.uuid && req.user.role !== role) {
      res.status(401);
      return res.send({ error: 'Not allowed!' });
    }
    next();
  };
}
