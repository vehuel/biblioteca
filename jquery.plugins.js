(function ($) {
    $.fn.serializeJSON = function () {
        var json = {};
        jQuery.map($(this).serializeArray(), function (n, i) {
            json[n['name']] = n['value'];
        });
        return json;
    };
})(jQuery);

// Loga as mensagens do sistema usando o console.log (se disponível)
(function ($) {
    $.fn.log = function (strMsg) {
        if (typeof console == "object") if (typeof console.log == "function") console.log(strMsg);
		return true;
    };
})(jQuery);

// Por Victor Santos (Atualizado 08/2012)
// Carrega scripts (.js) sequencialmente
(function ($) {
    $.fn.carregaScripts = function (arrArquivos, fncCallback) {
        // Pega a lista de scripts carregados anteriormente. Essa rotina é falha
        // já que compara todo o caminho do arquivo então se você informar o mesmo
        // arquivo colocando um path diferente ele irá carregar novamente.
        // Ex.: /abc/script.js
        //      /abc/../abc/script.js
        // As 2 situações acima apontam para o mesmo lugar e são válidas então o script
        // será carregado 2 vezes. :)
        var aCarregados = $('body').data('carregaScripts');
        if (typeof aCarregados == 'undefined') aCarregados = [];
        
        // Carrega os scripts sequencialmente
		var iJs = -1;
		
		var loadJs = function() {
		    iJs++;
			if (iJs < arrArquivos.length) {
			    // Verifica se o arquivo já não foi carregado
			    if ($.inArray(arrArquivos[iJs], aCarregados) == -1) { // Não foi carregado
				    $().log('Carregando ' + arrArquivos[iJs]);
				    if (arrArquivos[iJs].split('.').pop().toLowerCase() == 'css') {
				        if (document.createStyleSheet) // Internet Explorer
				            document.createStyleSheet(arrArquivos[iJs]);
				        else // Outros navegadores
				            $("<link/>", {
                                rel :"stylesheet", type:"text/css", href:arrArquivos[iJs]
                            }).appendTo("head");

                        // Adiciona o arquivo carregado no array para evitar que seja carregado novamente no futuro
			            aCarregados.push(arrArquivos[iJs]);
			            // Chama a função novamente para carregar os outros scripts
			            loadJs();
				    } else {
				        $.getScript(arrArquivos[iJs], function() {
				            // Adiciona o arquivo carregado no array para evitar que seja carregado novamente no futuro
				            aCarregados.push(arrArquivos[iJs]);
				            // Chama a função novamente para carregar os outros scripts
				            loadJs();
				        });
				    }
				} else // Foi carregado
				    loadJs();
			} else {
			    // Armazena os scripts carregados usando o jQuery.data
			    $('body').data('carregaScripts', aCarregados);
				
				// Se existir um callback e for válido, executa
				if (typeof fncCallback == "function") fncCallback();
			}
		}
		
		loadJs();
		return true;
    };
})(jQuery);

// Classe para fazer as requisições ajax de forma personalizada e economizar código
var clsRequisicao = function(Url, Webservice) {
    if (typeof Url == "undefined") {
        alert("clsRequisicao: Você deve informar o Url para onde as requisições serão feitas ao instanciar essa classe.");
        return false;
    }
    // Coloca a / no final se não existir
    var sUrl = Url + (Url.slice(-1) != '/' ? '/':'');
    
    var bWeb = true; if (typeof Webservice != "undefined") bWeb = Webservice;
    
    // s de send. :) Faz a requisição ajax
    var s = function(par, op) {
        var oPar =  { url:sUrl + (bWeb ? op:''), type:'POST' };  // Parametros padrão
        if (!bWeb) par.data = 'Operacao=' + op + (par.data == '' ? '':'&') + par.data;
        $.extend(oPar, par);                    // Copia/sobrescreve as opções padrão, pelas opções informadas pelo usuário
        $.ajax(oPar);                           // Faz a requisição
    }

    // p de post. :) Prepara a requisição com os dados a serem enviados, etc e passa tudo para 's' que faz a requisição.
    this.p = function(Operacao, Dados, Callback) {
        if (typeof Operacao == 'undefined') { alert("clsRequisicao P: Operação/Método inválido."); return false; }
        if (typeof Callback != 'function') { alert("clsRequisicao P: Callback informado não é valido."); return false; }
        // Se foi enviado um objeto como informação, converte o objeto para string
        if (typeof Dados == 'object') Dados = $.param(Dados);

        var oPar = {
            data   :(Dados == null || Dados == 'null' ? '':Dados),
            success:Callback
        };

        // Faz o envio dos dados
        s(oPar, Operacao);
    }
    
    // g de get. :) Ao invés de passar os parâmetros por POST usa GET no lugar. Simples assim.
    this.g = function() { alert("implementar envio por get quando necessário. :)"); }
    
    // j de json. :) Os dados são enviados por POST mas são 'preparados' de uma maneira diferente que não é a forma
    // padrão onde eles são serializados. Acredite em mim, isso as vezes é necessário em webservice .Net e não tem
    // como correr.
    this.j = function(Operacao, Dados, Callback) {
        // Não é JSON? Então só aceita os dados na forma de objeto
        if (typeof Dados != 'object') { alert("clsRequisicao J: Dados no formato inválido."); return false; }
        if (typeof Operacao == 'undefined') { alert("clsRequisicao J: Operação/Método inválido."); return false; }
        if (typeof Callback != 'function') { alert("clsRequisicao J: Callback informado não é valido."); return false; }
        
        var oPar = {
            data   :JSON.stringify(Dados),
            success:Callback,
            contentType:"application/json"
        };

        // Faz o envio dos dados
        s(oPar, Operacao);
    }
}
