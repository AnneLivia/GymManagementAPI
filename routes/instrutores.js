const bodyParser = require('body-parser');
var admin = require("firebase-admin");

module.exports = app => {

  var jsonParser = bodyParser.json()

  // cadastrar instrutores (funcionando)
  app.post('/instrutores', jsonParser, async function (req, res) {
    var nomeInstrutor = req.body.nome
    var cpfInstrutor = req.body.cpf
    var celular = req.body.numeroCelular
    var emailInstrutor = req.body.email
    var data = req.body.dataNascimento
    var generoInstrutor = req.body.genero

    const conexao = admin.firestore();

    const result = await conexao.collection('anne_gym_instrutores').add(
      {
        nome: nomeInstrutor,
        dataCadastro: new Date(),
        cpf: cpfInstrutor,
        numeroCelular: celular,
        email: emailInstrutor,
        dataNascimento: data,
        genero: generoInstrutor
      }
    );
    res.send('Cadastrado com sucesso.')
  });

  // obter todos os instrutores (funcionado)
  app.get("/instrutores", async (req, res) => {
    const conexao = admin.firestore();
    var dados = []

    // busca todos os itens da coleção instrutores (await aguarda até obter todos os dados)
    let instrutoresLista = await conexao.collection("anne_gym_instrutores").get()

    for (let instrutorDoc of instrutoresLista.docs) {
      // pega o dado de cada documento 
      dados.push(instrutorDoc.data())
    }

    if (!dados.length) {
      res.send('Sem instrutores cadastrados')
    }
    res.send({
      istrutoresCadastrados: dados
    });
  });

  // obter instrutores por email (funcionando)
  app.get("/instrutores/email/:email", async (req, res) => {
    const conexao = admin.firestore();

    // busca todos os itens da coleção (await aguarda até obter todos os dados)
    let instrutoresLista = await conexao.collection("anne_gym_instrutores").get()

    var email = req.params.email
    for (let instrutorDoc of instrutoresLista.docs) {
      // pega o dado de cada documento 
      var instrutorData = instrutorDoc.data();
      if (instrutorData.email.toString().toLowerCase() == email.toString().toLowerCase())
        res.send({ instrutor: instrutorData });
    }

    res.send('Instrutor não encontrado');
  });

  // obter todos os instrutores por genero (funcionando)
  app.get("/instrutores/genero/:genero", async (req, res) => {
    const conexao = admin.firestore();

    // busca todos os itens da coleção instrutor (await aguarda até obter todos os dados)
    let instrutoresLista = await conexao.collection("anne_gym_instrutores").get()

    var genero = req.params.genero

    var dados = []

    for (let instrutorDoc of instrutoresLista.docs) {
      // pega o dado de cada documento 
      var instrutorData = instrutorDoc.data();
      if (instrutorData.genero.toString().toLowerCase() == genero.toLowerCase())
        dados.push(instrutorData);
    }

    if (!dados.length)
      res.send('nenhum instrutor de genero ' + genero + ' foi encontrado')

    res.send({ instrutores: dados })
  });


  // obter instrutor por nome (funcionando)
  app.get("/instrutores/nome/:nome", async (req, res) => {
    const conexao = admin.firestore();

    // busca todos os itens da coleção instrutor (await aguarda até obter todos os dados)
    let instrutoresLista = await conexao.collection("anne_gym_instrutores").get()

    var nome = req.params.nome

    var dados = []

    for (let instrutorDoc of instrutoresLista.docs) {
      // pega o dado de cada documento 
      var instrutorData = instrutorDoc.data();
      if (instrutorData.nome.toLowerCase().includes(nome.toLowerCase())) {
        dados.push(instrutorData)
      }
    }

    if (!dados.length) {
      res.send('Sem instrutores com o nome especificado')
    }

    res.send({ instrutor: dados });

  });

  // deletar por email (funcionado)
  app.delete("/instrutores/:email", async (req, res) => {

    const conexao = admin.firestore();

    // busca todos os itens da coleção instrutores (await aguarda até obter todos os dados)
    let instrutoresLista = await conexao.collection("anne_gym_instrutores").get()

    var email = req.params.email
    var idinstrutor = ""

    for (let instrutorDoc of instrutoresLista.docs) {
      // pega o dado de cada documento 
      var instrutoresData = instrutorDoc.data();
      // se o email for igual ao passado por parametro, obter id do doc 
      if (instrutoresData.email.toString().toLowerCase() == email.toString().toLowerCase()) {
        // obtendo o id do doc do instrutor com o email especificado  
        idinstrutor = instrutorDoc.id;
        break
      }
    }

    if (idinstrutor == "") {
      res.send('Instrutor não encontrado');
    }

    let deleteDoc = await conexao.collection("anne_gym_instrutores").doc(idinstrutor).delete()

    // remover o endereco_instrutor também, já que esse instrutor não existe mais
    let end_instrutorLista = await conexao.collection("anne_gym_endereco_instrutor").get()

    for (let endeInstrutorDoc of end_instrutorLista.docs) {
      // se o dados contiver o id do endereco, entao salvar id do instrutor
      var endeInstrutorData = endeInstrutorDoc.data();
      if (endeInstrutorData.idInstrutor == idinstrutor) {
        let deleteDoc = await conexao.collection("anne_gym_endereco_instrutor").doc(endeInstrutorDoc.id).delete()
      }
    }

    res.send("Instrutor removido do sistema");
  });

  // atualizar dados dos instrutores (email)
  app.put('/instrutores/:email', jsonParser, async function (req, res) {
    var email = req.params.email

    // pegar dados put request 
    var nomeInstrutor = req.body.nome
    var cpfInstrutor = req.body.cpf
    var celular = req.body.numeroCelular
    var emailInstrutor = req.body.email
    var data = req.body.dataNascimento
    var generoInstrutor = req.body.genero

    const conexao = admin.firestore();

    // busca todos os itens da coleção instrutores (await aguarda até obter todos os dados)
    let instrutorLista = await conexao.collection("anne_gym_instrutores").get()

    var idInstrutor = ""

    for (let instrutorDoc of instrutorLista.docs) {
      // pega o dado de cada documento 
      var instrutorData = instrutorDoc.data();
      // se o email for igual ao passado por parametro, obter id do doc 
      if (instrutorData.email.toString().toLowerCase() == email.toString().toLowerCase()) {
        // obtendo o id do doc do instrutor com o email especificado  
        idInstrutor = instrutorDoc.id;

        // se alguma variavel estiver undefined é porque o usuario nao quer atualizar ela
        // então pegar os dados atuais para nao alterar para undefined
        if (nomeInstrutor == undefined)
          nomeInstrutor = instrutorData.nome
        if (cpfInstrutor == undefined)
          cpfInstrutor = instrutorData.cpf
        if (celular == undefined)
          celular = instrutorData.numeroCelular
        if (emailInstrutor == undefined)
          emailInstrutor = instrutorData.email
        if (data == undefined)
          data = instrutorData.dataNascimento
        if (generoInstrutor == undefined)
          generoInstrutor = instrutorData.genero

        break;
      }
    }

    if (idInstrutor == "") {
      res.send('Instrutor não encontrado');
    }

    // const cityRef = db.collection('cities').doc('DC');
    // const res = await cityRef.update({capital: true});



    // atualizando dados necessarios
    const result = await conexao.collection('anne_gym_instrutores').doc(idInstrutor).update(
      {
        nome: nomeInstrutor,
        dataCadastro: new Date(),
        cpf: cpfInstrutor,
        numeroCelular: celular,
        email: emailInstrutor,
        dataNascimento: data,
        genero: generoInstrutor
      }
    );
    res.send('Atualizado com sucesso.')
  });
};