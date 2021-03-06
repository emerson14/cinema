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
        rooms: [
            {roomCode: 'A1', chairs: [
            { number: 1, status: 'available' },
            { number: 2, status: 'available' },
            { number: 3, status: 'available' }, 
            { number: 4, status: 'available' }
        ],},
            {roomCode: 'A2', chairs: [
            { number: 1, status: 'available' },
            { number: 2, status: 'available' },
            { number: 3, status: 'available' }, 
            { number: 4, status: 'available' }
        ],}
        ],
        newRoom: {
            roomCode: '', chairs: [], amountChairs: 0,
        },
        confirmPass: '',//para el input de confirmaci??n de contrase??a
        email: '',
        password: '',
        user: '',
        code: '',
        confirmCode: '',
        genCode: '',
        startTimer: '',
        seconds: 30,
        option: '',
        rpos: 0,
        openPayment: false,
        nTickets: 0,
        pMethod: '',
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
                        this.mensaje("Su cuenta ha sido creada, un c??digo de valicaci??n fue enviado a su correo", "success");
                        this.updateLocalStorage();
                    }else{
                        this.mensaje("La contrase??a ingresada y la confirmaci??n no coinciden", "error");
                    }
                
            }else{
                this.mensaje("Por favor rellene todos los campos", "error");
            }
        },
        clearFields(){//limpiar?? los campos del formulario de registro de usuarios al crear la cuenta
            this.newUser = {
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

                    this.genCode = setInterval(genCode2, 30000);
                    this.startTimer = setInterval(myTimer, 1000);
                   

                    //se abre la modal y ese boton redirige a una nueva funcion 'validateCode'
                    btn = document.getElementById('code');
                    btn.click();
                    this.email = '';
                    this.password = '';
                   
                }
                else{

                    this.mensaje('Ha iniciado sesi??n correctamente', 'success');
                    this.email = '';
                    this.password = '';
                    setTimeout(function(){     
                        window.location.href = "app.html";
                    
                    }.bind(this), 3000);

                }
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
                title: '??Seguro que desea cerrar sesi??n?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'S??, cerrar sesi??n',
                cancelButtonText: 'Cancelar',
                reverseButtons: true
            }).then((result) => {
                if (result.isConfirmed) {
                    this.user = '';
                    this.updateLocalStorage();
                    this.mensaje("Se ha cerrado la sesi??n", "success");
                    setTimeout(function(){ location.href = "login.html" }, 1500);
                } else if (
                    result.dismiss === Swal.DismissReason.cancel
                ) {
                }
            })
        },
        timer(){
            
            if(this.seconds != 0){
                this.seconds -= 1;
                console.log(this.seconds);
            }else{
                this.seconds = 30;
                console.log(this.seconds);
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
                    console.log(this.code);
        },






        getRoomIndex(){
            const index = this.rooms.findIndex((object) => {
                return object.roomCode == this.option;
            });
            this.rpos = index;
        },
        chairStatus(item, index){
            if (this.nTickets > 0) {
                this.nTickets -= 1;
                item.status = 'unavaliable';
                this.chairPos = index;
                if (this.nTickets == 0) {
                    this.mensaje('Ha alcanzado la cantidad m??xima de puestos seg??n sus tickets', 'warning');
                    setTimeout(() => { this.mensaje('Por favor haga click en comprar', 'warning'); }, 2500);
                }
            }
        },
        saveChairStatus(){
            if (this.pMethod.length > 0) {
                this.mensaje('Pago exitoso, gracias por preferirnos!', 'success');
                this.option = '';
                this.openPayment = false;
                this.pMethod = '',
                this.updateLocalStorage();
            }else{
                this.mensaje('Por favor seleccione un m??todo de pago', 'error');
            }
            
        },
        goToPay(){
            if (this.nTickets == 0) {
                switch (this.openPayment) {
                    case true:
                        this.openPayment = false;
                        break;
                    case false:
                        this.openPayment = true;
                        break;
                
                    default:
                        break;
                }
            }else{
                this.mensaje('Seleccione los puestos', 'warning');
            }
            
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
        }else{
            this.user = '';
        }
        if (localStorage.getItem('rooms') !== null) {
            this.rooms = JSON.parse(localStorage.getItem('rooms'));
        }else{
            this.rooms = this.rooms;
        }
    }
});
