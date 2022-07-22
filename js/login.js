//LOGIC
var app = new Vue({
    el: '#login',
    data: {
        users: [
            {
                id: 1,
                name: 'Anonymous',
                lastName: 'Zero',
                address: '000-000',
                phoneNumber: '1234567890',
                email: 'cinema.prueba.semillero@gmail.com',
                password: '1234',
                role: 'superAdmin',
                status: 'inactive',
            },
        ],
        newUser: {
            name: '',
            lastName: '',
            address: '',
            phoneNumber: '',
            email: '',
            password: '',
            role: 'user',
            status: 'inactive',
        },

        confirmPass: '',//para el input de confirmación de contraseña
        email: '',
        password: '',
        user: null,
        code: '',
        confirmCode: '',
        genCode: '',
        startTimer: '',
        seconds: 0,
        minutes: 5,
        _email: '',
        
    },
    methods: {//metodos a trabajar en el proyecto -- VARIABLES EN camelCase
        addUser(){
            if (
                this.newUser.name.length > 0 && this.newUser.lastName.length > 0 
                && this.newUser.address.length > 0 && this.newUser.phoneNumber.length > 0 &&
                this.newUser.email.length > 0 && this.newUser.password.length > 0
                ) {
                    if (this.confirmPass === this.newUser.password) {
                        this.newUser.id =  this.users.length + 1;
                        this.users.push({
                            ...this.newUser
                        });
                        this.clearFields();
                        this.verifEmail();
                        let closeReg = document.getElementById('closeUserReg');
                        closeReg.click();
                        this.mensaje("Su cuenta ha sido creada, un código de valicación fue enviado a su correo", "success");
                        this.updateLocalStorage();
                    }else{
                        this.mensaje("La contraseña ingresada y la confirmación no coinciden", "error");
                    }
                
            }else{
                this.mensaje("Por favor rellene todos los campos", "error");
            }
        },
        clearFields(){//limpiará los campos del formulario de registro de usuarios al crear la cuenta
            this.newUser = {
                id: this.users.length + 1,
                name: '',
                lastName: '',
                address: '',
                phoneNumber: '',
                email: '',
                password: '',
                status: 'inactive',
            }
            this.confirmPass = '';
        },
        
        login(){

            if(this.email == '' || this.password == ''){
                this.mensaje('Ingrese todos los campos', 'error');
                return;
            }

            this.users.forEach(user => {

                if(this.email == user.email && this.password == user.password){
                    this.user = user;
                    this.updateLocalStorage();
                }
                
            });

            if(this.user == ''){
                this.mensaje('Los datos ingresados son incorrectos', 'error');
                this.email = '';
                this.password = '';
            }
            else{
                if(this.user.status == 'inactive' ){

                    const genCode2 = () => {
                        this.generateCode();
                    }

                    const myTimer = () => {
                        this.timer();
                    }

                    this.generateCode();

                    this.genCode = setInterval(genCode2, 300000);
                    this.startTimer = setInterval(myTimer, 1000);
                

                    //se abre la modal y ese boton redirige a una nueva funcion 'validateCode'
                    btn = document.getElementById('code');
                    btn.click();
                    this.email = '';
                    this.password = '';
                
                }
                else{

                    this.mensaje('Ha iniciado sesión correctamente', 'success');
                    this.email = '';
                    this.password = '';
                    setTimeout(function(){     
                        window.location.href = "app.html";
                    
                    }.bind(this), 3000);

                }
            }

        },
        
        timer(){
            
            if(this.seconds != 0){
                this.seconds -= 1;
            }else{
                this.minutes -= 1;
                this.seconds = 59;
            }
        },
        validateCode(){

            if(this.code == ''){
                this.mensaje('Ingrese el codigo enviado', 'error');
                return;
            
            }
            if(this.code == this.confirmCode){
                clearInterval(this.genCode);
                clearInterval(this.startTimer);
                this.startTimer = '',
                this.mensaje('Su cuenta ha sido activada', 'succes');
                this.user.status = 'active';
                this.updateLocalStorage();

                this.email = '';
                this.password = '';
                setTimeout(function(){     
                    window.location.href = "app.html";
                
                }.bind(this), 3000);
            }
            else{
                this.mensaje('El codigo es incorrecto', 'error');
                return;
            }
        },

        generateCode(){
            let x = '';
                    for(let i = 0; i < 6; i++){
                        let r = Math.floor(Math.random()* 9);
                        x += r;
                    }
                    this.code = x;
                    this.sendEmail();
                    console.log(this.code);
        },
        async sendEmail(){
            if (this.code !== '') {
                this._email = {
                    msg: `Su código de vericación es: ${this.code}` //se demora apox 4 min en llegar al correo
                }//NOTA: requiere validar el primer mensaje activando la recepción de correos con el primer correo recibido
            }else{
                this._email = {
                    msg: `Correo de verificación`
                }
            }
            if (this.email !== '') {
                const index = this.users.findIndex((e) => {
                    return e.email == this.email;
                });
                await fetch(`https://formsubmit.co/${this.users[index].email}`, {
                method: "POST",
                body: JSON.stringify(this._email),
                headers: {"Content-type": "application/json; charset=UTF-8"}
                })
                    .then(response => response.json()) 
                    .then(json => console.log(json))
                    .catch(err => console.log(err));
            }
        },
        async verifEmail(){
            await fetch(`https://formsubmit.co/${this.users[this.users.length - 1].email}`, {
                    method: "POST",
                    body: JSON.stringify(this._email),
                    headers: {"Content-type": "application/json; charset=UTF-8"}
                    })
                    .then(response => response.json()) 
                    .then(json => console.log(json))
                    .catch(err => console.log(err));
        },
        mensaje: function (msj, icono) {//para enviar alerts de sweet alert
            const Toast = Swal.mixin({
                toast: true,
                position: 'top-center',
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer)
                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
            })
            Toast.fire({
                icon: icono,
                title: msj
            })
        },
        updateLocalStorage(){
            localStorage.setItem('users', JSON.stringify(this.users));
            localStorage.setItem('user', JSON.stringify(this.user));
        },

    },
    created(){
        if (localStorage.getItem('users') !== null) {
            this.users = JSON.parse(localStorage.getItem('users'));
        }else{
            this.users = this.users;
            this.updateLocalStorage();
        }

        if (localStorage.getItem('user') !== null) {
            this.user = JSON.parse(localStorage.getItem('user'));
        }else{
            this.user = '';
        }
        
    }
});
