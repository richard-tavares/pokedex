import Swal from 'sweetalert2';

export const apiErrorAlert = (message: string) => {
    Swal.fire({
        title: 'Erro',
        text: message || 'Não foi possível obter dados.',
        icon: 'error',
        confirmButtonText: 'OK'
    });
};