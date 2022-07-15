//LOGIC

var app = new Vue({
    el: '#app',
    data: {
        users: [
            {
            name: 'test',
            lastName: 'test1',
            address: 'asdfas',
            phoneNumber: '1234',
            email: 'a@algo.com',
            password: '1234',
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
        user: '',
        code: '',


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
                this.mensaje('Los datos ingresados son incorrectos');
                this.email = '';
                this.password = '';
            }
            else{
                if(this.user.status == 'inactive' ){
                    this.generateCode();

                    //se abre la modal y ese boton redirige a una nueva funcion 'validateCode'

                    this.email = '';
                    this.password = '';
                    return;
                }
                else{

                    const Toast = Swal.mixin({
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 3000,
                        timerProgressBar: true,
                        didOpen: (toast) => {
                          toast.addEventListener('mouseenter', Swal.stopTimer)
                          toast.addEventListener('mouseleave', Swal.resumeTimer)
                        }
                      })
                      
                      Toast.fire({
                        icon: 'success',
                        title: 'Has iniciado sesión correctamente'
                      })

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
                this.mensaje('Ingres el codigo enviado', 'error');
                return;
            
            }
            if(this.code == this.confirmPass){
                this.mensaje('Su cuenta ha sido activada', 'succes');
                this.user.status = 'active'
                const Toast = Swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                      toast.addEventListener('mouseenter', Swal.stopTimer)
                      toast.addEventListener('mouseleave', Swal.resumeTimer)
                    }
                  })
                  
                  Toast.fire({
                    icon: 'success',
                    title: 'Has iniciado sesión correctamente'
                  })

                this.email = '';
                this.password = '';

                setTimeout(function(){     
                    window.location.href = "app.html";
              
                  
                }.bind(this), 3000);
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




    },
});
