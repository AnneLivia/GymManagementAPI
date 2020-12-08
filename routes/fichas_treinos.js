const bodyParser = require('body-parser');
var admin = require("firebase-admin");

module.exports = app => {

  var jsonParser = bodyParser.json()

  // cadastrar matriculados e modalidades (funcionando)
  app.post('/fichas_treinos', jsonParser, async function (req, res) {

    var idAlunoRecebido = req.body.idAluno
    var idExercicioRecebido = req.body.idExercicio
    var seriesRecebida = req.body.series
    var repeticaoRecebida = req.body.repeticao
    var intervaloRecebido = req.body.intervalo
    var mesInicioRecebido = req.body.mesInicio
    var quantidadeDiasRecebido = req.body.quantidadeDias
    var idAInstrutorRecebido = req.body.idInstrutor

    const conexao = admin.firestore();

    const result = await conexao.collection('anne_gym_fichas_treinos').add(
      {
        idAluno: idAlunoRecebido,
        idExercicio: idExercicioRecebido,
        series: seriesRecebida,
        repeticao: repeticaoRecebida,
        intervalo: intervaloRecebido,
        dataCadastro: new Date(),
        mesInicio: mesInicioRecebido,
        quantidadeDias: quantidadeDiasRecebido,
        idInstrutor: idAInstrutorRecebido
      }
    );
    res.send('Ficha de treino inserida com sucesso.')
  });

  // obter todas as fichas-treino (funcionando)
  app.get("/fichas_treinos", async (req, res) => {
    const conexao = admin.firestore();
    var dados = []

    // busca todos os itens da coleção (await aguarda até obter todos os dados)
    let fichasList = await conexao.collection("anne_gym_fichas_treinos").get()

    for (let fichasDoc of fichasList.docs) {
      // pega o dado de cada documento e inserir na lista
      dados.push(fichasDoc.data())
    }

    if (!dados.length) {
      res.send('Sem fichas de treinos inseridas')
    }

    res.send({
      fichas: dados
    });
  });


  // obter todos os treinos de um determinado aluno, passar id do aluno (funcionando)
  app.get("/fichas_treinos/aluno/:idAluno", async (req, res) => {
    const conexao = admin.firestore();

    var todasAsFichas = []

    var idAluno = req.params.idAluno

    // busca todos os itens da coleção (await aguarda até obter todos os dados)
    let fichasLista = await conexao.collection("anne_gym_fichas_treinos").get()

    for (let fichasDoc of fichasLista.docs) {
      // pega o dado de cada documento e inserir na lista
      if (fichasDoc.data().idAluno == idAluno) {
        todasAsFichas.push(fichasDoc.data())
      }
    }

    if (!todasAsFichas.length) {
      res.send("Não há fichas para o aluno especificado")
    }

    res.send({
      fichas: todasAsFichas
    });
  });

  // obter todos os treinos cadastrados por um determinado instrutor, passar id do instrutor (funcionando)
  app.get("/fichas_treinos/instrutor/:idInstrutor", async (req, res) => {
    const conexao = admin.firestore();

    var todasAsFichas = []

    var idInstrutor = req.params.idInstrutor

    // busca todos os itens da coleção (await aguarda até obter todos os dados)
    let fichasLista = await conexao.collection("anne_gym_fichas_treinos").get()

    for (let fichasDoc of fichasLista.docs) {
      // pega o dado de cada documento e inserir na lista
      if (fichasDoc.data().idInstrutor == idInstrutor) {
        todasAsFichas.push(fichasDoc.data())
      }
    }

    if (!todasAsFichas.length) {
      res.send("Não há fichas cadastradas pelo instrutor especificado")
    }

    res.send({
      fichas: todasAsFichas
    });
  });


  // obter todas as fichas de um determinado exercicio, passar id do exercicico (funcionando)
  app.get("/fichas_treinos/exercicio/:idExercicio", async (req, res) => {
    const conexao = admin.firestore();

    var todasAsFichas = []

    var idExercicio = req.params.idExercicio

    // busca todos os itens da coleção (await aguarda até obter todos os dados)
    let fichasLista = await conexao.collection("anne_gym_fichas_treinos").get()

    for (let fichasDoc of fichasLista.docs) {
      // pega o dado de cada documento e inserir na lista
      if (fichasDoc.data().idExercicio == idExercicio) {
        todasAsFichas.push(fichasDoc.data())
      }
    }

    if (!todasAsFichas.length) {
      res.send("Não há fichas com o exercicio especificado")
    }

    res.send({
      fichas: todasAsFichas
    });
  });


  // atualizar matricula modalidade passando id da modalidade
  app.put('/fichas_treinos/:idFicha', jsonParser, async function (req, res) {

    var idFichaRecebida = req.params.idFicha

    var idFichaDoc = ""

    // pegar dados put request 
    var idAlunoRecebido = req.body.idAluno
    var idExercicioRecebido = req.body.idExercicio
    var seriesRecebida = req.body.series
    var repeticaoRecebida = req.body.repeticao
    var intervaloRecebido = req.body.intervalo
    var mesInicioRecebido = req.body.mesInicio
    var quantidadeDiasRecebido = req.body.quantidadeDias
    var idAInstrutorRecebido = req.body.idInstrutor

    const conexao = admin.firestore();

    // busca todos os itens da coleção (await aguarda até obter todos os dados)
    let fichaLista = await conexao.collection("anne_gym_fichas_treinos").get()

    for (let fichaDoc of fichaLista.docs) {
      // pega o dado de cada documento 
      var fichaData = fichaDoc.data();
      // se o id do doc for igual ao passado por parametro, obter id do doc 
      if (fichaDoc.id == idFichaRecebida) {
        // se alguma variavel estiver undefined é porque o usuario nao quer atualizar ela
        // então pegar os dados atuais armazenados no firestore para nao alterar para undefined
        if (idAlunoRecebido == undefined)
          idAlunoRecebido = fichaData.idAluno
        if (idAInstrutorRecebido == undefined)
          idAInstrutorRecebido = fichaData.idInstrutor
        if (idExercicioRecebido == undefined)
          idExercicioRecebido = fichaData.idExercicio
        if (seriesRecebida == undefined)
          seriesRecebida = fichaData.series
        if (intervaloRecebido == undefined)
          intervaloRecebido = fichaData.intervalo
        if (mesInicioRecebido == undefined)
          mesInicioRecebido = fichaData.mesInicio
        if (repeticaoRecebida == undefined)
          repeticaoRecebida = fichaData.repeticao
        if (quantidadeDiasRecebido == undefined)
          quantidadeDiasRecebido = fichaData.quantidadeDias

        idFichaDoc = fichaDoc.id

        break;
      }
    }

    if (idFichaDoc == "") {
      res.send('Ficha de treino é inexistente no sistema');
    }

    // const cityRef = db.collection('cities').doc('DC');
    // const res = await cityRef.update({capital: true});

    const result = await conexao.collection('anne_gym_fichas_treinos').doc(idFichaDoc).update(
      {
        idAluno: idAlunoRecebido,
        idExercicio: idExercicioRecebido,
        series: seriesRecebida,
        repeticao: repeticaoRecebida,
        intervalo: intervaloRecebido,
        dataCadastro: new Date(),
        mesInicio: mesInicioRecebido,
        quantidadeDias: quantidadeDiasRecebido,
        idInstrutor: idAInstrutorRecebido
      }
    );
    res.send('Atualizado com sucesso.')
  });

  // deletar ficha de treino por id (funcionado)
  app.delete("/fichas_treinos/:idFicha", async (req, res) => {

    const conexao = admin.firestore();

    // busca todos os itens da coleção (await aguarda até obter todos os dados)
    let fichaLista = await conexao.collection("anne_gym_fichas_treinos").get()

    var idFicha = req.params.idFicha

    var removeu = false
    for (let fichaDoc of fichaLista.docs) {
      if (idFicha == fichaDoc.id) {
        removeu = true
        break;
      }
    }

    if (removeu) {
      let deleteDoc = await conexao.collection("anne_gym_fichas_treinos").doc(idFicha).delete()
      res.send("Ficha de treino removida do sistema");
    } else
      res.send('Ficha de treino especificada não foi encontrada');
  });
}