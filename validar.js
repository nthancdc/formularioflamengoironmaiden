// validar.js

// Função que roda quando a página termina de carregar
window.onload = function() {
    // Configura as máscaras para os campos
    configurarMascaras();
    
    // Configura os eventos dos botões
    configurarBotoes();
};

// Configura as máscaras para CPF, telefone e CEP
function configurarMascaras() {
    // Máscara para CPF (formato: 000.000.000-00)
    document.getElementById('cpf').addEventListener('input', function() {
        // Remove tudo que não é número
        let valor = this.value.replace(/\D/g, '');
        
        // Aplica a formatação
        if (valor.length > 3) valor = valor.replace(/^(\d{3})/, '$1.');
        if (valor.length > 7) valor = valor.replace(/^(\d{3})\.(\d{3})/, '$1.$2.');
        if (valor.length > 11) valor = valor.replace(/^(\d{3})\.(\d{3})\.(\d{3})/, '$1.$2.$3-');
        
        // Limita o tamanho
        valor = valor.substring(0, 14);
        this.value = valor;
    });

    // Máscara para telefone (formato: (00) 00000-0000)
    document.getElementById('telefone').addEventListener('input', function() {
        // Remove tudo que não é número
        let valor = this.value.replace(/\D/g, '');
        
        // Aplica a formatação
        if (valor.length > 0) valor = valor.replace(/^(\d{0,2})/, '($1');
        if (valor.length > 3) valor = valor.replace(/^\((\d{2})/, '($1) ');
        if (valor.length > 10) valor = valor.replace(/^\((\d{2})\)\s(\d{5})/, '($1) $2-');
        
        // Limita o tamanho
        valor = valor.substring(0, 15);
        this.value = valor;
    });

    // Máscara para CEP (formato: 00000-000)
    document.getElementById('cep').addEventListener('input', function() {
        // Remove tudo que não é número
        let valor = this.value.replace(/\D/g, '');
        
        // Aplica a formatação
        if (valor.length > 5) valor = valor.replace(/^(\d{5})/, '$1-');
        
        // Limita o tamanho
        valor = valor.substring(0, 9);
        this.value = valor;
        
        // Quando o campo perde o foco, busca o endereço se o CEP estiver completo
        this.addEventListener('blur', function() {
            if (this.value.replace(/\D/g, '').length === 8) {
                buscarEndereco(this.value.replace(/\D/g, ''));
            }
        });
    });
}

// Configura os eventos dos botões do formulário
function configurarBotoes() {
    // Botão Salvar - valida e envia o formulário
    document.querySelector('.buttons button:nth-child(1)').addEventListener('click', function(e) {
        e.preventDefault(); // Evita o comportamento padrão do formulário
        salvarFormulario();
    });
    
    // Botão Excluir - limpa todos os campos
    document.querySelector('.buttons button:nth-child(2)').addEventListener('click', function(e) {
        e.preventDefault(); // Evita o comportamento padrão do formulário
        limparFormulario();
    });
    
    // Botão Alterar - permite editar dados existentes
    document.querySelector('.buttons button:nth-child(3)').addEventListener('click', function(e) {
        e.preventDefault(); // Evita o comportamento padrão do formulário
        alterarFormulario();
    });
}

// Função chamada quando o formulário é submetido
function Pegar() {
    return validarFormulario();
}

// Valida todos os campos do formulário
function validarFormulario() {
    // Remove a classe 'erro' de todos os campos
    document.querySelectorAll('input, select').forEach(function(campo) {
        campo.classList.remove('erro');
    });

    // Variável para controlar se o formulário é válido
    let formularioValido = true;

    // Validação do Nome (não pode estar vazio)
    const nome = document.getElementById('nome');
    if (nome.value.trim() === '') {
        nome.classList.add('erro');
        formularioValido = false;
    }

    // Validação do CPF (deve ter 11 dígitos e ser válido)
    const cpf = document.getElementById('cpf');
    const cpfNumeros = cpf.value.replace(/\D/g, '');
    if (cpfNumeros.length !== 11 || !validarCPF(cpfNumeros)) {
        cpf.classList.add('erro');
        formularioValido = false;
    }

    // Validação do Telefone (deve ter 10 ou 11 dígitos)
    const telefone = document.getElementById('telefone');
    const telefoneNumeros = telefone.value.replace(/\D/g, '');
    if (telefoneNumeros.length < 10 || telefoneNumeros.length > 11) {
        telefone.classList.add('erro');
        formularioValido = false;
    }

    // Validação do Email (deve ter formato válido)
    const email = document.getElementById('email');
    if (!validarEmail(email.value)) {
        email.classList.add('erro');
        formularioValido = false;
    }

    // Validação do Estado (deve estar selecionado)
    const estado = document.getElementById('estado');
    if (estado.value === '') {
        estado.classList.add('erro');
        formularioValido = false;
    }

    // Validação do CEP (deve ter 8 dígitos)
    const cep = document.getElementById('cep');
    const cepNumeros = cep.value.replace(/\D/g, '');
    if (cepNumeros.length !== 8) {
        cep.classList.add('erro');
        formularioValido = false;
    }

    // Validação do Endereço (não pode estar vazio)
    const endereco = document.getElementById('endereco');
    if (endereco.value.trim() === '') {
        endereco.classList.add('erro');
        formularioValido = false;
    }

    // Se o formulário não for válido, mostra mensagem de erro
    if (!formularioValido) {
        alert('Por favor, corrija os campos destacados em vermelho!');
        return false;
    }

    return true;
}

// Função para validar CPF usando algoritmo oficial
function validarCPF(cpf) {
    // Verifica se todos os dígitos são iguais (ex: 111.111.111-11)
    if (/^(\d)\1{10}$/.test(cpf)) return false;

    // Calcula o primeiro dígito verificador
    let soma = 0;
    for (let i = 0; i < 9; i++) {
        soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(9))) return false;

    // Calcula o segundo dígito verificador
    soma = 0;
    for (let i = 0; i < 10; i++) {
        soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(10))) return false;

    return true;
}

