//LOGIC

var app = new Vue({
    el: '#app',
    data: {
        users: [
            {
                name: 'Anonymous',
                lastName: 'Zero',
                address: '000-000',
                phoneNumber: '000-000',
                email: 'admin@algo.com',
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
        newMovie: {//para cuando el admin agregue una nueva pelicula
            title: '',
            release: '',
            duration: '',
            gender: '',
            img: ''
        },
        movies: [//remporalmente con datos quemados, mientras se adpta el frontend para la creacion de peliculas por parte del admin
            {
            title: 'Buzz Lightyear',
            release: '14/07/2022',
            duration: '2 hours',
            gender: 'test',
            img: '../img/buzzlLightyearCard.jpg'
            },
            {
            title: 'Jurassic World',
            release: '14/07/2022',
            duration: '2 hours',
            gender: 'test',
            img: '../img/jurassincWorldCard.jpg'
            },
            {
            title: 'Minions',
            release: '14/07/2022',
            duration: '2 hours',
            gender: 'test',
            img: '../img/minions2Card.jpg'
            },
            {
            title: 'Thor Amor y Trueno',
            release: '14/07/2022',
            duration: '2 hours',
            gender: 'test',
            img: '../img/thorAmorYTruenoCard.png'
            }
        ],
        confirmPass: '',//para el input de confirmación de contraseña
        email: '',
        password: '',
        user: '',
        code: '',
        confirmCode: '',
        genCode: '',

    },
    methods: {//metodos a trabajar en el proyecto -- VARIABLES EN camelCase
        addUser(){
            if (
                this.newUser.name.length > 0 && this.newUser.lastName.length > 0 
                && this.newUser.address.length > 0 && this.newUser.phoneNumber.length > 0 &&
                this.newUser.email.length > 0 && this.newUser.password.length > 0
                ) {
                    if (this.confirmPass === this.newUser.password) {
                        this.users.push({
                            ...this.newUser
                        });
                        this.clearFields();
                        //this.updateLocalStorage();
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
                name: '',
                lastName: '',
                address: '',
                phoneNumber: '',
                email: '',
                password: '',
                status: 'inactive',
            }
            this.confirmpass = '';
        },
        addMovie(){//agrega la nueva pelicula en el arreglo de peliculas disponibles (movies)
            //FALTA VALIDAR CON LOS CAMPOS DEL FRONTEND
            this.movies.push({...this.newMovie});
        },
        login(){

            if(this.email == '' || this.password == ''){
                this.mensaje('Ingrese todos los campos', 'error');
                return;
            }

            this.users.forEach(user => {

                if(this.email == user.email && this.password == user.password){
                    this.user = user;
                }
                
            });

            if(this.user == ''){
                this.mensaje('Los datos ingresados son incorrectos', 'error');
                this.email = '';
                this.password = '';
            }
            else{
                if(this.user.status == 'inactive' ){

                    this.genCode = setInterval(this.generateCode(), 5000);
                    const genCode2 = () => {
                        this.generateCode()
                    }
                    const myInterval = setInterval(genCode2, 5000);
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

        validateCode(){

            if(this.code == ''){
                this.mensaje('Ingrese el codigo enviado', 'error');
                return;
            
            }
            if(this.code == this.confirmCode){
                clearInterval(this.genCode);
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
                    console.log(this.code);
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
        }
        if (localStorage.getItem('user') !== null) {
            this.user = JSON.parse(localStorage.getItem('user'));
        }else{
            this.user = '';
        }
    }
});
