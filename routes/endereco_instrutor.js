const bodyParser = require('body-parser');
var admin = require("firebase-admin");

module.exports = app => {

  var jsonParser = bodyParser.json()

  // cadastrar mapeamento endereço instrutor (funcionando)
  app.post('/endereco_instrutor', jsonParser, async function (req, res) {
    var id_endereco = req.body.idEndereco
    var id_instrutor = req.body.idInstrutor

    const conexao = admin.firestore();

    const result = await conexao.collection('anne_gym_endereco_instrutor').add(
      {
        idEndereco: id_endereco,
        idInstrutor: id_instrutor,
      }
    );
    res.send('Instrutor - Endereço mapeado com sucesso.')
  });

  // obter todos os mapeamentos endereço instrutor (funcionado)
  app.get("/endereco_instrutor", async (req, res) => {
    const conexao = admin.firestore();
    var dados = []

    // busca todos os itens da coleção (await aguarda até obter todos os dados)
    let enderecoInstrutorLista = await conexao.collection("anne_gym_endereco_instrutor").get()

    for (let enderecoDoc of enderecoInstrutorLista.docs) {
      // pega o dado de cada documento 
      dados.push(enderecoDoc.data())
    }

    if (!dados.length) {
      res.send('Sem endereço - Instrutor cadastrado')
    }
    res.send({
      enderecos: dados
    });
  });


  // atualizar endereco_instrutor passando id do instrutor
  app.put('/endereco_instrutor/:idInstrutor', jsonParser, async function (req, res) {
    var idInstrutorRecebido = req.params.idInstrutor

    var idEndInstrutor = ""

    // pegar dados put request 
    var idEnderecoRecebido = req.body.idEndereco

    const conexao = admin.firestore();

    // busca todos os itens da coleção  (await aguarda até obter todos os dados)
    let endeInstrList = await conexao.collection("anne_gym_endereco_instrutor").get()


    for (let endInstrDoc of endeInstrList.docs) {
      // pega o dado de cada documento 
      var endInstrData = endInstrDoc.data();
      // se o email for igual ao passado por parametro, obter id do doc 
      if (endInstrData.idInstrutor == idInstrutorRecebido) {


        // se alguma variavel estiver undefined é porque o usuario nao quer atualizar ela
        // então pegar os dados atuais armazenados no firestore para nao alterar para undefined
        if (idEnderecoRecebido == undefined)
          idEnderecoRecebido = endInstrData.idEndereco

        // obter o id do doc para poder fazer a atualização
        idEndInstrutor = endInstrDoc.id

        break;
      }
    }

    if (idEndInstrutor == "") {
      res.send('Instrutor não possui endereço cadastrado ou Instrutor não está cadastrado no sistema');
    }

    // const cityRef = db.collection('cities').doc('DC');
    // const res = await cityRef.update({capital: true});



    // atualizando dados necessarios
    const result = await conexao.collection('anne_gym_endereco_instrutor').doc(idEndInstrutor).update(
      {
        idEndereco: idEnderecoRecebido
      }
    );
    res.send('Atualizado com sucesso.')
  });

  // deletar endereco por id do instrutor (funcionado)
  app.delete("/endereco_instrutor/:idInstrutor", async (req, res) => {

    const conexao = admin.firestore();

    // busca todos os itens da coleção (await aguarda até obter todos os dados)
    let endInstrutorList = await conexao.collection("anne_gym_endereco_instrutor").get()

    var idInstrutor = req.params.idInstrutor
    var idEndInstrutor = ""

    for (let endInstruDoc of endInstrutorList.docs) {
      if (idInstrutor == endInstruDoc.data().idInstrutor) {
        idEndInstrutor = endInstruDoc.id;
        break;
      }
    }

    if (idEndInstrutor == "") {
      res.send('Instrutor não foi encontrado ou não possui endereço cadastrado');
    }

    let deleteDoc = await conexao.collection("anne_gym_endereco_instrutor").doc(idEndInstrutor).delete()

    res.send("Mapeamento Instrutor - Endereco removido do sistema");
  });
}