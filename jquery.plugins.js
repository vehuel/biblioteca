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
var clsRequisicao = function(Url) {
    if (typeof Url == "undefined") {
        alert("clsRequisicao: Você deve informar o Url para onde as requisições serão feitas ao instanciar essa classe.");
        return false;
    }
    sUrl = Url;
    
    var s = function(par) {
        var oPar =  { url:sUrl, type:'POST' };  // Parametros padrão
        $.extend(oPar, par);                    // Copia/sobrescreve as opções padrão, pelas opções informadas pelo usuário
        $.ajax(oPar);                           // Faz a requisição
    }
        
    this.p = function(sOperacao, oDados, fCallback) {
        // Se foi enviado um objeto como informação, converte o objeto para string
        if (typeof oDados == 'object') oDados = $.param(oDados);

        var oPar = {
            data   :'Operacao=' + sOperacao + (oDados == '' || oDados == 'null' ? '':'&' + oDados),
            success:fCallback
        };

        // Faz o envio dos dados
        s(oPar);
    }
    
    this.g = function() { alert("implementar envio por get quando necessário. :)"); }
    
    this.j = function() { alert("implementar envio por post/json quando necessário. :)"); }
}