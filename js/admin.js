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
        ticket: 9000,

        newMovie: {//para cuando el admin agregue una nueva pelicula
            title: '',
            release: '',
            duration: '',
            gender: '',
            img: '',
            imgW: '',
            synopsis: '',

        },
        movies: [//remporalmente con datos quemados, mientras se adpta el frontend para la creacion de peliculas por parte del admin
            {
            title: 'Buzz Lightyear',
            release: '14/07/2022',
            duration: '2 hours',
            gender: 'test',
            img: '../img/buzzlLightyearCard.jpg',
            synopsis: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque dolores aliquam facilis, possimus dolore, cum eligendi tempore ipsum consectetur molestias saepe dolorem, unde vero. Quae culpa maiores excepturi nostrum quisquam.',
            imgW: '../img/buzzlLightyear.jpg',
            sala: ''
            },
            {
            title: 'Jurassic World',
            release: '14/07/2022',
            duration: '2 hours',
            gender: 'test',
            img: '../img/jurassincWorldCard.jpg',
            imgW: '../img/jurassincWorld.jpg',
            sala: '',
            synopsis: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque dolores aliquam facilis, possimus dolore, cum eligendi tempore ipsum consectetur molestias saepe dolorem, unde vero. Quae culpa maiores excepturi nostrum quisquam.'
            
        },
            {
            title: 'Minions',
            release: '14/07/2022',
            duration: '2 hours',
            gender: 'test',
            img: '../img/minions2Card.jpg',
            imgW: '../img/minions2.jpg',
            sala: '',
            synopsis: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque dolores aliquam facilis, possimus dolore, cum eligendi tempore ipsum consectetur molestias saepe dolorem, unde vero. Quae culpa maiores excepturi nostrum quisquam.'
            },
            {
            title: 'Thor Amor y Trueno',
            release: '14/07/2022',
            duration: '2 hours',
            gender: 'test',
            img: '../img/thorAmorYTruenoCard.png',
            imgW: '../img/thorAmorYTrueno.jpg',
            sala: '',
            synopsis: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque dolores aliquam facilis, possimus dolore, cum eligendi tempore ipsum consectetur molestias saepe dolorem, unde vero. Quae culpa maiores excepturi nostrum quisquam.'
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
        newCardImg: '',
        newWallpaper: '',
        optionMovie: '',// guarda la opción seleccionada al asignar una pelicula a una sala
        indexRoom: 0,//guarda la posición de la sala para tener la vista de sillas ocupadas en el modal de vista sala
        roomPos: 0,//guarda la posición de la sala para asignarle una pelicula en el modal asignar pelicula
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
                        this.mensaje("Cuenta creada con exito", "success");
                        let btn = document.getElementById('closeAddUser');
                        btn.click();
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

            if(this.newMovie.title == '' || this.newMovie.release == '' || this.newMovie.duration == '' || this.newMovie.gender == '' || this.newMovie.img == '' || this.newMovie.imgW == ''  || this.newMovie.synopsis == '' ){
                this.mensaje('Rellena todos los campos para agregar un pelicula', 'error');
                return
            }
            else{
                this.movies.push({...this.newMovie});
                this.updateLocalStorage();
                this.mensaje('Se agrego correctamente la pelicula', 'succes');
                let btn = document.getElementById('closePeli');
                btn.click();
            }
           
        },
        selectImages(cardImg, wallpaper){//cardImg será para mostrar en el card y wallpaper para el carousel
            this.newMovie.img = cardImg;
            this.newMovie.imgW = wallpaper;
            //al dar click a guardar en el modal peliculas esta información debe guardarse en el array movies
            //para luego recorrer el array y mostrar los cards disponibles y las imagenes del carrusel
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
                    let btn = document.getElementById('closeRoomModal');
                    btn.click();
                    this.mensaje('Sala creada', 'success');
                }else{
                    this.mensaje('La cantidad de sillas debe ser mayor a cero', 'error');
                }
            }else{
                this.mensaje('Ingrese todos los campos', 'error');
            }
        },
        roomIndex(index){
            this.roomPos = index;
        },
        assignMovie(){
            if (this.optionMovie != '') {
                this.rooms[this.roomPos].movie = this.optionMovie.title;
                this.mensaje(`Se ha asignado la pelicula ${this.optionMovie.title} a la sala ${this.rooms[this.roomPos].roomCode}`, 'success');
                this.optionMovie.sala =  this.rooms[this.roomPos].roomCode;
                this.updateLocalStorage();
                let btnClose = document.getElementById('closeAssignMovie');
            btnClose.click();
            }else{
                this.mensaje('Seleccione una pelicula', 'error');
            }
        },
        delRoom(item,index){
            const swalWithBootstrapButtons = Swal.mixin({
                customClass: {
                    confirmButton: 'btn btn-success',
                    cancelButton: 'btn btn-danger'
                },
                buttonsStyling: false
            })       
            swalWithBootstrapButtons.fire({
                title: `¿Está seguro de que desea eliminar la sala ${item.roomCode}?`,
                text: "No podras revertir esto!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, Eliminar',
                cancelButtonText: 'No, Cancelar',
                reverseButtons: true
            }).then((result) => {
                if (result.isConfirmed) {
                    this.rooms.splice(index, 1);
                    this.updateLocalStorage();
                    this.mensaje("La sala fue eliminada", "success");
                } else if (
                    result.dismiss === Swal.DismissReason.cancel
                ) {
                }
            })
        },
<<<<<<< HEAD


        delMovie(item,index){
            const swalWithBootstrapButtons = Swal.mixin({
                customClass: {
                    confirmButton: 'btn btn-success',
                    cancelButton: 'btn btn-danger'
                },
                buttonsStyling: false
            })       
            swalWithBootstrapButtons.fire({
                title: `¿Está seguro de que desea eliminar la pelicula ${item.title}?`,
                text: "No podras revertir esto!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, Eliminar',
                cancelButtonText: 'No, Cancelar',
                reverseButtons: true
            }).then((result) => {
                if (result.isConfirmed) {
                    this.movie.splice(index, 1);
                    this.updateLocalStorage();
                    this.mensaje("La pelicula fue eliminada", "success");
                } else if (
                    result.dismiss === Swal.DismissReason.cancel
                ) {
                }
            })
        },

=======
        showRooms(index){
            this.indexRoom = index;
        },
>>>>>>> dc32f54d074003ebf4895a2a1703e1b0058013c6
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
        delUser(index){
            const swalWithBootstrapButtons = Swal.mixin({
                customClass: {
                    confirmButton: 'btn btn-success',
                    cancelButton: 'btn btn-danger'
                },
                buttonsStyling: false
            })       
            swalWithBootstrapButtons.fire({
                title: '¿Estás seguro de que desea eliminar?',
                text: "No podras revertir esto!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, Eliminar',
                cancelButtonText: 'No, Cancelar',
                reverseButtons: true
            }).then((result) => {
                if (result.isConfirmed) {
                    this.users.splice(index, 1);
                    this.updateLocalStorage();
                    this.mensaje("El usuario fue eliminado", "success");
                } else if (
                    result.dismiss === Swal.DismissReason.cancel
                ) {
                }
            })
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
            localStorage.setItem('movies', JSON.stringify(this.movies));
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
        if (localStorage.getItem('movies') !== null) {
            this.movies = JSON.parse(localStorage.getItem('movies'));
        }else{
            this.movies = this.movies;
        }
    }
});
