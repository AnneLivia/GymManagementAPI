const bodyParser = require('body-parser');
var admin = require("firebase-admin");

module.exports = app => {

  var jsonParser = bodyParser.json()

  // cadastrar exercicios (funcionando)
  app.post('/exercicios', jsonParser, async function (req, res) {

    var nomeExercicio = req.body.nome
    var descricaoExercicio = req.body.descricao

    const conexao = admin.firestore();

    const result = await conexao.collection('anne_gym_exercicios').add(
      {
        nome: nomeExercicio,
        descricao: descricaoExercicio,
      }
    );
    res.send('Exercicio inserido com sucesso.')
  });

  // obter todas os exercicios (funcionando)
  app.get("/exercicios", async (req, res) => {
    const conexao = admin.firestore();
    var dados = []

    // busca todos os itens da coleção (await aguarda até obter todos os dados)
    let exerciciosList = await conexao.collection("anne_gym_exercicios").get()

    for (let exerciciosDoc of exerciciosList.docs) {
      // pega o dado de cada documento e inserir na lista
      dados.push(exerciciosDoc.data())
    }

    if (!dados.length) {
      res.send('Sem exercicios cadastrados')
    }

    res.send({
      exercicios: dados
    });
  });

  // atualizar exercicio passando id
  app.put('/exercicios/:idExercicio', jsonParser, async function (req, res) {

    var idExercicioRecebido = req.params.idExercicio

    var idExercicioDoc = ""

    // pegar dados put request 
    var nomeExercicio = req.body.nome
    var descricaoExercicio = req.body.descricao

    const conexao = admin.firestore();

    // busca todos os itens da coleção (await aguarda até obter todos os dados)
    let exerciciosLista = await conexao.collection("anne_gym_exercicios").get()

    for (let exerciciosDoc of exerciciosLista.docs) {
      // pega o dado de cada documento 
      var exerciciosData = exerciciosDoc.data();
      // se o id do exercicio for igual ao passado por parametro, obter id do doc 
      if (exerciciosDoc.id == idExercicioRecebido) {


        // se alguma variavel estiver undefined é porque o usuario nao quer atualizar ela
        // então pegar os dados atuais armazenados no firestore para nao alterar para undefined
        if (nomeExercicio == undefined)
          nomeExercicio = exerciciosData.nome
        if (descricaoExercicio == undefined)
          descricaoExercicio = exerciciosData.descricao

        idExercicioDoc = exerciciosDoc.id

        break;
      }
    }

    if (idExercicioDoc == "") {
      res.send('Exercicio inexistente no sistema');
    }

    // const cityRef = db.collection('cities').doc('DC');
    // const res = await cityRef.update({capital: true});

    // atualizando dados necessarios
    const result = await conexao.collection('anne_gym_exercicios').doc(idExercicioDoc).update(
      {
        nome: nomeExercicio,
        descricao: descricaoExercicio
      }
    );
    res.send('Atualizado com sucesso.')
  });

  // deletar exercicio por id (funcionado)
  app.delete("/exercicios/:idExercicio", async (req, res) => {

    const conexao = admin.firestore();

    // busca todos os itens da coleção (await aguarda até obter todos os dados)
    let exerciciosList = await conexao.collection("anne_gym_exercicios").get()

    var idExercicio = req.params.idExercicio
    var removeu = false

    for (let exerciciosDoc of exerciciosList.docs) {
      if (idExercicio == exerciciosDoc.id) {
        removeu = true
        break;
      }
    }

    if (removeu) {
      let deleteDoc = await conexao.collection("anne_gym_exercicios").doc(idExercicio).delete()

      // se o exercicio for removido, remover qualquer ficha de treino com seu id
      let fichaLista = await conexao.collection("anne_gym_fichas_treinos").get()

      for (let fichaDoc of fichaLista.docs) {
        // se o dado contiver o id do exercicio, remover a ficha de treino
        var fichaData = fichaDoc.data();
        if (fichaData.idExercicio == idExercicio) {
          let deleteDoc = await conexao.collection("anne_gym_fichas_treinos").doc(fichaDoc.id).delete()
        }
      }

      res.send("Exercicio removido do sistema");
    } else
      res.send('Exercicio especificado não foi encontrado');
  });
}