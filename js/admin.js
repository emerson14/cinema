//LOGIC

var app = new Vue({
    el: '#admin',
    data: {
        users: [ ],
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
        rooms: [
            {roomCode: 'A1', chairs: [
            { number: 1, status: 'available' },
            { number: 2, status: 'available' },
            { number: 3, status: 'available' }, 
            { number: 4, status: 'available' }
        ], amountChairs: 4, movie: 'testMovie1'},
            {roomCode: 'A2', chairs: [
            { number: 1, status: 'available' },
            { number: 2, status: 'available' },
            { number: 3, status: 'available' }, 
            { number: 4, status: 'available' }
        ], amountChairs: 4, movie: 'testMovie2'}
        ],
        newRoom: {
            roomCode: '', chairs: [], amountChairs: 0, movie: '',
        },
        user: null,
        confirmPass: '',
        user2: {
            name: '',
            lastName: '',
            address: '',
            phoneNumber: '',
            email: '',
            password: '',
            role: '',
        },
        
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
        addMovie(){//agrega la nueva pelicula en el arreglo de peliculas disponibles (movies)
            //FALTA VALIDAR CON LOS CAMPOS DEL FRONTEND
            this.movies.push({...this.newMovie});
        },
        addRoom(){
            if(this.newRoom.roomCode.length && this.newRoom.amountChairs > 0) {
                this.rooms.push({...this.newRoom});
                this.rooms[this.rooms.length - 1].roomCode = this.rooms[this.rooms.length - 1].roomCode.toUpperCase();
                if(this.newRoom.amountChairs > 0){
                    for (let i = 1; i <= this.newRoom.amountChairs; i++) {
                        this.rooms[this.rooms.length - 1].chairs.push({number: i, status: 'available'});
                    }
                    this.newRoom.roomCode = '';
                    this.newRoom.amountChairs = 0;
                    this.updateLocalStorage();
                    this.mensaje('Sala creada', 'success');
                }else{
                    this.mensaje('La cantidad de sillas debe ser mayor a cero', 'error');
                }
            }else{
                this.mensaje('Ingrese todos los campos', 'error');
            }
        },
        logout(){
            const swalWithBootstrapButtons = Swal.mixin({
                customClass: {
                    confirmButton: 'btn btn-success',
                    cancelButton: 'btn btn-danger'
                },
                buttonsStyling: false
            })       
            swalWithBootstrapButtons.fire({
                title: '¿Seguro que desea cerrar sesión?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, cerrar sesión',
                cancelButtonText: 'Cancelar',
                reverseButtons: true
            }).then((result) => {
                if (result.isConfirmed) {
                    this.user = null;
                    localStorage.removeItem("user");
                    this.mensaje("Se ha cerrado la sesión", "success");
                    setTimeout(function(){ location.href = "login.html" }, 1500);
                } else if (
                    result.dismiss === Swal.DismissReason.cancel
                ) {
                }
            })
        },

        loadUser(user){
            
            this.user2.id = user.id;
            this.user2.name = user.name;
            this.user2.lastName = user.lastName;
            this.user2.address = user.address;
            this.user2.phoneNumber = user.phoneNumber;
            this.user2.email = user.email;
            this.user2.role = user.role;

        },

        editUser(){
            
            console.log('edittt');
            this.users.forEach(user => {
                if(this.user2.id == user.id){
                    user.name = this.user2.name;
                    user.lastName = this.user2.lastName;
                    user.address = this.user2.address;
                    user.phoneNumber = this.user2.phoneNumber;
                    user.email = this.user2.email;
                    user.role = this.user2.role;
                }
                }
                
            );

            this.updateLocalStorage();

           
            // this.user2.name = '';
            // this.user2.lastName = '';
            // this.user2.address = '';
            // this.user2.phoneNumber = '';
            // this.user2.email ='';
            // this.user2.role = '';

            let btn = document.getElementById('closeEdit');
            btn.click();


            this.mensaje('El usuario ha sido modificado correctamente', 'succes');
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
            localStorage.setItem('rooms', JSON.stringify(this.rooms));
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
            this.users.forEach(element => {
                if(element.id == this.user.id){
                  this.user = element;
                  console.log("hola");
                }  
              });
        }else{
            this.user = '';
            this.mensaje('No hay ningun usuario registrado, por favor ingresa sesion', 'error');
            window.location.href = "login.html";

        }

        if (localStorage.getItem('rooms') !== null) {
            this.rooms = JSON.parse(localStorage.getItem('rooms'));
        }else{
            this.rooms = this.rooms;
        }
    }
});
