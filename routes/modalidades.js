const bodyParser = require('body-parser');
var admin = require("firebase-admin");

module.exports = app => {

  var jsonParser = bodyParser.json()

  // cadastrar modalidades (funcionando)
  app.post('/modalidades', jsonParser, async function (req, res) {

    var nomeModalidade = req.body.nome
    var descricaoModalidade = req.body.descricao

    const conexao = admin.firestore();

    const result = await conexao.collection('anne_gym_modalidades').add(
      {
        nome: nomeModalidade,
        descricao: descricaoModalidade,
      }
    );
    res.send('Modalidade inserida com sucesso.')
  });

  // obter todas as modalidades (funcionando)
  app.get("/modalidades", async (req, res) => {
    const conexao = admin.firestore();
    var dados = []

    // busca todos os itens da coleção (await aguarda até obter todos os dados)
    let modalidadesList = await conexao.collection("anne_gym_modalidades").get()

    for (let modalidadesDoc of modalidadesList.docs) {
      // pega o dado de cada documento e inserir na lista
      dados.push(modalidadesDoc.data())
    }

    if (!dados.length) {
      res.send('Sem modalidades cadastradas')
    }

    res.send({
      modalidades: dados
    });
  });

  // atualizar modalidade passando id da modalidade
  app.put('/modalidades/:idModalidade', jsonParser, async function (req, res) {

    var idModalidadeRecebida = req.params.idModalidade

    var idModalidadeDoc = ""

    // pegar dados put request 
    var nomeModalidade = req.body.nome
    var descricaoModalidade = req.body.descricao

    const conexao = admin.firestore();

    // busca todos os itens da coleção (await aguarda até obter todos os dados)
    let modalidadeLista = await conexao.collection("anne_gym_modalidades").get()

    for (let modalidadeDoc of modalidadeLista.docs) {
      // pega o dado de cada documento 
      var modalidadeData = modalidadeDoc.data();
      // se o id da modalidade for igual ao passado por parametro, obter id do doc 
      if (modalidadeDoc.id == idModalidadeRecebida) {


        // se alguma variavel estiver undefined é porque o usuario nao quer atualizar ela
        // então pegar os dados atuais armazenados no firestore para nao alterar para undefined
        if (nomeModalidade == undefined)
          nomeModalidade = modalidadeData.nome
        if (descricaoModalidade == undefined)
          descricaoModalidade = modalidadeData.descricao

        idModalidadeDoc = modalidadeDoc.id

        break;
      }
    }

    if (idModalidadeDoc == "") {
      res.send('Modalidade inexistente no sistema');
    }

    // const cityRef = db.collection('cities').doc('DC');
    // const res = await cityRef.update({capital: true});

    // atualizando dados necessarios
    const result = await conexao.collection('anne_gym_modalidades').doc(idModalidadeDoc).update(
      {
        nome: nomeModalidade,
        descricao: descricaoModalidade
      }
    );
    res.send('Atualizado com sucesso.')
  });

  // deletar modalidade por id (funcionado)
  app.delete("/modalidades/:idModalidade", async (req, res) => {

    const conexao = admin.firestore();

    // busca todos os itens da coleção (await aguarda até obter todos os dados)
    let modalidadesList = await conexao.collection("anne_gym_modalidades").get()

    var idModalidade = req.params.idModalidade
    var removeu = false
    for (let modalidadeDoc of modalidadesList.docs) {
      if (idModalidade == modalidadeDoc.id) {
        removeu = true
        break;
      }
    }

    if (removeu) {
      let deleteDoc = await conexao.collection("anne_gym_modalidades").doc(idModalidade).delete()

      // se modalidade for removida, precisa remover sua matricula em quaisquer modalidades
      let matriculasLista = await conexao.collection("anne_gym_matriculados_modalidades").get()

      for (let matrDoc of matriculasLista.docs) {
        // se o dado contiver o id da modalidade, remover a matricula
        var matrData = matrDoc.data();
        if (matrData.idModalidade == idModalidade) {
          let deleteDoc = await conexao.collection("anne_gym_matriculados_modalidades").doc(matrDoc.id).delete()
        }
      }

      res.send("Modalidade removida do sistema");
    } else
      res.send('Modalidade especificada não foi encontrada');
  });
}