function Pegar(){ 
    Nome = document.getElementById("nome").value
    
    Cpf = document.getElementById("cpf").value
     
    Telefone = document.getElementById("telefone").value
    
    Email = document.getElementById("email").value
       
    Estado = document.getElementById("estado").value
       
    Cep = document.getElementById("cep").value
    
    Endereco = document.getElementById("endereco").value
    

    if(Nome == ""){
        alert("Campo nome é obrigatório.")
        nome.classList.add("erro")
        nome.focus()
        return false
    }

    if(Cpf == ""){
        alert("Campo CPF é obrigatório.")
        cpf.classList.add("erro")
        cpf.focus()
        return false
    }

    if(Telefone == ""){
        alert("Campo telefone é obrigatório.")
        telefone.classList.add("erro")
        telefone.focus()
        return false
    }

    if(Email == ""){
        alert("Campo email é obrigatório.")
        email.classList.add("erro")
        email.focus()
        return false
    }

    if(Estado == ""){
        alert("Campo estado é obrigatório.")
        estado.classList.add("erro")
        estado.focus()
        return false
    }

    if(Cep == ""){
        alert("Campo CEP é obrigatório.")
        cep.classList.add("erro")
        cep.focus()
        return false
    }

    if(Endereco == ""){
        alert("Campo endereço é obrigatório.")
        endereco.classList.add("erro")
        endereco.focus()
        return false
    }
return true
}