// Função para validar email com expressão regular simples
function validarEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Busca endereço usando a API ViaCEP
function buscarEndereco(cep) {
    // Mostra mensagem de carregamento
    const endereco = document.getElementById('endereco');
    endereco.value = 'Buscando endereço...';
    
    // Faz requisição para a API ViaCEP
    fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then(function(resposta) {
            // Converte a resposta para JSON
            return resposta.json();
        })
        .then(function(dados) {
            // Se não encontrar o CEP, mostra mensagem de erro
            if (dados.erro) {
                endereco.value = '';
                alert('CEP não encontrado!');
                return;
            }
            
            // Preenche o campo de endereço com os dados retornados
            endereco.value = [
                dados.logradouro || '',
                dados.bairro || '',
                dados.localidade || '',
                dados.uf || ''
            ].filter(Boolean).join(', ');
        })
        .catch(function() {
            // Em caso de erro na requisição, mostra mensagem
            endereco.value = '';
            alert('Erro ao buscar CEP. Tente novamente mais tarde.');
        });
}

// Função para salvar o formulário (envia os dados)
function salvarFormulario() {
    // Primeiro valida o formulário
    if (!validarFormulario()) return;
    
    // Coleta todos os dados do formulário
    const formData = {
        nome: document.getElementById('nome').value,
        cpf: document.getElementById('cpf').value,
        telefone: document.getElementById('telefone').value,
        email: document.getElementById('email').value,
        estado: document.getElementById('estado').value,
        cep: document.getElementById('cep').value,
        endereco: document.getElementById('endereco').value
    };
    
    // Simulação de envio para um servidor (substitua pela sua API real)
    console.log('Dados a serem enviados:', formData);
    
    // Aqui você substituiria pelo fetch real para seu backend
    // Exemplo com fetch (descomente e ajuste a URL):
    /*
    fetch('https://sua-api.com/formulario', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        alert('Formulário enviado com sucesso!');
        console.log('Resposta do servidor:', data);
    })
    .catch(error => {
        alert('Erro ao enviar formulário. Tente novamente.');
        console.error('Erro:', error);
    });
    */
    
    // Mostra mensagem de sucesso (simulada)
    alert('Formulário salvo com sucesso!\n\n' + 
          `Nome: ${formData.nome}\n` +
          `CPF: ${formData.cpf}\n` +
          `Telefone: ${formData.telefone}\n` +
          `Email: ${formData.email}\n` +
          `Estado: ${formData.estado}\n` +
          `CEP: ${formData.cep}\n` +
          `Endereço: ${formData.endereco}`);
    
    // Limpa o formulário após o envio
    limparFormulario();
}

// Função para limpar todos os campos do formulário
function limparFormulario() {
    // Pede confirmação antes de limpar
    if (!confirm('Tem certeza que deseja limpar todos os campos?')) return;
    
    // Reseta o formulário
    document.getElementById('formulario').reset();
    
    // Remove todas as classes de erro
    document.querySelectorAll('input, select').forEach(function(campo) {
        campo.classList.remove('erro');
    });
}

// Função para alterar dados (simulação)
function alterarFormulario() {
    // Primeiro valida o formulário
    if (!validarFormulario()) return;
    
    // Simulação de alteração de dados
    alert('Dados alterados com sucesso!');
    
    // Na implementação real, aqui você faria uma requisição para atualizar os dados no servidor
}
