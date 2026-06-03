import Swal from 'sweetalert2'

export const apiErrorAlert = (message: string) => {
  Swal.fire({
    icon: 'error',
    title: 'Erro',
    text: message,
    confirmButtonColor: '#921616',
  })
}
