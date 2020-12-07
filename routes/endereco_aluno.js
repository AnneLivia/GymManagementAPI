const bodyParser = require('body-parser');
var admin = require("firebase-admin");

module.exports = app => {

  var jsonParser = bodyParser.json()

  // cadastrar mapeamento endereco_aluno (funcionando)
  app.post('/endereco_aluno', jsonParser, async function (req, res) {
    var id_endereco = req.body.idEndereco
    var id_aluno = req.body.idAluno

    const conexao = admin.firestore();

    const result = await conexao.collection('anne_gym_endereco_aluno').add(
      {
        idEndereco: id_endereco,
        idAluno: id_aluno,
      }
    );
    res.send('Aluno - Endereço mapeado com sucesso.')
  });

  // obter todos os mapeamentos endereço aluno (funcionando)
  app.get("/endereco_aluno", async (req, res) => {
    const conexao = admin.firestore();
    var dados = []

    // busca todos os itens da coleção endereço aluno (await aguarda até obter todos os dados)
    let enderecoAlunoLista = await conexao.collection("anne_gym_endereco_aluno").get()

    for (let enderecoDoc of enderecoAlunoLista.docs) {
      // pega o dado de cada documento e inserir na lista
      dados.push(enderecoDoc.data())
    }

    if (!dados.length) {
      res.send('Sem endereço - Aluno cadastrado')
    }

    res.send({
      enderecos: dados
    });
  });


  // atualizar endereco_aluno passando id do aluno
  app.put('/endereco_aluno/:idAluno', jsonParser, async function (req, res) {

    var idAlunoRecebido = req.params.idAluno

    var idEndeAluno = ""

    // pegar dados put request 
    var idEnderecoRecebido = req.body.idEndereco

    const conexao = admin.firestore();

    // busca todos os itens da coleção (await aguarda até obter todos os dados)
    let endeAlunoList = await conexao.collection("anne_gym_endereco_aluno").get()


    for (let endAlunoDoc of endeAlunoList.docs) {
      // pega o dado de cada documento 
      var endAlunoData = endAlunoDoc.data();
      // se o id do aluno for igual ao passado por parametro, obter id do doc 
      if (endAlunoData.idAluno == idAlunoRecebido) {


        // se alguma variavel estiver undefined é porque o usuario nao quer atualizar ela
        // então pegar os dados atuais armazenados no firestore para nao alterar para undefined
        if (idEnderecoRecebido == undefined)
          idEnderecoRecebido = endAlunoData.idEndereco

        idEndeAluno = endAlunoDoc.id

        break;
      }
    }

    if (idEndeAluno == "") {
      res.send('Aluno não possui endereço cadastrado ou aluno não está cadastrado no sistema');
    }

    // const cityRef = db.collection('cities').doc('DC');
    // const res = await cityRef.update({capital: true});



    // atualizando dados necessarios
    const result = await conexao.collection('anne_gym_endereco_aluno').doc(idEndeAluno).update(
      {
        idEndereco: idEnderecoRecebido
      }
    );
    res.send('Atualizado com sucesso.')
  });

  // deletar endereco por id do aluno (funcionado)
  app.delete("/endereco_aluno/:idAluno", async (req, res) => {

    const conexao = admin.firestore();

    // busca todos os itens da coleção  (await aguarda até obter todos os dados)
    let endAlunoList = await conexao.collection("anne_gym_endereco_aluno").get()

    var idAluno = req.params.idAluno
    var idEndAluno = ""

    for (let endAlunoDoc of endAlunoList.docs) {
      if (idAluno == endAlunoDoc.data().idAluno) {
        idEndAluno = endAlunoDoc.id;
        break;
      }
    }

    if (idEndAluno == "") {
      res.send('Aluno não foi encontrado ou não possui endereço cadastrado');
    }

    let deleteDoc = await conexao.collection("anne_gym_endereco_aluno").doc(idEndAluno).delete()

    res.send("Mapeamento Aluno - Endereco removido do sistema");
  });
}