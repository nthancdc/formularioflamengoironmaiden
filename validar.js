
// Variável para controle do CEP
let cepValido = false;

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    // Configura máscaras
    configurarMascaras();
    
    // Evento de submit
    document.getElementById('formulario').addEventListener('submit', function(e) {
        e.preventDefault();
        if (validarFormulario()) {
            alert('Formulário enviado com sucesso!');
            this.reset();
            cepValido = false;
        }
    });
});

// Configura todas as máscaras
function configurarMascaras() {
    // CPF: 000.000.000-00
    document.getElementById('cpf').addEventListener('input', function(e) {
        e.target.value = e.target.value
            .replace(/\D/g, '')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
            .substring(0, 14);
    });

    // RG: 00.000.000-0
    document.getElementById('rg').addEventListener('input', function(e) {
        e.target.value = e.target.value
            .replace(/\D/g, '')
            .replace(/(\d{2})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1})$/, '$1-$2')
            .substring(0, 12);
    });

    // CNPJ: 00.000.000/0000-00
    document.getElementById('cnpj').addEventListener('input', function(e) {
        e.target.value = e.target.value
            .replace(/\D/g, '')
            .replace(/(\d{2})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1/$2')
            .replace(/(\d{4})(\d)/, '$1-$2')
            .substring(0, 18);
    });

    // Telefone: (00) 00000-0000
    document.getElementById('telefone').addEventListener('input', function(e) {
        e.target.value = e.target.value
            .replace(/\D/g, '')
            .replace(/^(\d{2})(\d)/, '($1) $2')
            .replace(/(\d{5})(\d)/, '$1-$2')
            .substring(0, 15);
    });

    // CEP: 00000-000
    document.getElementById('cep').addEventListener('input', function(e) {
        cepValido = false;
        e.target.value = e.target.value
            .replace(/\D/g, '')
            .replace(/^(\d{5})(\d)/, '$1-$2')
            .substring(0, 9);
    });

    // Cartão: 0000 0000 0000 0000
    document.getElementById('cartao').addEventListener('input', function(e) {
        e.target.value = e.target.value
            .replace(/\D/g, '')
            .replace(/(\d{4})(\d)/, '$1 $2')
            .replace(/(\d{4}) (\d{4})(\d)/, '$1 $2 $3')
            .replace(/(\d{4}) (\d{4}) (\d{4})(\d)/, '$1 $2 $3 $4')
            .substring(0, 19);
    });

    // Validade: MM/AA
    document.getElementById('validade').addEventListener('input', function(e) {
        e.target.value = e.target.value
            .replace(/\D/g, '')
            .replace(/^(\d{2})(\d)/, '$1/$2')
            .substring(0, 5);
    });

    // CVV: 000
    document.getElementById('cvv').addEventListener('input', function(e) {
        e.target.value = e.target.value
            .replace(/\D/g, '')
            .substring(0, 3);
    });

    // Busca CEP ao sair do campo
    document.getElementById('cep').addEventListener('blur', buscarEndereco);
}

// Validação principal
function validarFormulario() {
    let valido = true;
    limparErros();

    // Campos obrigatórios
    const camposObrigatorios = [
        'nome', 'cpf', 'rg', 'telefone', 
        'email', 'estado', 'cep', 'endereco'
    ];

    camposObrigatorios.forEach(id => {
        const campo = document.getElementById(id);
        if (!campo.value.trim()) {
            campo.classList.add('erro');
            valido = false;
        }
    });

    // Validações específicas
    if (!validarCPF(document.getElementById('cpf').value.replace(/\D/g, ''))) {
        document.getElementById('cpf').classList.add('erro');
        valido = false;
    }

    // Valida CEP
    const cep = document.getElementById('cep').value.replace(/\D/g, '');
    if (cep.length !== 8 || !cepValido) {
        document.getElementById('cep').classList.add('erro');
        valido = false;
    }

    // Valida cartão apenas se preenchido
    const cartao = document.getElementById('cartao').value.replace(/\s/g, '');
    if (cartao && !validarCartao(cartao)) {
        document.getElementById('cartao').classList.add('erro');
        valido = false;
    }

    if (!valido) {
        alert('Por favor, corrija os campos destacados!');
        document.querySelector('.erro').focus();
    }

    return valido;
}

// Busca de endereço por CEP
async function buscarEndereco() {
    const cep = document.getElementById('cep').value.replace(/\D/g, '');
    if (cep.length !== 8) return;

    const endereco = document.getElementById('endereco');
    endereco.disabled = true;
    endereco.value = 'Buscando endereço...';
    cepValido = false;

    try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        
        if (!response.ok) throw new Error('CEP não encontrado');
        
        const data = await response.json();
        
        if (data.erro) throw new Error('CEP não encontrado');
        
        endereco.value = [
            data.logradouro,
            data.bairro,
            data.localidade,
            data.uf
        ].filter(Boolean).join(', ');
        
        cepValido = true;
    } catch (error) {
        alert('CEP inválido! Verifique o número.');
        endereco.value = '';
    } finally {
        endereco.disabled = false;
    }
}

// Validação de CPF
function validarCPF(cpf) {
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
    
    let soma = 0;
    for (let i = 0; i < 9; i++) soma += parseInt(cpf[i]) * (10 - i);
    let resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf[9])) return false;
    
    soma = 0;
    for (let i = 0; i < 10; i++) soma += parseInt(cpf[i]) * (11 - i);
    resto = (soma * 10) % 11;
    return (resto === 10 ? 0 : resto) === parseInt(cpf[10]);
}

// Validação de Cartão (Luhn)
function validarCartao(numero) {
    let soma = 0;
    let dobrar = false;
    
    for (let i = numero.length - 1; i >= 0; i--) {
        let digito = parseInt(numero[i]);
        if (dobrar) {
            digito *= 2;
            if (digito > 9) digito -= 9;
        }
        soma += digito;
        dobrar = !dobrar;
    }
    
    return soma % 10 === 0;
}

// Limpeza de erros
function limparErros() {
    document.querySelectorAll('.erro').forEach(el => {
        el.classList.remove('erro');
    });
}

// Limpar formulário
function limparFormulario() {
    if (confirm('Tem certeza que deseja limpar todos os campos?')) {
        document.getElementById('formulario').reset();
        limparErros();
        cepValido = false;
    }
}
