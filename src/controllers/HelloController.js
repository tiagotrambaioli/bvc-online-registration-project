class HelloController {
  async index(req, res) {
    return res.json({ hello: 'motherfucker!' });
  }
}

export default new HelloController();
