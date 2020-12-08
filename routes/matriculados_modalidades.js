const bodyParser = require('body-parser');
var admin = require("firebase-admin");

module.exports = app => {

  var jsonParser = bodyParser.json()

  // cadastrar matriculados e modalidades (funcionando)
  app.post('/matriculados_modalidades', jsonParser, async function (req, res) {

    var idAlunoRecebido = req.body.idAluno
    var idModalidadeRecebido = req.body.idModalidade

    const conexao = admin.firestore();

    const result = await conexao.collection('anne_gym_matriculados_modalidades').add(
      {
        idAluno: idAlunoRecebido,
        idModalidade: idModalidadeRecebido,
      }
    );
    res.send('Matricula-modalidade inserida com sucesso.')
  });

  // obter todas as matriculas_modalidades (funcionando)
  app.get("/matriculados_modalidades", async (req, res) => {
    const conexao = admin.firestore();
    var dados = []

    // busca todos os itens da coleção (await aguarda até obter todos os dados)
    let modalidadesMatricList = await conexao.collection("anne_gym_matriculados_modalidades").get()

    for (let modalidadesMatricDoc of modalidadesMatricList.docs) {
      // pega o dado de cada documento e inserir na lista
      dados.push(modalidadesMatricDoc.data())
    }

    if (!dados.length) {
      res.send('Sem matriculas em modalidades inseridas')
    }

    res.send({
      matriculas_modalidades: dados
    });
  });

  // atualizar matricula modalidade passando id da modalidade
  app.put('/matriculados_modalidades/:idModalidade', jsonParser, async function (req, res) {

    var idMatriModalidadeRecebida = req.params.idModalidade

    var idMatriculaModalidadeDoc = ""

    // pegar dados put request 
    var idModalidadeRecebida = req.body.idModalidade
    var idAlunoRecebido = req.body.idAluno

    const conexao = admin.firestore();

    // busca todos os itens da coleção (await aguarda até obter todos os dados)
    let modalidadeMatriLista = await conexao.collection("anne_gym_matriculados_modalidades").get()

    for (let modalidadeMatriDoc of modalidadeMatriLista.docs) {
      // pega o dado de cada documento 
      var modalidadeMatriData = modalidadeMatriDoc.data();
      // se o id do doc for igual ao passado por parametro, obter id do doc 
      if (modalidadeMatriDoc.id == idMatriModalidadeRecebida) {


        // se alguma variavel estiver undefined é porque o usuario nao quer atualizar ela
        // então pegar os dados atuais armazenados no firestore para nao alterar para undefined
        if (idModalidadeRecebida == undefined)
          idModalidadeRecebida = modalidadeMatriData.idModalidade
        if (idAlunoRecebido == undefined)
          idAlunoRecebido = modalidadeMatriData.idAluno

        idMatriculaModalidadeDoc = modalidadeMatriDoc.id

        break;
      }
    }

    if (idMatriculaModalidadeDoc == "") {
      res.send('Matriculas em modalidades é inexistente no sistema');
    }

    // const cityRef = db.collection('cities').doc('DC');
    // const res = await cityRef.update({capital: true});

    // atualizando dados necessarios
    const result = await conexao.collection('anne_gym_matriculados_modalidades').doc(idMatriculaModalidadeDoc).update(
      {
        idModalidade: idModalidadeRecebida,
        idAluno: idAlunoRecebido
      }
    );
    res.send('Atualizado com sucesso.')
  });

  // deletar matricula-modalidade por id (funcionado)
  app.delete("/matriculados_modalidades/:idMatriculaModalidade", async (req, res) => {

    const conexao = admin.firestore();

    // busca todos os itens da coleção (await aguarda até obter todos os dados)
    let modalidadesMatriList = await conexao.collection("anne_gym_matriculados_modalidades").get()

    var idMatriculaModalidade = req.params.idMatriculaModalidade

    var removeu = false
    for (let modalidadesMatriDoc of modalidadesMatriList.docs) {
      if (idMatriculaModalidade == modalidadesMatriDoc.id) {
        removeu = true
        break;
      }
    }

    if (removeu) {
      let deleteDoc = await conexao.collection("anne_gym_matriculados_modalidades").doc(idMatriculaModalidade).delete()
      res.send("Matricula em modalidade removida do sistema");
    } else
      res.send('Matricula em modalidade especificada não foi encontrada');
  });
}