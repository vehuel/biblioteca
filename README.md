Biblioteca
==========
Biblioteca particular com códigos que eu uso em alguns projetos dos quais participei.

Quando possível eu adicionarei mais informações aqui sobre cada uma das coisas armazenadas aqui.


Classe clsRequisicao
--------------------
* **Como usar?**  
Supondo que você deseja enviar os dados para o URL: http://www.abc.com/webser.asmx  
```
var fPost = new clsRequisicao("http://www.abc.com/webser.asmx");
```

* **Método P** (P de Post)  
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
**Descrição:** O método P sempre envia os dados via POST mas serializados. Então se você passa como dados o objeto *{Nome:"Victor", Sobrenome:"Santos"}*, ele serializa os dados para *"Nome=Victor&Sobrenome=Santos"* e faz o envio.  

* **Método J** (J de JSON via POST)  
**Parâmetros:** Mesmos do P  
**Exemplo:**
```
fPost.p("Envia", {Nome:"Victor", Sobrenome:"Santos"}, function(Dados) {
    // Resposta do webservice
    console.log(Dados);
}
```
**Descrição:** Alguns webservices em .Net exigem que os dados sejam enviados em formato JSON (Eu não sei dizer agora quais situações são essas) então para isso você deve usar o método J que converte o objeto *{Nome:"Victor", Sobrenome:"Santos"}* que você passou como parâmetro para uma string JSON *"{\"Nome\":\"Victor\", \"Sobrenome\":\"Santos\"}"*. Você vai descobrir quando usar o método J, ao tentar enviar dados para o webservice usando o P e não chegar nada no webservice. Se isso acontecer, troque o P por J e faça o teste novamente.  
Para usar o método J o navegador deve dar suporte ao JSON.stringfy. Se não me falha a memória, nenhum navegador antes do Internet Explorer 9 tem suporte.  
Para resolver isso é molezinha, coloque a linha abaixo na sua página HTML que ele carregará o json2.min.js caso o navegador não dê suporte
```
try { var x = typeof JSON.stringify; } catch(x) { $.getScript("/scripts/json2.min.js"); }
```  
*Não se esqueça de alterar o caminho do script json2.*

* **Para que server o parâmetro *Webservice* do "construtor" da classe?**  
O padrão desse parâmetro (Caso você não informe, como nos exemplos anteriores) é *true*.  
Caso você defina como false ele enviaria, no exemplo abaixo, os seguintes dados: *Operacao=Envia&Nome=Victor*
```
var fPost = new clsRequisicao("http://www.abc.com/webser.ashx")
fPost.p("Envia", "Nome=Victor", function(Dados) { });
```
Perceba que ele adicionou um parâmetro extra chamado *Operacao*. No ashx basta você dar o tratamento adequado.
