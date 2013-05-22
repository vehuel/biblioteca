Biblioteca
==========
Biblioteca particular com códigos que eu uso em alguns projetos dos quais participei.

Quando possível eu adicionarei mais informações aqui sobre cada uma das coisas armazenadas aqui.


Classe clsRequisicao
--------------------
**Como usar?**  
Supondo que você deseja enviar os dados para o URL: http://www.abc.com/webser.asmx  
```
var fPost = new clsRequisicao("http://www.abc.com/webser.asmx");
```

**Método P** (P de Post)  
**Parâmetros:** ("Método do Webservice", "Dados em formato string ou objeto", "Função de callback que receberá o retorno do Webservice")  
**Exemplo:**
```
fPost.p("Envia", "Nome=Victor&Sobrenome=Santos", function(Dados) {
    // Resposta do webservice
    console.log(Dados);
}
```
ou passando os dados em formato de objeto
```
fPost.p("Envia", {Nome:"Victor", Sobrenome:"Santos"}, function(Dados) {
    // Resposta do webservice
    console.log(Dados);
}
```
