//LOGIC

var app = new Vue({
    el: '#app',
    data: {
        users: [
          
        ],

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
       
        user: null,
        option: '',
        rpos: 0,
        openPayment: false,
        nTickets: 0,
        pMethod: '',
        showBody: true,
    },
    methods: {//metodos a trabajar en el proyecto -- VARIABLES EN camelCase
       
      
       
     
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
                    this.mensaje('Ha alcanzado la cantidad máxima de puestos según sus tickets', 'warning');
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
                this.mensaje('Por favor seleccione un método de pago', 'error');
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
            this.showBody = false;
            this.mensaje('No hay ningun usuario registrado, por favor ingresa sesion', 'error');
            setTimeout(function(){ location.href = "login.html" }, 3000);

        }
        if (localStorage.getItem('rooms') !== null) {
            this.rooms = JSON.parse(localStorage.getItem('rooms'));
        }else{
            this.rooms = this.rooms;
        }
    }
});
